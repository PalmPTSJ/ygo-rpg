class ComponentTransform extends Component {
    constructor(name) {
        super(name);
        this.parent = null;
        this.pos = {x:0,y:0,z:0};
        this.lastPos = {x:0,y:0,z:0};
        this.size = {width:0,height:0};
        this.rotation = 0; // CW
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            pos         : Object.assign({},this.pos),
            size        : Object.assign({},this.size),
            parentId    : this.parent==null?null:this.parent.getGameObject().id,
            rotation    : this.rotation
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        //if(this.gameObject != null) console.log(this.gameObject.id,data.pos);
        if(data.pos !== undefined) this.pos = data.pos;
        if(data.size !== undefined) this.size = data.size;
        this.parent = data.parentId==null?null:objectList[data.parentId];
        if(data.rotation !== undefined) this.rotation = data.rotation;
        return this;
    }
    
    setPos(newPos) {
        if(newPos.x != undefined) this.pos.x = newPos.x;
        if(newPos.y != undefined) this.pos.y = newPos.y;
        if(newPos.z != undefined) this.pos.z = newPos.z;
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(this.lastPos.z != this.pos.z) {
            sortObjectList();
        }
        this.lastPos = {
            x:this.pos.x,
            y:this.pos.y,
            z:this.pos.z
        }
        return true;
    }
    
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 'q'.charCodeAt(0)) { // (Q) = Rotate 15 CCW
            this.rotation -= 15;
        }
        if(key == 'e'.charCodeAt(0)) { // (E) = Rotate 15 CW
            this.rotation += 15;
        }
        if(key == 'x'.charCodeAt(0)) { // (x) = Put object over
            this.pos.z++;
        }
        if(key == 'z'.charCodeAt(0)) { // (z) = Put object under
            this.pos.z--;
        }
        
        if(this.rotation < 0) this.rotation += 360;
        if(this.rotation >= 360) this.rotation -= 360;
    }
    
    getAbsolutePos() {
        if(this.parent != null) {
            let pos = this.parent.getAbsolutePos();
            return {x:pos.x+this.pos.x,y:pos.y+this.pos.y,z:pos.z + this.pos.z};
        }
        else return this.pos;
    }
    
    setupCanvas() { // set canvas to match this (position , rotation)
        if(this.parent != null) this.parent.getEnabledComponent(ComponentTransform).setupCanvas(); // setup from parent first
        ctx.translate(this.pos.x + this.size.width/2,this.pos.y + this.size.height/2);
        ctx.rotate(this.rotation*Math.PI/180);
        ctx.translate(-this.size.width/2,-this.size.height/2);
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        
        // Pos
        builder.addTextField("X",builder.autoEvent({ get:()=>{return this.pos.x}, set:(val)=>{this.pos.x = parseFloat(val)} }));
        builder.addTextField("Y",builder.autoEvent({ get:()=>{return this.pos.y}, set:(val)=>{this.pos.y = parseFloat(val)} }));
        builder.addTextField("Z",builder.autoEvent({ get:()=>{return this.pos.z}, set:(val)=>{this.pos.z = parseFloat(val)} }));
        
        // Size
        builder.addTextField("Width",builder.autoEvent({ get:()=>{return this.size.width}, set:(val)=>{this.size.width = parseFloat(val)} }));
        builder.addTextField("Height",builder.autoEvent({ get:()=>{return this.size.height}, set:(val)=>{this.size.height = parseFloat(val)} }));
        
        // Rotation
        builder.addTextField("Rotation",builder.autoEvent({ get:()=>{return this.rotation}, set:(val)=>{this.rotation = parseFloat(val)} }));
    }   
}

classList["ComponentTransform"] = ComponentTransform;