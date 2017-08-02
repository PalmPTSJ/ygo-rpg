// YugiohRPG Expansion by PalmPTSJ

class RPG_ComponentDropTable extends Component {
    constructor(name) {
        super(name);
        this.dropTable = []; // [{objPrefabData,prob (0-1),count }]
        this.dropRadius = 30;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            dropTable : this.dropTable,
            dropRadius : this.dropRadius
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.dropTable !== undefined) this.dropTable = data.dropTable;
        if(data.dropRadius !== undefined) this.dropRadius = data.dropRadius;
        
        return this;
    }
    
    onDestroy() {
        if(isServer) { // drop
            let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
            for(var dropData of this.dropTable) {
                // random
                if(Math.random() < dropData.prob) {
                    // drop
                    let prefab = new EmptyPrefab();
                    prefab.fromJSON(dropData.prefabData);
                    
                    let obj = prefab.instantiate();
                    
                    // random angle
                    let angle = Math.random()*Math.PI;
                    
                    obj.getEnabledComponent(ComponentTransform).setPos({
                        x : myPos.x + Math.cos(angle)*this.dropRadius,
                        y : myPos.y + Math.sin(angle)*this.dropRadius,
                        z : myPos.z
                    });
                    
                    server_createObject(obj.toJSON());
                }
            }
        }
    }

    onKeyPress(key) {
        super.onKeyPress(key);
    }
    
    buildInspector(builder) {
        super.buildInspector(builder);
        
        builder.addTextField("Drop Radius",builder.autoEvent({ get:()=>{return this.dropRadius}, set:(val)=>{this.dropRadius = val} }));
        builder.addArrayField("Drop Table",builder.autoEvent({ get:()=>{return this.dropTable}, set:(val)=>{this.dropTable = val} }));
    }  
}

classList["RPG_ComponentDropTable"] = RPG_ComponentDropTable;