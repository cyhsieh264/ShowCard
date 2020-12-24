// Override Fabric.js
 fabric.Object.prototype.toObject = (function(toObject) {
    return function() {
        return fabric.util.object.extend(toObject.call(this), {
            radius: this.radius,
            text: this.text,
            textAlign: this.textAlign,
            textLines: this.textLines,
            fontFamily: this.fontFamily,
            evented: this.evented,
            selectable: this.selectable,
            objId: this.objId,  // custom property
            user: this.user,  // custom property
            isBackground: this.isBackground  // custom property
        });
    };
})(fabric.Object.prototype.toObject);

fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.padding = 8;

// Create canvas
const canvas = new fabric.Canvas('canvas', {
    width: 540,
    height: 540,
    originX: 'center',
    backgroundColor: '#ffffff',
});

canvas.selection = false;

// Canvas operation
const addObj = (data) => { 
    let idSet = new Set();
    canvas.getObjects().map( item => idSet.add(item.objId));
    const objects = data.map(obj => JSON.parse(obj));
    fabric.util.enlivenObjects(objects, (enlivenedObjects) => { 
        enlivenedObjects.map(obj => {
            if (obj.isBackground == true) {
                // removeBackground();
                canvas.add(obj);
                canvas.sendToBack(obj);
            } else {
                if (!idSet.has(obj.objId)) canvas.add(obj);
            }
        });
        canvas.renderAll();
    });
};

const removeObj = (objId) => { 
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

// const removeBackground = () => { 
//     canvas.getObjects().every((obj) => {
//         if (obj.isBackground == true) {
//             canvas.remove(obj);
//             canvas.renderAll();
//             return false
//         } else {
//             return true
//         }
//     });
// };

const parseObj = (data) => {
    data.map(step => {
        if (step.action == 'create') {
            addObj(step.object);
        } else if (step.action == 'remove') {
            removeObj(step.object);
        }
    });
};