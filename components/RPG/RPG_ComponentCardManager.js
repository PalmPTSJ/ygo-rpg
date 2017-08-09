class RPG_ComponentCardManager extends Component {
    constructor(name) {
        super();
        
        this.hand = [];
        
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            hand : this.hand,
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.hand !== undefined) this.hand = data.hand;
        
        return this;
    }
    
    isPlaying() {
        return true;
    }
    
    getCardCount() {
        return this.hand.length;
    }
    
    addCardToHand(cardId) {
        this.hand.push(cardId);
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
    }
    
}

classList["RPG_ComponentCardManager"] = RPG_ComponentCardManager;
