/** Tabletop2d template for RPG
How to use  : Copy and paste this code into console
Author      : PalmPTSJ
**/

var imageData = {
    money : 'http://www.maplestory2training.com/wp-content/uploads/maplestory-mesos.png',
    coin : 'https://usercontent2.hubstatic.com/10173223_f260.jpg'
}

// Create prefab
var heroPrefab = new EmptyPrefab("RPG - Hero");
heroPrefab.addComponent(new ComponentTransformTween());
heroPrefab.addComponent(new ComponentNetwork());
heroPrefab.addComponent(new ComponentTabletopObject());
heroPrefab.addComponent(new ComponentCursorCollider());
heroPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:-1},
    size    : {width:40,height:60}
});
heroPrefab.addComponent((new ComponentRectRenderer()).fromJSON({
    color : "#00AA00"
}));
heroPrefab.addComponent(new RPG_ComponentHealth());
heroPrefab.addComponent(new RPG_ComponentAttack());
heroPrefab.addComponent(new RPG_ComponentPlayerControllable());

socket.emit('createPrefab',heroPrefab.toJSON());

// For drop table
var moneyPrefab = new PrefabImage("RPG - Money (test)",imageData.money);
moneyPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:1},
    size    : {width:50,height:50}
});

var coinPrefab = moneyPrefab.clone(); // copy from moneyPrefab
coinPrefab.addComponent((new ComponentImageRenderer()).fromJSON({
    url : imageData.coin
}));


var enemyPrefab = new EmptyPrefab("RPG - Enemy");
enemyPrefab.addComponent(new ComponentTransformTween());
enemyPrefab.addComponent(new ComponentNetwork());
enemyPrefab.addComponent(new ComponentTabletopObject());
enemyPrefab.addComponent(new ComponentCursorCollider());
enemyPrefab.getComponent(ComponentTransform).fromJSON({
    pos     : {x:0,y:0,z:-1},
    size    : {width:30,height:30}
});
enemyPrefab.addComponent((new ComponentRectRenderer()).fromJSON({
    color : "#AA0000"
}));
enemyPrefab.addComponent(new RPG_ComponentHealth().fromJSON({
    HP : 50,
    maxHP : 50
}));
enemyPrefab.addComponent(new RPG_ComponentAttack());
enemyPrefab.addComponent(new RPG_ComponentEnemy());
enemyPrefab.addComponent((new RPG_ComponentDropTable()).fromJSON({
    dropTable : [
        {prefabData : moneyPrefab.toJSON(), prob:0.5},
        {prefabData : coinPrefab.toJSON(), prob:1}
    ]
}));

socket.emit('createPrefab',enemyPrefab.toJSON());