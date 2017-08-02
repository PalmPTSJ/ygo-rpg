// YugiohRPG Expansion by PalmPTSJ

class RPG_ComponentHealth extends Component {
    constructor(name) {
        super(name);
        this.HP = 200;
        this.maxHP = 200;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            HP : this.HP,
            maxHP : this.maxHP
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.HP !== undefined) this.HP = data.HP;
        if(data.maxHP !== undefined) this.maxHP = data.maxHP;
        
        return this;
    }
    
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        
        let transform = this.gameObject.getEnabledComponent(ComponentTransform);
        
        // draw health bar
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
        ctx.lineTo(transform.size.width * this.HP / this.maxHP,-20);
        ctx.stroke();
        
        ctx.restore();
        
        return true;
        
    }
    
    takeDamage(dmg) {
        if(!isServer) return;
        
        this.HP -= dmg;
        // create damage text
        let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
        
        let obj = RPG_ComponentHealth.DamageTextPrefab.instantiate();
        obj.getEnabledComponent(ComponentTransformTween).setPos({
            x : myPos.x,
            y : myPos.y-10
        });
        obj.getEnabledComponent(ComponentTransformTween).setTargetPos({
            x : myPos.x,
            y : myPos.y-400
        });
        
        obj.getEnabledComponent(ComponentTextRenderer).text = ""+dmg;
        
        server_createObject(obj.toJSON());
        
        if(this.HP <= 0) server_deleteObject(this.gameObject.id);
        
    }

    onKeyPress(key) {
        super.onKeyPress(key);
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);

        builder.addTextField("HP",builder.autoEvent({ get:()=>{return this.HP}, set:(val)=>{this.HP = parseInt(val)} }));
        builder.addTextField("Max HP",builder.autoEvent({ get:()=>{return this.maxHP}, set:(val)=>{this.maxHP = parseInt(val)} }));
    }  
}

if(isServer) {
    RPG_ComponentHealth.DamageTextPrefab = new EmptyPrefab("Damage Text");
    RPG_ComponentHealth.DamageTextPrefab.addComponent(new ComponentTransformTween().fromJSON({
        moveSpeed : 3
    }));
    RPG_ComponentHealth.DamageTextPrefab.addComponent(new ComponentNetwork());
    RPG_ComponentHealth.DamageTextPrefab.addComponent(new ComponentTextRenderer());
    RPG_ComponentHealth.DamageTextPrefab.addComponent((new ComponentAutoDestroy()).fromJSON({
        countdown : 60
    }));
}

classList["RPG_ComponentHealth"] = RPG_ComponentHealth;