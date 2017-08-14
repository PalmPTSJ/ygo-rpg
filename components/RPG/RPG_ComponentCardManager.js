class RPG_ComponentCardManager extends Component {
    constructor(name) {
        super();
        
        this.playing = false;
        this.hand = [null, null, null, null, null];
        
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
        for(let i = 0;i < 5;i++) {
            if(this.hand[i] == null) {
                // replace there
                this.hand[i] = cardId;
                break;
            }
        }
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(this.gameObject.isOwner()) {
            if(!this.playing) {
                // just play
                let deck = this.gameObject.getEnabledComponent(RPG_ComponentCardDeck);
                deck.onStartPlaying();
                
                this.playing = true;
            }
            // card activation
            for(let cardSlot = 0;cardSlot < 5;cardSlot++) {
                if(isKeyDown[(''+(cardSlot+1)).charCodeAt(0)]) {
                    // activate card at hand that card slot
                    if(this.hand[cardSlot] != null) {
                        // activate
                        cardList[this.hand[cardSlot]].activate(this);
                        this.hand[cardSlot] = null;
                    }
                }
            }
        }
        
    }
    
}

classList["RPG_ComponentCardManager"] = RPG_ComponentCardManager;
