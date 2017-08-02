class ComponentObjectInHand extends Component {
    constructor(name) {
        super(name);
        this.player = 0;
        this.handImg = new Image;
        this.handImg.src = "http://icons.iconarchive.com/icons/icons8/ios7/128/Hands-Hand-icon.png";
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            player : this.player
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.player !== undefined) this.player = data.player

        return this;
    }
    
    onStart() {
        super.onStart();
        if(myPlayerInfo.id != this.player && selectingObj.has(this.gameObject)) selectingObj.delete(this.gameObject);
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        if(myPlayerInfo.id != this.player) {
            // cursor collider
            this.gameObject.getComponents(ComponentCursorCollider).forEach((comp)=>{
                comp.disableForThisFrame(timestamp);
            })
            this.gameObject.getComponents(ComponentRenderer).forEach((renderer)=>{
                renderer.disableForThisFrame(timestamp);
            });
        }
        
        // draw highlight
        if(myPlayerInfo.id == this.player) ctx.fillStyle = "#8FF";
        else ctx.fillStyle = "#FA0";
        
        var transform = this.gameObject.getEnabledComponent(ComponentTransform);
        
        ctx.save();
        transform.setupCanvas();
        
        ctx.globalAlpha = 0.4;
        ctx.fillRect(0,0,transform.size.width,transform.size.height);
        ctx.globalAlpha = 1;
        
        if(myPlayerInfo.id != this.player) {
            ctx.drawImage(this.handImg,0,0,transform.size.width,transform.size.height);
        }
        
        ctx.restore();
        
        return true;
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        builder.addTextField("Owner",builder.autoEvent({ get:()=>{return this.player}, set:(val)=>{this.player = val} }));
        
    }

}

classList["ComponentObjectInHand"] = ComponentObjectInHand;