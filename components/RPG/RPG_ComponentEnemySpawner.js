class RPG_ComponentEnemySpawner extends Component {
    constructor(name) {
        super(name);
        this.enemyData = {};
        this.spawnRate = {min:5,max:10}; // seconds between enemy respawn
        this.amount = 1; // max amount of enemy
        this.spawnArea = {x:100,y:100,width:200,height:200}; // spawn enemy in this area
        
        // SERVER
        this.enemiesId = []; // list of enemy spawned by this spawner
        this.spawnWaitingList = []; // list of time waiting until next enemy spawn
        this.frameCount = 0;
    }
    
    toJSON() {
        return Object.assign(super.toJSON(),{
            enemyData : Object.assign({},this.enemyData),
            spawnRate : Object.assign({},this.spawnRate),
            amount : this.amount,
            spawnArea : Object.assign({},this.spawnArea)
        });
    }
    fromJSON(data) {
        super.fromJSON(data);
        
        if(data.enemyData !== undefined) this.enemyData = data.enemyData;
        if(data.spawnRate !== undefined) this.spawnRate = data.spawnRate;
        if(data.amount !== undefined) this.amount = data.amount;
        if(data.spawnArea !== undefined) this.spawnArea = data.spawnArea;
        
        return this;
    }
    
    onDestroy() {
        
    }
    
    spawnEnemy() {
        if(!isServer) return;
        
        let obj = (new Prefab()).fromJSON(this.enemyData).instantiate();
        
        // adjust position
        let transform = obj.getEnabledComponent(ComponentTransform);
        transform.setPos({
            x : Math.random()*this.spawnArea.width + this.spawnArea.x,
            y : Math.random()*this.spawnArea.height + this.spawnArea.y
        });
        
        let id = createObject(obj.toJSON());
        
        this.enemiesId.push(id);
    }
    
    onUpdate(timestamp) {
        ctx.save();
        
        ctx.globalAlpha = 0.2
        ctx.fillStyle = "#DD0";
        ctx.beginPath();
        ctx.rect(this.spawnArea.x,this.spawnArea.y,this.spawnArea.width,this.spawnArea.height);
        ctx.fill();
        
        ctx.restore();
    }

    onServerUpdate(timestamp) {
        if(!super.onServerUpdate(timestamp)) return false;
        
        this.frameCount++;
        if(this.frameCount >= 60) {
            // 1 second passed
            this.frameCount = 0;
            let newWaitingList = [];
            for(let waitingTime of this.spawnWaitingList) {
                waitingTime -= 1;
                if(waitingTime <= 0) { // spawn enemy !
                    this.spawnEnemy();
                }
                else {
                    newWaitingList.push(waitingTime);
                }
            }
            
            let newEnemiesId = [];
            for(let id of this.enemiesId) {
                if(getObjectFromId(id) == null) { // enemy is dead
                    newWaitingList.push(Math.floor(Math.random()*(this.spawnRate.max - this.spawnRate.min + 1) + this.spawnRate.min));
                }
                else {
                    newEnemiesId.push(id);
                }
            }
            this.enemiesId = newEnemiesId;
            
            let remainingEnemies = this.amount - this.enemiesId.length - newWaitingList.length;
            for(let i = 0;i < remainingEnemies;i++) {
                newWaitingList.push(Math.floor(Math.random()*(this.spawnRate.max - this.spawnRate.min + 1) + this.spawnRate.min));
            }
            
            this.spawnWaitingList = newWaitingList;
            
            //console.log("EN",this.enemiesId,"WT",this.spawnWaitingList);
        }
        
        return true;
    }

}

classList["RPG_ComponentEnemySpawner"] = RPG_ComponentEnemySpawner;