// YugiohRPG Expansion by PalmPTSJ

class RPG_ComponentHealth extends Component {
    constructor(name) {
        super(name);
        this.HP = 500;
        this.maxHP = 500;
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
        
        return true;
        
    }
    
    takeDamage(dmg) {
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
        
        createObject(obj.toJSON());
        
        //console.log("Create Object",obj);
        
        if(this.HP <= 0) {
            if(isServer)
                deleteObject(this.gameObject.id);
        }
        
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

RPG_ComponentHealth.DamageTextPrefab = new EmptyPrefab("Damage Text");
RPG_ComponentHealth.DamageTextPrefab.addComponent(new ComponentTransformTween().fromJSON({
    moveSpeed : 3
}));
RPG_ComponentHealth.DamageTextPrefab.addComponent(new ComponentNetwork());
RPG_ComponentHealth.DamageTextPrefab.addComponent(new ComponentTextRenderer());
RPG_ComponentHealth.DamageTextPrefab.addComponent((new ComponentAutoDestroy()).fromJSON({
    countdown : 60
}));

classList["RPG_ComponentHealth"] = RPG_ComponentHealth;