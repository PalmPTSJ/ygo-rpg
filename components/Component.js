class Component extends Base {
    constructor(name) {
        super();
        
        if(name == undefined) name = this.constructor.name;
        this.name = name;
        
        this.enabled = true;
        this.enabledThisFrame = true;
        this.disabledForAFrame = false;
        this.disabledTimestamp = 0;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            id : this.id,
            enabled : this.enabled,
            name : this.name
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.id !== undefined) this.id = data.id;
        if(data.enabled !== undefined) this.enabled = data.enabled;
        if(data.name !== undefined) this.name = data.name;
        return this;
    }
    onStart() {
        
    }
    onDestroy() {
        
    }
    onKeyPress(key) {
        
    }
    onObjectDrop(objectList) {
        
    }
    
    onUpdate(timestamp) {
        if(this.enabled && !this.disabledForAFrame && this.disabledTimestamp != timestamp) {
            this.enabledThisFrame = true;
            return true;
        } 
        this.disabledForAFrame = false;
        this.enabledThisFrame = false;
        return false;
    }
    
    onServerUpdate(timestamp) {
        if(this.enabled && !this.disabledForAFrame && this.disabledTimestamp != timestamp) {
            this.enabledThisFrame = true;
            return true;
        } 
        this.disabledForAFrame = false;
        this.enabledThisFrame = false;
        return false;
    }
    
    callRPC(func,params) {
        // issue func call on server with params
        if(isServer) {
            this[func](params);
        }
        else {
            socket.emit('callRPC',{
                objId   : this.gameObject.id,
                compId  : this.id,
                func    : func,
                params  : params
            });
        }
    }
    
    callOnOwner(func,params) {
        // issue func call on owner
        if(isServer) {
            if(this.gameObject.ownerId == null) {
                // server is the owner
                this[func](params);
            }
            else {
                // call client
                if(playerMap[this.gameObject.ownerId] != undefined) {
                    playerMap[this.gameObject.ownerId].socket.emit('callOnOwner',{
                        objId   : this.gameObject.id,
                        compId  : this.id,
                        func    : func,
                        params  : params
                    });
                }
                else {
                    log("Can't find owner of "+this.gameObject.id+" ("+this.gameObject.ownerId+")");
                }
            }
        }
        else {
            // relay this to server (let server decide the owner)
            socket.emit('callOnOwner',{
                objId   : this.gameObject.id,
                compId  : this.id,
                func    : func,
                params  : params
            });
        }
        
    }
    
    disableForThisFrame(timestamp) {
        // disable this component for this frame
        this.disabledForAFrame = true;
        this.disabledTimestamp = timestamp;
        this.enabledThisFrame = false;
    }
    
    isEnabled() {
        return this.enabledThisFrame;
    }
    
    buildInspector(builder) {
        
    }
}
classList["Component"] = Component;