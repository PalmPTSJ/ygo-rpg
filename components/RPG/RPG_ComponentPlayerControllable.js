// RPG Expansion (for testing) by PalmPTSJ

class RPG_ComponentPlayerControllable extends Component {

    onKeyPress(key) {
        super.onKeyPress(key);
    }
}

classList["RPG_ComponentPlayerControllable"] = RPG_ComponentPlayerControllable;

if(!isServer) {
    // bind right click action
    $("#gameCanvas").contextmenu(function(e) {
        var clickPos = {
            x : canvasX + canvas.width/2 + ((e.pageX - $(canvas).offset().left)-canvas.width/2)/canvasScale,
            y : canvasY + canvas.height/2 + ((e.pageY - $(canvas).offset().top)-canvas.height/2)/canvasScale
        }
        let isAttackCmd = false;
        for(var i = objectList.length-1;i >= 0;i--) { // Select from high Z to low Z item
            var obj = objectList[i];
            if(selectingObject.has(obj)) continue;
            if(obj.getEnabledComponent(ComponentCursorCollider) && obj.getEnabledComponent(ComponentCursorCollider).isOver(clickPos)) {
                // attack that target
                if(obj.getEnabledComponent(RPG_ComponentHealth) == null) continue; // Can only attack object with health
                for(var selObj of selectingObject) {
                    if(selObj.getEnabledComponent(RPG_ComponentPlayerControllable) != null) {
                        selObj.getEnabledComponent(RPG_ComponentAttack).callRPC('RPC_setAttackTarget',{id:obj.id});
                    }
                }
                isAttackCmd = true;
                break;
            }
        }
        if(!isAttackCmd) {
            // move command
            for(var obj of selectingObject) {
                if(obj.getEnabledComponent(RPG_ComponentPlayerControllable) != null) {
                    obj.getEnabledComponent(RPG_ComponentAttack).callRPC('RPC_setAttackTarget',{id:null});
                    if(obj.getEnabledComponent(ComponentTransformTween) != null) {
                        obj.getEnabledComponent(ComponentTransformTween).callRPC('RPC_setTargetPos',{newPos : clickPos});
                    }
                }
            }
        }
        return false;
    });
}