// Override Fabric.js
 fabric.Object.prototype.toObject = (function(toObject) {
    return function() {
        return fabric.util.object.extend(toObject.call(this), {
            objId: this.objId,  // custom property
            user: this.user  // custom property
        });
    };
})(fabric.Object.prototype.toObject);

fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.padding = 8;

// Create canvas
const canvas = new fabric.Canvas('canvas', {
    width: 600,
    height: 400,
    originX: 'center',
    backgroundColor: '#ffffff',
});

// Canvas operation
const addObj = (object) => {  // if action is create, call addObj(object)
    fabric.util.enlivenObjects(object, (enlivenedObjects) => { 
        enlivenedObjects.map(obj => canvas.add(obj));
        canvas.renderAll();
    });
};

const removeObj = (objId) => {  // if action is remove, call removeObj(objId)
    canvas.getObjects().every((obj) => {
        if (obj.objId == objId) {
            canvas.remove(obj);
            canvas.renderAll();
            return false
        } else {
            return true
        }
    });
};

const parseObj = (data) => {  // data is an array
    return new Promise((resolve, reject) => {
        data.map(step => {
            switch (step.action) {
                case 'create':
                    addObj(step.object);
                case 'remove':
                    removeObj(step.object);
                default:
                    resolve();
            }
        })
    })
}