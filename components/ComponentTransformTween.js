class ComponentTransformTween extends ComponentTransform {
    constructor(name) {
        super(name);
        this.targetPos = {x:0,y:0,z:0};
        this.moveSpeed = 5;
    }
    toJSON() {
        return Object.assign(super.toJSON(),{
            targetPos : Object.assign({},this.targetPos),
            moveSpeed : this.moveSpeed
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        if(data.targetPos != undefined) this.setTargetPos(data.targetPos);
        if(data.moveSpeed != undefined) this.moveSpeed = data.moveSpeed;
        return this;
    }
    
    setPos(newPos) { // force set position (no tween)
        super.setPos(newPos);
        if(newPos.x != undefined) this.targetPos.x = newPos.x;
        if(newPos.y != undefined) this.targetPos.y = newPos.y;
        if(newPos.z != undefined) this.targetPos.z = newPos.z;
    }
    
    setTargetPos(newPos) { // set target (tween)
        if(newPos.x != undefined) this.targetPos.x = newPos.x;
        if(newPos.y != undefined) this.targetPos.y = newPos.y;
        if(newPos.z != undefined) this.targetPos.z = newPos.z;
    }
    RPC_setTargetPos(params) {
        this.setTargetPos(params.newPos);
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        return true;
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        // tween
        this.pos.z = this.targetPos.z; // no z tween
        if(this.pos.x != this.targetPos.x || this.pos.y != this.targetPos.y) {
            if(Math.hypot(this.targetPos.x-this.pos.x,this.targetPos.y-this.pos.y) <= this.moveSpeed) {
                // reach
                this.pos.x = this.targetPos.x;
                this.pos.y = this.targetPos.y;
            }
            else {
                let angle = Math.atan2(this.targetPos.y-this.pos.y,this.targetPos.x-this.pos.x);
                this.pos.x += Math.cos(angle) * this.moveSpeed;
                this.pos.y += Math.sin(angle) * this.moveSpeed;
            }
        }
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        
        // Pos
        builder.addTextField("Target X",builder.autoEvent({ get:()=>{return this.targetPos.x}, set:(val)=>{this.targetPos.x = parseFloat(val)} }));
        builder.addTextField("Target Y",builder.autoEvent({ get:()=>{return this.targetPos.y}, set:(val)=>{this.targetPos.y = parseFloat(val)} }));
        builder.addTextField("Move speed",builder.autoEvent({ get:()=>{return this.moveSpeed}, set:(val)=>{this.moveSpeed = parseFloat(val)} }));
    }   
}

classList["ComponentTransformTween"] = ComponentTransformTween;