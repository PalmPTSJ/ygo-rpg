class RPG_ComponentHealthRenderer extends ComponentRenderer {
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
        let health = this.gameObject.getEnabledComponent(RPG_ComponentHealth);
        
        let transform = this.gameObject.getEnabledComponent(ComponentTransform);
        
        // draw health bar above character
        ctx.save();
        transform.setupCanvas();
        
        ctx.globalAlpha = 1;
        ctx.lineWidth=10;
        
        ctx.strokeStyle = "#F00";
        ctx.beginPath();
        ctx.moveTo(0,-20);
        ctx.lineTo(transform.size.width,-20);
        ctx.stroke();
        
        ctx.strokeStyle = "#0F0";
        ctx.beginPath();
        ctx.moveTo(0,-20);
        ctx.lineTo(transform.size.width * health.HP / health.maxHP,-20);
        ctx.stroke();
        
        ctx.restore();
        
        // draw UI Healthbar for owner
        let player = this.gameObject.getEnabledComponent(RPG_ComponentPlayer);
        if(player && playerObject == player.gameObject) {
            ctx.save();
            ctx.resetTransform();
            
            
            ctx.lineWidth=30;
            ctx.strokeStyle = "#424242";
            ctx.beginPath();
            ctx.moveTo(150 - 2,40);
            ctx.lineTo(450 + 2,40);
            ctx.stroke();
            
            ctx.lineWidth=26;
            ctx.strokeStyle = "#ff5722";
            ctx.beginPath();
            ctx.moveTo(150,40);
            ctx.lineTo(150 + 300 * health.HP / health.maxHP,40);
            ctx.stroke();
            
            ctx.font = "20px Roboto";
            ctx.fillStyle = "#FFF";
            ctx.textAlign = "center";
            ctx.fillText(""+health.HP+"/"+health.maxHP,300,46);

            ctx.restore();
        }
    }
    
}

classList["RPG_ComponentHealthRenderer"] = RPG_ComponentHealthRenderer;
