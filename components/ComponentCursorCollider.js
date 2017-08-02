class ComponentCursorCollider extends Component { // This component allow cursor to click this object
    constructor(name) {
        super(name);
    }
    isOver(cursorPos) {
        // check hit with point
        var transform = this.gameObject.getEnabledComponent(ComponentTransform);
        var pos = transform.getAbsolutePos();
        // rotate point back from globalRotation
        var newCursorPos = {
        x : Math.cos(globalRotation * Math.PI / 180)*cursorPos.x + Math.sin(globalRotation * Math.PI / 180)*cursorPos.y,
        y : - Math.sin(globalRotation * Math.PI / 180)*cursorPos.x + Math.cos(globalRotation * Math.PI / 180)*cursorPos.y
        };
        // rotate point back
        var dx = newCursorPos.x - (pos.x + transform.size.width/2);
        var dy = newCursorPos.y - (pos.y + transform.size.height/2);
        
        var newDx = Math.cos(transform.rotation * Math.PI / 180)*dx + Math.sin(transform.rotation * Math.PI / 180)*dy;
        var newDy = - Math.sin(transform.rotation * Math.PI / 180)*dx + Math.cos(transform.rotation * Math.PI / 180)*dy;
        
        /*if( pos.x <= cursorPos.x && cursorPos.x <= pos.x + transform.size.width &&
            pos.y <= cursorPos.y && cursorPos.y <= pos.y + transform.size.height) {
            return true;
        }*/
        if(newDx >= -transform.size.width/2 && newDx <= transform.size.width/2 && 
           newDy >= -transform.size.height/2 && newDy <= transform.size.height/2) return true;
        return false;
    }
    onUpdate(timestamp) {
        if(!super.onUpdate(timestamp)) return false;
        if(selectingObject.has(this.gameObject)) {
            // draw outline
            var transform = this.gameObject.getEnabledComponent(ComponentTransform);
            ctx.save();
            transform.setupCanvas();
            ctx.strokeStyle = "#8CF";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(0,0,transform.size.width,transform.size.height);
            ctx.stroke();
            ctx.restore();
        }
        return true;
    }
}

classList["ComponentCursorCollider"] = ComponentCursorCollider;