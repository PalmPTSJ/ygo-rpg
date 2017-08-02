class ComponentNetwork2 extends Component {
    constructor(name) {
        super(name);
        this.lastJSON = "";
        this.lastTimestamp = null;
        this.owner = null;
        this.isFreeOwner = true; // true = any client can request to be the owner (if free) / false = client can't own this (server's object)
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            owner : this.owner,
            freeOwner : this.freeOwner
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.owner !== undefined) this.owner = data.owner;
        if(data.isFreeOwner !== undefined) this.isFreeOwner = data.isFreeOwner;
        return this;
    }
    onNetworkUpdate(data) {
        this.gameObject.fromJSON(data);
        this.lastJSON = JSON.stringify(this.gameObject.toJSON()); // force sync
    }
    onStart() {
        this.lastJSON = JSON.stringify(this.gameObject.toJSON());
    }
    
    checkNetworkUpdate(timestamp) {
        if(this.lastTimestamp == null || timestamp-this.lastTimestamp >= 50) { // update every 50 ms
            var nowJSON = JSON.stringify(this.gameObject.toJSON());
            if(nowJSON != this.lastJSON) {
                this.lastJSON = nowJSON;
                this.gameObject.fromJSON(this.gameObject.toJSON()); // Force local update
                socket.emit('updateObject',this.gameObject.toJSON()); // sync gameObject
            }
            this.lastTimestamp = timestamp;
        }
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(this.owner == myPlayerInfo.id) {
            checkNetworkUpdate(timestamp);
        }
        return true;
    }
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        if(this.owner == null) {
            checkNetworkUpdate(timestamp);
        }
        this.onUpdate(timestamp);
        return true;
    }
    
    // network function
    requestOwner() { // [Client] : This client wants to own this object
        if(isServer) return;
        
        this.callRPC(CMD_requestOwner,{clientId : myPlayerInfo.id});
    }
    CMD_requestOwner(params) { // [Server]
        if(!isServer) return;
        
        if(this.isFreeOwner && this.owner == null) { // if free, OK
            this.owner = params.clientId;
        }
    }
}

classList["ComponentNetwork2"] = ComponentNetwork2;