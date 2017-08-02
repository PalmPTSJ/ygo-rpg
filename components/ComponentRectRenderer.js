class ComponentRectRenderer extends ComponentRenderer { // Render rectangle
    constructor(name) {
        super(name);
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            color : this.color
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.color = data.color;
        return this;
    }
    
    render() {
        if(!this.gameObject.getEnabledComponent(ComponentTransform)) {
            return;
        }
        var transform = this.gameObject.getEnabledComponent(ComponentTransform);
        
        ctx.save();
        transform.setupCanvas();
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(0,0,transform.size.width,transform.size.height);
        ctx.fill();
        
        ctx.restore();
    }
}

classList["ComponentRectRenderer"] = ComponentRectRenderer;