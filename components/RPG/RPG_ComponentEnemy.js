class RPG_ComponentEnemy extends Component {
    constructor(name) {
        super(name);
        this.aggroRange = 500;
        this.unaggroRange = 600;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            aggroRange : this.aggroRange,
            unaggroRange : this.unaggroRange
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.aggroRange !== undefined) this.aggroRange = data.aggroRange;
        if(data.unaggroRange !== undefined) this.unaggroRange = data.unaggroRange;
        return this;
    }
    
    onDestroy() {
        
    }

    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        
        let compAttack = this.gameObject.getEnabledComponent(RPG_ComponentAttack);
        let attackTarget = getObjectFromId(compAttack.attackTargetId);
        
        if(attackTarget != null) {
            let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
            let targetPos = attackTarget.getEnabledComponent(ComponentTransform).pos;
            let dist = Math.hypot(targetPos.x-myPos.x, targetPos.y-myPos.y);
            if(dist >= this.unaggroRange) { // unaggro
                compAttack.setAttackTarget(null);
            }
        }
        
        if(attackTarget == null) { // no attack target, find closest player to attack
            let bestDist = -1;
            for(let obj of objectList) {
                if(obj.getEnabledComponent(RPG_ComponentPlayer) != null) {
                    // find distance
                    let myPos = this.gameObject.getEnabledComponent(ComponentTransform).pos;
                    let playerPos = obj.getEnabledComponent(ComponentTransform).pos;
                    let dist = Math.hypot(playerPos.x-myPos.x, playerPos.y-myPos.y);
                    if(bestDist < 0 || dist < bestDist) {
                        bestDist = dist;
                        if(dist <= this.aggroRange) {
                            compAttack.setAttackTarget(obj.id);
                        }
                    }
                }
            }
        }
        
        attackTarget = getObjectFromId(compAttack.attackTargetId);
        if(attackTarget != null) {
            // walk to attack target
            let transformTween = this.gameObject.getEnabledComponent(ComponentTransformTween);
            transformTween.setTargetPos(attackTarget.getEnabledComponent(ComponentTransform).pos);
        }
        else {
            // idle AI
            let transformTween = this.gameObject.getEnabledComponent(ComponentTransformTween);
            transformTween.setTargetPos(transformTween.pos); // stop
        }
        return true;
    }

}

classList["RPG_ComponentEnemy"] = RPG_ComponentEnemy;