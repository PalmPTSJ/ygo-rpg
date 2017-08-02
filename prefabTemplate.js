// template for prefabs

// Minimum requirement for network object
class Prefab extends EmptyPrefab { 
    constructor (name) {
        super(name);
        this.addComponent(new ComponentTransform());
        this.addComponent(new ComponentNetwork());
    }
}
classList["Prefab"] = Prefab;

// Static Image : Background (no cursor)
class PrefabStaticImage extends Prefab { 
    constructor (name, imageURL) {
        super(name);

        this.addComponent((new ComponentImageRenderer()).fromJSON({
            url : imageURL
        }));
    }
}
classList["PrefabStaticImage"] = PrefabStaticImage;

// Tabletop object (support cursor and basic actions)
class PrefabTabletop extends Prefab { 
    constructor (name) {
        super(name);
        this.addComponent(new ComponentTabletopObject());
        this.addComponent(new ComponentCursorCollider());
    }
}
classList["PrefabTabletop"] = PrefabTabletop;

// Tabletop object with image renderer
class PrefabImage extends PrefabTabletop { 
    constructor (name, imageURL) {
        super(name);

        this.addComponent((new ComponentImageRenderer()).fromJSON({
            url : imageURL
        }));
    }
}
classList["PrefabImage"] = PrefabImage;

// Tabletop object with multi image renderer
class PrefabImageMulti extends PrefabTabletop {
    constructor (name, imageURLs) {
        super(name);

        this.addComponent((new ComponentImageRendererMulti()).fromJSON({
            faces : imageURLs
        }));
    }
}
classList["PrefabImageMulti"] = PrefabImageMulti;