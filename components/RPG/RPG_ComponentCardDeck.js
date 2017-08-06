class RPG_ComponentCardDeck extends Component {
    constructor(name) {
        super();
        
        this.deck = []; // Deck card list (recipe)
        this.currentDeck = []; // Current playing deck
        this.drawCooldown = 1800;
        this.startingHand = 5;
        
        this.countdown = 0; // [LOCAL]
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            deck : this.deck,
            currentDeck : this.currentDeck,
            drawCooldown : this.drawCooldown,
            startingHand : this.startingHand
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.deck !== undefined) this.deck = data.deck;
        if(data.currentDeck !== undefined) this.currentDeck = data.currentDeck;
        if(data.drawCooldown !== undefined) this.drawCooldown = data.drawCooldown;
        if(data.startingHand !== undefined) this.startingHand = data.startingHand;
        
        return this;
    }
    
    draw() {
        
    }
    
    shuffle(arr) {
        for (let i = this.stackListId.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            var tmp = this.stackListId[j];
            this.stackListId[j] = this.stackListId[i - 1];
            this.stackListId[i - 1] = tmp;
        }
    }
    
    onStartPlaying() {
        // intialize deck
        
        // copy cards ???
        this.currentDeck = this.deck;
        
        for (let i = this.currentDeck.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            var tmp = this.currentDeck[j];
            this.currentDeck[j] = this.currentDeck[i - 1];
            this.currentDeck[i - 1] = tmp;
        }
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        if(this.gameObject.isOwner()) {
            // if playing
            let cardManager = this.gameObject.getEnabledComponent(RPG_ComponentCardManager);
            if(cardManager.isPlaying()) {
                // countdown until draw next card
                this.countdown--;
                if(this.countdown <= 0) {
                    // draw
                    draw();
                    this.countdown = this.drawCooldown;
                }
            }
        }
        
        return true;
    }
    
}

classList["RPG_ComponentCardDeck"] = RPG_ComponentCardDeck;
