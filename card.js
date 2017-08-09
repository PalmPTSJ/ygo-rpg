class Card {
    constructor () {
        this.name = "";
        this.effectText = "";
        this.cardId = "";
        this.cardImage = "";
        
        this.cardOwner = null;
    }
    toJSON() {
        return {
            
        };
    }
    fromJSON(data) {
        return this;
    }
    
    getOwnerObject() {
        return this.cardOwner;
    }
    
    getCardManager() {
        return this.cardOwner.getComponent(RPG_ComponentCardManager);
    }
    
    getAvailableAction() {
        // return list of available action
        return [{actionId:"more_details",text:"More details"}];
    }
    
    onAction(action) {
        if(action.actionId == "more_details") {
            console.log("Card detail :",this.name,this.effectText);
        }
    }
    activate(cm) {
        // do something here
    }
}


// example
let card1 = new Card();
card1.id = "card_1";
card1.name = "Heal";
card1.effectText = "Heals 100 HP. [EV]";
card1.activate = function(cm) {
    cm.gameObject.getComponent(RPG_ComponentHealth).HP += 100;
};


var cardList = {};
cardList[card1.id] = card1;