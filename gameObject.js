class Base {
    constructor () {
        this.id = null;
    }
    toJSON() {
        return {
            className:this.constructor.name
        };
    }
    fromJSON(data) {
        return this;
    }
}

class EmptyPrefab extends Base {
    constructor (name) {
        super();
        this.components = [];
        this.name = name;
    }
    toJSON() {
        // compress this prefab into object
        var obj = Object.assign(super.toJSON(),{
            name : this.name,
            id : this.id,
            components : []
        });
        for(var comp of this.components) {
            obj.components.push(comp.toJSON());
        }
        return obj;
    }
    fromJSON(data) {
        super.fromJSON(data);
        this.name = data.name;
        this.id = data.id;
        var dataComponentsId = new Set();
        for(var comp of data.components) {
            var updated = false;
            dataComponentsId.add(comp.id);
            for(var myComp of this.components) {
                if(myComp.id == comp.id) {
                    // update
                    myComp.fromJSON(comp);
                    updated = true;
                    break;
                }
            }
            if(!updated) {
                // create new component
                var newComp = new (classList[comp.className])();
                newComp.fromJSON(comp);
                this.addComponent(newComp);
                newComp.id = comp.id;
            }
        }
        // delete component not in data
        for(var i = this.components.length-1;i >= 0;i--) {
            if(!dataComponentsId.has(this.components[i].id)) this.components.splice(i,1); 
        }
        return this;
    }
    
    clone() { // create a clone of this object/prefab
        let toRet = new this.constructor();
        toRet.fromJSON(this.toJSON());
        return toRet;
    }
    
    getComponent(clazz) {
        for(var comp of this.components) {
            if(comp instanceof clazz) return comp;
        }
        return null;
    }
    getEnabledComponent(clazz) {
        for(var comp of this.components) {
            if(comp instanceof clazz && comp.isEnabled()) return comp;
        }
        return null;
    }
    
    getComponents(clazz) {
        var toRet = [];
        for(var comp of this.components) {
            if(comp instanceof clazz) toRet.push(comp);
        }
        return toRet;
    }
    getEnabledComponents(clazz) {
        var toRet = [];
        for(var comp of this.components) {
            if(comp instanceof clazz && comp.isEnabled()) toRet.push(comp);
        }
        return toRet;
    }
    
    addComponent(comp) {
        if(comp.id == null) comp.id = generateNewId();
        this.components.push(comp);
    }
    deleteComponent(comp) {
        if(this.components.indexOf(comp) != -1) {
            comp.onDestroy();
            this.components.splice(this.components.indexOf(comp),1);
        }
    }
    
    instantiate() {
        var object = new GameObject();
        for(var name in this.components) {
            var comp = this.components[name];
            // clone component
            var newComp = new (comp.constructor)();
            //newComp.id = generateNewId();
            newComp.fromJSON(comp);
            object.addComponent(newComp);
        }
        return object;
    }
}

class GameObject extends EmptyPrefab {
    constructor() {
        super("");
    }
    update(timestamp) {
        for(var comp of this.components) {
            comp.onUpdate(timestamp);
        }
    }
    serverUpdate(timestamp) {
        for(var comp of this.components) {
            comp.onServerUpdate(timestamp);
        }
    }
    destroy() {
        for(var comp of this.components) {
            if(comp.onDestroy) comp.onDestroy();
        }
    }
    
    addComponent(comp) {
        super.addComponent(comp);
        comp.gameObject = this;
    }
    
    onKeyPress(keycode) {
        for(var comp of this.components) {
            if(comp.onKeyPress) comp.onKeyPress(keycode);
        }
    }
    
    onObjectDrop(objectList) {
        for(var comp of this.components) {
            if(comp.onObjectDrop) comp.onObjectDrop(objectList);
        }
    }
    
}

var classList = {
    "Base" : Base,
    "EmptyPrefab" : EmptyPrefab,
    "GameObject" : GameObject
};