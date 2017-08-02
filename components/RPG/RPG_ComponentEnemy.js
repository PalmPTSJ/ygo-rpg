// RPG Expansion (for testing) by PalmPTSJ

class RPG_ComponentEnemy extends Component {
    constructor(name) {
        super(name);
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{});
    }
    fromJSON(data) {
        super.fromJSON(data);
        return this;
    }
    
    onDestroy() {
        
    }

    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        
        let compAttack = this.gameObject.getEnabledComponent(RPG_ComponentAttack);
        let attackTarget = getObjectFromId(compAttack.attackTargetId);
        if(attackTarget == null) { // no attack target, find closest player to attack
            let bestDist = -1;
            for(let obj of objectList) {
                if(obj.getEnabledComponent(RPG_ComponentPlayerControllable) != null) {
                    // find distance
                    let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
                    let playerPos = obj.getEnabledComponent(ComponentTransform).pos;
                    let dist = Math.hypot(playerPos.x-myPos.x, playerPos.y-myPos.y);
                    if(bestDist < 0 || dist < bestDist) {
                        bestDist = dist;
                        compAttack.callRPC('RPC_setAttackTarget',{id:obj.id});
                    }
                }
            }
        }
        return true;
    }

}

classList["RPG_ComponentEnemy"] = RPG_ComponentEnemy;