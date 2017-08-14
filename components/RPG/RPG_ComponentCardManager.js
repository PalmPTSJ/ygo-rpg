class RPG_ComponentCardManager extends Component {
    constructor(name) {
        super();
        
        this.playing = false;
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
        return this.playing;
    }
    
    getCardCount() {
        return this.hand.length;
    }
    
    addCardToHand(cardId) {
        this.hand.push(cardId);
        console.log("Card added",cardId);
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(!this.playing) {
            // just play
            let deck = this.gameObject.getEnabledComponent(RPG_ComponentCardDeck);
            deck.onStartPlaying();
            
            this.playing = true;
        }
        
    }
    
}

classList["RPG_ComponentCardManager"] = RPG_ComponentCardManager;
