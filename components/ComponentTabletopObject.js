class ComponentTabletopObject extends Component {
    constructor(name) {
        super(name);
    }
    onKeyPress(key) {
        super.onKeyPress(key);
        if(key == 46 || key == 'k'.charCodeAt(0)) { // (DEL / K) = Delete object
            socket.emit("deleteObject",this.gameObject.id);
        }
        if(key == 'h'.charCodeAt(0)) { // (H) = Put in/out hand
            var comp = this.gameObject.getEnabledComponent(ComponentObjectInHand);
            if(comp && myPlayerInfo.id == comp.player) {
                this.gameObject.deleteComponent(comp);
            }
            else if(!comp) {
                this.gameObject.addComponent((new ComponentObjectInHand()).fromJSON({
                    player : myPlayerInfo.id
                }));
            }
        }
        if(key == 'c'.charCodeAt(0)) { // (C) = Clone
            var objectJSON = this.gameObject.toJSON();
            objectJSON.id = null;
            socket.emit('createObject',objectJSON);
        }
    }
}

classList["ComponentTabletopObject"] = ComponentTabletopObject;