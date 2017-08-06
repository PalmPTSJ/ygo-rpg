class Card {
    constructor () {
        this.name = "";
        this.effectText = "";
        this.cardId = "";
        this.currentPlace = "HAND"; // DECK, HAND , FIELD , GRAVEYARD , BANISHED
        this.currentStatus = "SET"; // SET, REVEAL (Apply everywhere)
        
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
}

class MagicCard extends Card { // implement basic activation system from hand / set
    constructor() {
        
    }
    
    isActivatible() {
        // default action, activatible from hand
        if(this.currentPlace == "HAND") return true;
        return false;
    }
    
    getAvailableAction() {
        let actions = super.getAvailableAction();
        
        let cm = this.getCardManager();
        
        if(this.currentPlace == "HAND") {
            if(cm.hasFreeSpellSlot()) {
                actions.push({actionId:"set",text:"Set"});
                if(this.isActivatible()) {
                    actions.push({actionId:"activate",text:"Activate"});
                }
            }
        }
        else if(this.currentPlace == "FIELD") {
            if(this.currentStatus == "SET") {
                if(this.isActivatible()) {
                    actions.push({actionId:"activate",text:"Activate"});
                }
            }
        }
    }
    
    onAction(action) {
        if(action.actionId == "activate") {
            // activate this card
            this.activate();
            // send to graveyard
            let cm = this.getCardManager();
            cm.sendToGraveyard(this);
        }
        else {
            super.onAction(action);
        }
    }
    
    activate() {
        // do something here
    }
}


// example
let card1 = new MagicCard();
card1.id = "card_1";
card1.name = "Heal";
card1.effectText = "Heals 100 HP. [EV]";
card1.activate = function() {
    this.cardOwner.getComponent(RPG_ComponentHealth).HP += 100;
};


var cardList = {};
cardList[card1.id] = card1;