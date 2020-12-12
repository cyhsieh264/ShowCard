// Override Fabric.js
 fabric.Object.prototype.toObject = (function(toObject) {
    return function() {
        return fabric.util.object.extend(toObject.call(this), {
            radius: this.radius,
            text: this.text,
            textAlign: this.textAlign,
            textLines: this.textLines,
            fontFamily: this.fontFamily,
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
const addObj = (data) => {  // if action is create, call addObj(object)
    const objects = data.map(obj => JSON.parse(obj));
    fabric.util.enlivenObjects(objects, (enlivenedObjects) => { 
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
                    break;
                case 'remove':
                    removeObj(step.object);
                    break;
            }
            resolve();
        })
    })
}