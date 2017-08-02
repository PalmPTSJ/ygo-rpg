class RPG_ComponentPlayer extends Component {
    constructor(name) {
        super();
        
        this.username = ""; // bind with login data
        this.online = false;
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
        
        if(playerObject == this.gameObject) {
            // owner
            let transform = this.gameObject.getEnabledComponent(ComponentTransform);
            //console.log("A");
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
        }
        
        return true;
    }
    
    onLogout() {
        this.online = false;
    }
    
    onKeyDown(key) {
        super.onKeyDown(key);
        
    }
    
}

classList["RPG_ComponentPlayer"] = RPG_ComponentPlayer;
