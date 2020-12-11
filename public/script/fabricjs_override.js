 //Override prototype.toObject and add custom properties
 fabric.Object.prototype.toObject = (function(toObject) {
    return function() {
        return fabric.util.object.extend(toObject.call(this), {
            objId: this.objId,  
            user: this.user
        });
    };
})(fabric.Object.prototype.toObject);

// var canvas = new fabric.Canvas('paper', { selection: false });
// $("#selec").click(function(){
//     canvas.isDrawingMode = false;
//     canvas.selection= true;
//     canvas.off('mouse:down');
//     canvas.off('mouse:move');
//     canvas.off('mouse:up');
//     canvas.forEachObject(function(o){ o.setCoords() })
// })
// var tri, isDown, origX, origY;

// canvas.observe('mouse:down', function(o){
//   isDown = true;
//   var pointer = canvas.getPointer(o.e);
//   origX = pointer.x;
//   origY = pointer.y;
//   tri = new fabric.Triangle({
//     left: pointer.x,
//     top: pointer.y,
//     strokeWidth: 1,
//       width:2,height:2,
//     stroke: 'black',
//     fill:'white',
//     selectable: true,
//     originX: 'center'
    
//   });
//   canvas.add(tri);
// });

// canvas.observe('mouse:move', function(o){
//   if (!isDown) return;
//   var pointer = canvas.getPointer(o.e);
//     tri.set({ width: Math.abs(origX - pointer.x),height: Math.abs(origY - pointer.y)});
//   canvas.renderAll();
// });

// canvas.on('mouse:up', function(o){
//   isDown = false;
// });