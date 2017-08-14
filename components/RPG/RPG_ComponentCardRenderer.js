// Renderer for CardDeck, CardManager

class RPG_ComponentCardRenderer extends ComponentRenderer {
    constructor(name) {
        super(name);
        this.cardBackImg = new Image;
        this.cardBackImg.src = "resources/card/cardImage/cardBack.png";
    }
    
    render() {
        let player = this.gameObject.getEnabledComponent(RPG_ComponentPlayer);
        
        if(!player || playerObject != player.gameObject) return; // render only for owner
        
        let cm = this.gameObject.getEnabledComponent(RPG_ComponentCardManager);
        let deck = this.gameObject.getEnabledComponent(RPG_ComponentCardDeck);
        ctx.save();
        ctx.resetTransform();
        
        // draw deck
        if(deck.currentDeck.length > 0)
            ctx.drawImage(this.cardBackImg,canvas.width-100,canvas.height-140,80,120);
        
        // draw hand
        
        for(let i = 0;i < cm.hand.length;i++) {
            if(cm.hand[i] != null)
                ctx.drawImage(cardList[cm.hand[i]].img,canvas.width-600+100*(i),canvas.height-140,80,120);
        }
        
        ctx.restore();
    }
    
}

classList["RPG_ComponentCardRenderer"] = RPG_ComponentCardRenderer;
