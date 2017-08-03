class ComponentNetwork extends Component {
    constructor(name) {
        super(name);
        this.lastJSON = "";
        this.lastTimestamp = null;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{});
    }
    fromJSON(data) {
        super.fromJSON(data);
        return this;
    }
    onNetworkUpdate(data) {
        this.gameObject.fromJSON(data);
        this.lastJSON = JSON.stringify(this.gameObject.toJSON()); // force sync
    }
    onStart() {
        this.lastJSON = JSON.stringify(this.gameObject.toJSON());
    }
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(this.lastTimestamp == null || timestamp-this.lastTimestamp >= 50) { // update every 50 ms
            var nowJSON = JSON.stringify(this.gameObject.toJSON());
            if(nowJSON != this.lastJSON) {
                this.lastJSON = nowJSON;
                this.gameObject.fromJSON(this.gameObject.toJSON()); // Force local update
                socket.emit('updateObject',this.gameObject.toJSON()); // sync gameObject
            }
            this.lastTimestamp = timestamp;
        }
        return true;
    }
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        this.onUpdate(timestamp);
        return true;
    }
}

classList["ComponentNetwork"] = ComponentNetwork;