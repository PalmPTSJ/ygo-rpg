// RPG Expansion (for testing) by PalmPTSJ

class RPG_ComponentAttack extends Component {
    constructor(name) {
        super(name);
        this.attackSpeed = 1.5;
        this.attackDamage = {min:10,max:30};
        this.attackRange = 100;
        this.attackTargetId = null;
        
        // Server's parameter
        this.attackTarget = null;
        this.attackCooldown = 0;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            attackSpeed     : this.attackSpeed,
            attackDamage    : Object.assign({},this.attackDamage),
            attackRange     : this.attackRange,
            attackTargetId  : this.attackTargetId
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.attackSpeed !== undefined) this.attackSpeed = data.attackSpeed;
        if(data.attackRange !== undefined) this.attackRange = data.attackRange;
        if(data.attackDamage !== undefined) this.attackDamage = data.attackDamage;
        if(data.attackTargetId !== undefined) {
            this.attackTargetId = data.attackTargetId;
            if(this.attackTargetId == null) this.attackTarget = null;
            else this.attackTarget = getObjectFromId(this.attackTargetId);
        }
        return this;
    }
    
    onDestroy() {
        
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        let transform = this.gameObject.getEnabledComponent(ComponentTransform);
        
        this.attackTarget = getObjectFromId(this.attackTargetId);
        if(this.attackTarget != null) {
            let myPos = transform.pos;
            let targetPos = this.attackTarget.getEnabledComponent(ComponentTransform).pos;
            // draw attack target line
            ctx.save();
            
            ctx.strokeStyle = "#F00";
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.moveTo(myPos.x,myPos.y);
            ctx.lineTo(targetPos.x,targetPos.y);
            ctx.stroke();
            
            ctx.fillStyle = "#F00"
            ctx.fillRect(targetPos.x-5,targetPos.y-5,10,10);
            
            ctx.restore();
        }
        else {
            // draw walk line
            let transformTween = this.gameObject.getEnabledComponent(ComponentTransformTween);
            if(transformTween != null) {
                let myPos = transformTween.pos;
                let targetPos = transformTween.targetPos;
                if(myPos.x != targetPos.x || myPos.y != targetPos.y) {
                    // draw walking line
                    ctx.save();
                    
                    ctx.strokeStyle = "#AA0";
                    ctx.globalAlpha = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(myPos.x,myPos.y);
                    ctx.lineTo(targetPos.x,targetPos.y);
                    ctx.stroke();
                    
                    ctx.fillStyle = "#AA0"
                    ctx.fillRect(targetPos.x-5,targetPos.y-5,10,10);
                    
                    ctx.restore();
                }
            }
        }

        return true;
    }
    
    RPC_setAttackTarget(params) {
        this.attackTargetId = params.id;
        if(params.id == null) this.attackTarget = null;
        else this.attackTarget = getObjectFromId(this.attackTargetId);
    }
    
    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        // if attacking
        if(this.attackCooldown > 0) this.attackCooldown--;
        this.attackTarget = getObjectFromId(this.attackTargetId);
        if(this.attackTarget == null) {
            this.attackTargetId = null;
        }
        else {
            // if close enough
            let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
            let targetPos = this.attackTarget.getEnabledComponent(ComponentTransform).pos;
            if(Math.hypot(myPos.x-targetPos.x,myPos.y-targetPos.y) <= this.attackRange) {
                this.gameObject.getEnabledComponent(ComponentTransformTween).setPos(myPos); // stop walking
                // try to attack if cooldown ok
                if(this.attackCooldown <= 0) {
                    // attack
                    let dmg = Math.floor(Math.random()*(this.attackDamage.max-this.attackDamage.min+1)) + this.attackDamage.min;
                    
                    this.attackTarget.getEnabledComponent(RPG_ComponentHealth).takeDamage(dmg);
                    
                    this.attackCooldown = Math.round(120/this.attackSpeed);
                }
            }
            else {
                // walk there
                this.gameObject.getEnabledComponent(ComponentTransformTween).setTargetPos(targetPos);
            }
        }
        return true;
    }

    onKeyPress(key) {
        super.onKeyPress(key);
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);

        builder.addTextField("Attack Speed",builder.autoEvent({ get:()=>{return this.attackSpeed}, set:(val)=>{this.attackSpeed = parseFloat(val)} }));
        builder.addTextField("Attack Range",builder.autoEvent({ get:()=>{return this.attackRange}, set:(val)=>{this.attackRange = parseFloat(val)} }));

        builder.addTextField("Attack Min",builder.autoEvent({ get:()=>{return this.attackDamage.min}, set:(val)=>{this.attackDamage.min = parseInt(val)} }));
        builder.addTextField("Attack Max",builder.autoEvent({ get:()=>{return this.attackDamage.max}, set:(val)=>{this.attackDamage.max = parseInt(val)} }));
        
        builder.addTextField("Attack Target",builder.autoEvent({ get:()=>{return this.attackTargetId}, set:(val)=>{this.attackTargetId = val} }));
    }  
}

classList["RPG_ComponentAttack"] = RPG_ComponentAttack;
