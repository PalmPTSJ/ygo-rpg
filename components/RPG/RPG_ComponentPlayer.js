class RPG_ComponentPlayer extends Component {
    constructor(name) {
        super();
        
        this.playerUsername = ""; // bind with login data
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            playerUsername : this.playerUsername
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.playerUsername) this.playerUsername = data.playerUsername;
        return this;
    }
}

classList["RPG_ComponentPlayer"] = RPG_ComponentPlayer;
