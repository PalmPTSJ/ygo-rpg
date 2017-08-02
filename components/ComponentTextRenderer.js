class ComponentTextRenderer extends ComponentRenderer {
    constructor(name) {
        super(name);
        this.text = "";
        this.font = "30px Arial";
        
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            text : this.text,
            font : this.font
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.text !== undefined) this.text = data.text;
        if(data.font !== undefined) this.font = data.font;
        return this;
    }

    render() {
        if(!this.gameObject.getEnabledComponent(ComponentTransform)) {
            console.log("[TextRenderer] can't find transform");
            return;
        }
        var transform = this.gameObject.getEnabledComponent(ComponentTransform);
        ctx.save();
        transform.setupCanvas();
        ctx.textBaseline="top"; 
        ctx.font = this.font;
        ctx.fillText(this.text,0,0);
        ctx.restore();
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        // Text
        builder.addTextField("Text",builder.autoEvent({ get:()=>{return this.text}, set:(val)=>{this.text = val} }));
        builder.addTextField("Font",builder.autoEvent({ get:()=>{return this.font}, set:(val)=>{this.font = val} }));
    }   
}

classList["ComponentTextRenderer"] = ComponentTextRenderer;