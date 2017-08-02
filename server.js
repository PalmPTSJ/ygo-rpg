var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var program = require('commander');

program
    .version('1.0')
    .option('-p, --port [PORT]', 'set server\'s port [8080]',8080)
    .option('-l, --load [filename]', 'load save file from filename')
    //.option('-s, --save [filename]', 'set filename to save data to')
    .parse(process.argv);

app.listen(program.port);
localLog("Server started at port "+program.port);

function handler (req, res) {
    if(req.url == '/') req.url = '/client.html';
    fs.readFile(__dirname + req.url,
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading '+req.url);
        }
        res.writeHead(200);
        res.end(data);
    });
}


function localLog(data) { // log on server only
    let now = new Date();
    let logText = ("[" + ("0"+now.getHours()).substr(-2) + ':' + ("0"+now.getMinutes()).substr(-2) + ":" + ("0"+now.getSeconds()).substr(-2) + "] ") + data;
	console.log(logText);
}
function log(data) { // global log (both on server and client)
    io.emit('log',data);
    localLog(data);
}
function getDebugName(socket) { return "<"+socket.name+":"+socket.id+">"; }

var objectList = [];
var prefabList = {};

var objectIdGenerator = 0;
var prefabIdGenerator = 0;
var playerIdGenerator = 0;

var idGenerator = 0;

/// Copy client's requirement
global.objectList = objectList;
global.isServer = true;
global.generateNewId = function() {
    return "SERV_"+(idGenerator++);
}
var components = require('./server_components.js')(global);
for(var comp in global.classList) {
    global[comp] = global.classList[comp];
}

function getObjectFromId(id) {
    if(id == null) return null;
    for(var obj of objectList) {
        if(obj.id == id) return obj;
    }
    return null;
}
global.getObjectFromId = getObjectFromId;

global.Image = class {
    constructor() {this.src = undefined;}
};
global.socket = io;

global.server_createPrefab = function(data) {
    if(data.id == null) {
        let id = "SP_"+(prefabIdGenerator++);
        data.id = id;
    }
    localLog("New prefab "+data.id+" created");
    
    let prefab = new EmptyPrefab();
    prefab.fromJSON(data);
    prefabList[data.id] = prefab;
    
    io.emit('newPrefab',data);
    
    return data.id;
}

global.server_createObject = function(data) {
    if(data.id == null) {
        let id = "SO_"+(objectIdGenerator++);
        data.id = id;
    }
    localLog("New object "+data.id+" created");
    
    let obj = new GameObject();
    obj.fromJSON(data);
    objectList.push(obj);
    
    io.emit('newObject',data);
    
    return data.id;
}
global.server_deleteObject = function(id) {
    for(let i = 0;i < objectList.length;i++) {
        if(objectList[i].id == id) {
            // delete
            objectList[i].destroy();
            objectList.splice(i,1);
            io.emit('deleteObject',id);
        }
    }
}

function saveGame(filename) {
    let prefabData = {};
    for(let id in prefabList) {
        let prefab = prefabList[id];
        prefabData[id] = prefab.toJSON();
    }
    
    let objectData = [];
    for(let obj of objectList) {
        objectData.push(obj.toJSON());
    }
    
    let data = {
        prefab : prefabData,
        object : objectData,
        idGenerator : idGenerator,
        objectIdGenerator : objectIdGenerator,
        prefabIdGenerator : prefabIdGenerator
    };
    
    localLog("Saving data to : "+filename);
    fs.writeFileSync(filename,JSON.stringify(data, null, 4));
    localLog("Save completed");
}

function loadGame(filename) {
    // clear current game [TODO : Send clear event]
    objectList = [];
    prefabList = {};
    
    localLog("Loading data from : "+filename);
    
    let dataStr = fs.readFileSync(filename);
    let data = JSON.parse(dataStr);
    
    // load prefabs
    let prefabData = data.prefab;
    for(let id in prefabData) {
        global.server_createPrefab(prefabData[id]);
    }
    
    // load objects
    let objectData = data.object;
    for(let obj of objectData) {
        global.server_createObject(obj);
    }
    
    // load other parameters
    idGenerator = data.idGenerator;
    objectIdGenerator = data.objectIdGenerator;
    prefabIdGenerator = data.prefabIdGenerator;
    
    localLog("Load completed");
}

if(program.load) {
    loadGame(program.load);
}

localLog("Server ready !");
io.on('connection',function (socket) {
    
	log("New connection from "+socket.request.connection.remoteAddress);
    socket.name = "anonymous"+playerIdGenerator; // default name
    socket.emit('setPlayerInfo',{
        id : playerIdGenerator++ ,
        name : socket.name
    });
    // send all object and prefab
    for(var id in prefabList) {
        socket.emit('newPrefab',prefabList[id].toJSON());
    }
    for(var obj of objectList) {
        socket.emit('newObject',obj.toJSON());
    }
    
    /// Players Event ///
	socket.on('setName',function (name) {
		socket.name = name; 
		log(getDebugName(socket)+" change name to : "+name);
	});
	socket.on('disconnect',function () {
		log(getDebugName(socket)+" disconnected");
	});
	
    /// Game Event ///
	socket.on('createPrefab',function (data) {
        global.server_createPrefab(data);
	});
	socket.on('createObject',function (data) {
        global.server_createObject(data);
	});
    socket.on('updateObject',function (data) {
        let obj = getObjectFromId(data.id);
        if(obj != null) {
            obj.getEnabledComponent(ComponentNetwork).onNetworkUpdate(data);
            socket.broadcast.emit('updateObject',data); // broadcast to everyone except sender
        }
    });
    socket.on('callRPC',function(data) {
        var obj = getObjectFromId(data.objId);
        if(obj == null) return;
        for(var comp of obj.components) {
            if(comp.id == data.compId) {
                comp.callRPC(data.func,data.params);
                break;
            }
        }
    });
    socket.on('deleteObject',function (id) {
        global.server_deleteObject(id);
    });
    
    /// Server Events ///
    socket.on('saveGame',function (filename) {
        saveGame(filename);
    });
    socket.on('loadGame',function (filename) {
        loadGame(filename);
    });
});

function update() {
    var timestamp = Date.now();
    for(var obj of objectList) {
        obj.serverUpdate(timestamp);
    }
}

var gameInterval = setInterval(update,1000/60);