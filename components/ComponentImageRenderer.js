class ComponentImageRenderer extends ComponentRenderer { // This component render object's image
    constructor(name) {
        super(name);
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            url : this.url,
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.url) this.applyImage(data.url);
        return this;
    }
    
    render() {
        if(!this.gameObject.getEnabledComponent(ComponentTransform)) {
            return;
        }
        if(!this.url || !this.img) {
            return;
        }
        var transform = this.gameObject.getEnabledComponent(ComponentTransform);
        if(this.img.complete) {
            ctx.save();
            transform.setupCanvas();
            ctx.drawImage(this.img,0,0,transform.size.width,transform.size.height);
            ctx.restore();
        }
    }
    
    applyImage(url) {
        this.url = url;
        this.img = new Image;
        if(this.url) this.img.src = this.url;
        
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        builder.addTextField("URL",builder.autoEvent({ get:()=>{return this.url}, set:(val)=>{this.url = val} }));
    }
}

classList["ComponentImageRenderer"] = ComponentImageRenderer;