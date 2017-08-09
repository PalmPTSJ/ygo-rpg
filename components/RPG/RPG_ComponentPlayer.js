class RPG_ComponentPlayer extends Component {
    constructor(name) {
        super();
        
        this.username = ""; // bind with login data
        this.online = false;
        
        this.server_socket = null; // [Server] Reference to owner's socket
        
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            username : this.username,
            online : this.online
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.username !== undefined) this.username = data.username;
        if(data.online !== undefined) this.online = data.online;
        
        return this;
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        if(!this.online) {
            this.gameObject.getComponents(ComponentRenderer).forEach((renderer)=>{
                renderer.disableForThisFrame(timestamp);
            });
        }
        
        if(playerObject != null && playerObject == this.gameObject) {
            this.online = true;
            this.gameObject.ownerId = myPlayerInfo.id;
            // owner
            let transform = this.gameObject.getEnabledComponent(ComponentTransform);
            if(isKeyDown['A'.charCodeAt(0)]) {
                transform.pos.x -= 5;
            }
            if(isKeyDown['S'.charCodeAt(0)]) {
                transform.pos.y += 5;
            }
            if(isKeyDown['D'.charCodeAt(0)]) {
                transform.pos.x += 5;
            }
            if(isKeyDown['W'.charCodeAt(0)]) {
                transform.pos.y -= 5;
            }
            
            // move camera to follow
            canvasX = (transform.pos.x - canvas.width/2 + transform.size.width/2);
            canvasY = (transform.pos.y - canvas.height/2  + transform.size.height/2);
        }
        
        return true;
    }
    
    onLogout() { // server
        this.online = false;
        this.server_socket = null;
        
        playerSavedData[this.username] = this.gameObject.toJSON();
    }
    
    onCreate(username) { // [SERVER] on create new character
        this.username = username;
        //this.gameObject.getComponentByName("playerNameRenderer").text = username;
        let character = this.gameObject.getEnabledComponent(RPG_ComponentCharacter);
        character.characterName = username;
    }
    
    onKeyDown(key) {
        super.onKeyDown(key);
    }
    
}

classList["RPG_ComponentPlayer"] = RPG_ComponentPlayer;

if(!isServer) {
    function onMouseDown_player(e) {
        if(e.button != 0) return true; // only capture left click
        var clickPos = {
            x : canvasX + canvas.width/2 + ((e.pageX - $(canvas).offset().left)-canvas.width/2)/canvasScale,
            y : canvasY + canvas.height/2 + ((e.pageY - $(canvas).offset().top)-canvas.height/2)/canvasScale
        }
        console.log("MD",clickPos);
        
        for(var i = objectList.length-1;i >= 0;i--) { // Select from high Z to low Z item
            var obj = objectList[i];
            if(obj.getEnabledComponent(ComponentCursorCollider) && obj.getEnabledComponent(ComponentCursorCollider).isOver(clickPos)) {
                // click on this object , attack !
                if(obj.getEnabledComponent(RPG_ComponentHealth) == null) continue; // Can only attack object with health
                
                playerObject.getEnabledComponent(RPG_ComponentAttack).setAttackTarget(obj.id);

                break;
            }
        }
    }
    canvas.addEventListener("mousedown",onMouseDown_player);
    
    function onMouseUp_player(e) {
        if(e.button != 0) return true; // only capture left click
        playerObject.getEnabledComponent(RPG_ComponentAttack).setAttackTarget(null);
    }
    canvas.addEventListener("mouseup",onMouseUp_player);
}
