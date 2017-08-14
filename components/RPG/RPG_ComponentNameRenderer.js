class RPG_ComponentNameRenderer extends ComponentRenderer {
    constructor(name) {
        super();
    }
    
    render() {
        let character = this.gameObject.getEnabledComponent(RPG_ComponentCharacter);
        let transform = this.gameObject.getEnabledComponent(ComponentTransform);
        
        ctx.save();
        transform.setupCanvas();
        
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top"; 
        
        let txt = "[Lv " + character.level + "] " + character.characterName;
        
        ctx.fillStyle = "#FFF"
        ctx.fillText(txt,transform.size.width/2,transform.size.height + 10);
        
        ctx.strokeStyle = "#000"
        ctx.strokeText(txt,transform.size.width/2,transform.size.height + 10);
        
        ctx.restore();
    }
    
}

classList["RPG_ComponentNameRenderer"] = RPG_ComponentNameRenderer;
