class Card {
    constructor () {
        this.name = "";
        this.effectText = "";
        this.cardId = "";
        this.cardImage = "";
        if(!isServer) this.img = new Image;
        else this.img = {};
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
card1.img.src = "resources/card/cardImage/card_1.png";
card1.name = "Heal";
card1.effectText = "Heals 100 HP. [EV]";
card1.activate = function(cm) {
    cm.gameObject.getComponent(RPG_ComponentHealth).HP += 100;
};



let card2 = new Card();
card2.id = "card_2";
card2.name = "Black hole";
card2.effectText = "Deals 100 damage to enemy in 900 radius.";
card2.activate = function(cm) {
    // gg
};
card2.img.src = "resources/card/cardImage/card_2.png";



var cardList = {};
cardList[card1.id] = card1;
cardList[card2.id] = card2;