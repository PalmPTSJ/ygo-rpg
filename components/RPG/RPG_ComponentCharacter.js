class RPG_ComponentCharacter extends Component {
    constructor(name) {
        super();
        
        this.characterName = "";
        this.level = 1;
        
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            characterName : this.characterName,
            level : this.level
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.characterName !== undefined) this.characterName = data.characterName;
        if(data.level !== undefined) this.level = data.level;
        
        return this;
    }

}

classList["RPG_ComponentCharacter"] = RPG_ComponentCharacter;
