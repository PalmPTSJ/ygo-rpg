// Base class for any renderer class

class ComponentRenderer extends Component {
    constructor(name) {
        super(name);
        this.enabled = true;
        this.enabledThisFrame = true;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            enabled : this.enabled,
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.enabled !== undefined) this.enabled = data.enabled;
        return this;
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        this.render();
        
        return true;
    }

    render() {} // (Abstract: Every renderer have to implement this function)
    
}

classList["ComponentRenderer"] = ComponentRenderer;