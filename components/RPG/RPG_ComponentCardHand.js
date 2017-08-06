class RPG_ComponentUIRenderer extends ComponentRenderer {
    constructor(name) {
        super();
    }
    /*toJSON() {
        return Object.assign(super.toJSON(),{
            username : this.username,
            online : this.online
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.username !== undefined) this.username = data.username;
        if(data.online !== undefined) this.online = data.online;
        
        return this;
    }*/
    
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
