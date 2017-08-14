class RPG_ComponentUIRenderer extends ComponentRenderer {
    constructor(name) {
        super(name);
    }
    
    render() {
        let player = this.gameObject.getEnabledComponent(RPG_ComponentPlayer);
        
        if(!player || playerObject != player.gameObject) return; // render only for owner
        
        ctx.save();
        ctx.resetTransform();
        ctx.font = "24px Roboto";
        ctx.fillText("Lv 1",150,120);
        ctx.fillText(""+player.username,250,120);
        
        ctx.beginPath();
        ctx.arc(75,75,50,0,Math.PI*2);
        ctx.stroke();

        ctx.restore();
    }
    
}

classList["RPG_ComponentUIRenderer"] = RPG_ComponentUIRenderer;
