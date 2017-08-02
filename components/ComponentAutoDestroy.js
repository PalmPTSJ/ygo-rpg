class ComponentAutoDestroy extends Component {
    constructor(name) {
        super(name);
        this.countdown = 120;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            countdown : this.countdown
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.countdown !== undefined) this.countdown = data.countdown;
        return this;
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        this.countdown--;
        if(this.countdown <= 0) {
            // destroy
            server_deleteObject(this.gameObject.id);
        }
    }
}

classList["ComponentAutoDestroy"] = ComponentAutoDestroy;