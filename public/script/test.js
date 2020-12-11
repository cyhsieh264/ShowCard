// var canvas;

//         var json = '{"objects": [{"type":"rect", "left":100, "top":100, "width":200, "height":200, "fill":"blue"}]}';
//         canvas = new fabric.Canvas('canvas');

//         // Create an object to show that this doesn't get overwritten when we load the JSON
//         var circle = new fabric.Circle({
//             radius: 50, fill: 'green', left: 50, top: 50
//         });
//         canvas.add(circle);
//         canvas.renderAll();

//         // Parse JSON and add objects to canvas
//         var jsonObj = JSON.parse(json);
//         fabric.util.enlivenObjects(jsonObj.objects, function (enlivenedObjects) {
//             enlivenedObjects.forEach(function (obj, index) {
//                 canvas.add(obj);
//             });
//             canvas.renderAll();
//         });

const canvas = new fabric.Canvas('canvas', {
    width: 600,
    height: 400,
    originX: 'center',
    backgroundColor: '#ffffff',
});

const rect = new fabric.Rect({
    height: 100,
    width: 200,
    top: 70,
    left: 100,
    fill: '#b6b6b6',
    objId: 'rsdf'
})

canvas.add(rect)

const test1 = {"objects":[{"objId": "1dsg", "type":"rect","version":"4.2.0","originX":"left","originY":"top","left":200,"top":200,"width":200,"height":100,"fill":"#fcba03","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]}
const test2 = {"objects":[{"objId": "1dsg", "type":"rect","version":"4.2.0","originX":"left","originY":"top","left":250,"top":230,"width":200,"height":100,"fill":"#000000","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}]}

fabric.util.enlivenObjects(test1.objects, (enlivenedObjects) => { 
    enlivenedObjects.forEach((obj) => {
        canvas.add(obj);
    });
    canvas.renderAll();
});

console.log(canvas)
console.log(canvas.getObjects())

$('#test2').click(() => {
    const id = test1.objects[0].objId;
    // remove test1
    for (let i = 0; i<canvas.getObjects().length; i++) {
        if (canvas.getObjects()[i].objId == id) {
            canvas.remove(canvas.getObjects()[i])
        }
    }
    // add test2
    fabric.util.enlivenObjects(test2.objects, (enlivenedObjects) => { 
        enlivenedObjects.forEach((obj) => {
            canvas.add(obj);
        });
        canvas.renderAll();
    });
})





// $('#brush-on').click(() => {
//     canvas.freeDrawingBrush.color = $('#color-fill').val();
//     canvas.freeDrawingBrush.width = 5;
//     canvas.isDrawingMode = true
// });
// $('#brush-off').click(() => canvas.isDrawingMode = false);
// $('#color-fill').mousemove(() => {
//     canvas.freeDrawingBrush.color = $('#color-fill').val();
//     canvas.freeDrawingBrush.width = 5;
// })
// $('#add-icon').click(() => {
//     fabric.Image.fromURL('../images/material/icons/planet.png', function(myImg) {
//     var img1 = myImg.set({ left: 0, top: 0 ,width:150,height:150});
//     canvas.add(img1); 
//     });
// });
// $('#add-circle').click(() => {
//     let c = new fabric.Circle({
//         left: 250, 
//         top: 200,
//         strokeWidth: 5,
//         radius: 60,
//         stroke: $('#color-border').val(),
//         fill: $('#color-fill').val(),
//         originX: 'center',
//         originY: 'center'
//     })
//     canvas.add(c)
//     canvas.setActiveObject(c);
//     const data = canvas.getActiveObjects()[0].toJSON();
//     newObject(data);
// })
// $('#add-rect').click(() => {
//     let c = new fabric.Rect({
//         height: 100,
//         width: 200,
//         top: 200,
//         left: 300,
//         fill: $('#color-fill').val(),
//         stroke: $('#color-border').val(),
//         strokeWidth: 5,
//     })
//     canvas.add(c)
//     canvas.setActiveObject(c);
//     const data = canvas.getActiveObjects()[0].toJSON();
//     newObject(data);
// })
// $('#add-text').click(() => {
//     const textbox = new fabric.Textbox('text', { 
//         left: 150, 
//         top: 100,
//         editable: true,
//         width: 300,
//         textAlign: 'center',
//         fill: $('#color-fill').val(), 
//         fontFamily: 'Delicious', 
//     });
//     canvas.add(textbox);
//     canvas.setActiveObject(textbox);
//     const data = canvas.getActiveObjects()[0].toJSON();
//     newObject(data);
// })




// // const rect = new fabric.Rect({
// //     height: 100,
// //     width: 200,
// //     top: 200,
// //     left: 200,
// //     fill: '#fcba03',
// //     id: 'rec'
// // })

// // console.log(canvas.toJSON(['rec']))

// // canvas.add(rect);
// // const rect2 = new fabric.Rect({
// //     height: 100,
// //     width: 200,
// //     top: 250,
// //     left: 80,
// //     fill: '#42f587'
// // })
// // canvas.add(rect2);
// // canvas.setActiveObject(rect2);

// // Remove Object
// $('#rm-obj').click(() => {
//     const objects = canvas.getActiveObjects();
//     objects.map(obj => canvas.remove(obj));
// });

// // canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
// // {"version":"4.2.0","objects":[{"type":"textbox","version":"4.2.0","originX":"left","originY":"top","left":150,"top":100,"width":300,"height":45.2,"fill":"#8a91ab","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"text":"hello world","fontSize":40,"fontWeight":"normal","fontFamily":"Delicious","fontStyle":"normal","lineHeight":1.16,"underline":false,"overline":false,"linethrough":false,"textAlign":"center","textBackgroundColor":"","charSpacing":0,"minWidth":20,"splitByGrapheme":false,"styles":{}},{"type":"rect","version":"4.2.0","originX":"left","originY":"top","left":200,"top":200,"width":200,"height":100,"fill":"#fcba03","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"4.2.0","originX":"left","originY":"top","left":80,"top":250,"width":200,"height":100,"fill":"#42f587","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"#ffffff"}

// let blankCanvas = {
//     version: "4.2.0",
//     objects: [],
//     background: "#ffffff"
// }

// // canvas.clear()
// // canvas.loadFromJSON(c, canvas.renderAll.bind(canvas));

// // const test = {"type":"rect","version":"4.2.0","originX":"left","originY":"top","left":200,"top":200,"width":200,"height":100,"fill":"#fcba03","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}
// // // const test = (canvas.getObjects())[0].toJSON()
// // c.objects.push(test)
// // console.log(test)
// // console.log(JSON.stringify(test))

// // canvas.loadFromJSON(c, canvas.renderAll.bind(canvas));

// // console.log(canvas._objects.length)
// // console.log(canvas.getObjects())
// // console.log((canvas.getObjects())[0].toJSON());



// // const rect = new fabric.Rect({
// //     height: 100,
// //     width: 200,
// //     top: 200,
// //     left: 200,
// //     fill: '#fcba03',
// // })

// // canvas.add(rect)


// const rect2 = new fabric.Rect({
//     height: 100,
//     width: 200,
//     top: 200,
//     left: 100,
//     fill: '#000000',
//     // id: 1
// })

// canvas.add(rect2)

// // console.log(canvas.toJSON(['rec']))

// canvas.setActiveObject(rect2);

// // rect2.set('id', 1);

// // const te = canvas.getActiveObjects()[0].toJSON();
// const te = canvas.getActiveObjects()[0].toJSON()
// // const te2 = rect2;
// te.objId = 1
// te.left = 200

// blankCanvas.objects.push(te);

// canvas.loadFromJSON(blankCanvas, canvas.renderAll.bind(canvas));



// // console.log(te)
// // console.log(te2)



// // te.id = 1
// // console.log(te)
// // console.log(te.id)

// const setId = (te) => {
//     // console.log(te);
//     if (!te.customId) {
//         te.customId = 'rec2'
//     } else {
//         te.customId = 3
//     }
//     // te.id = 'rec2'
//     // console.log(te)
//     console.log(te.customId)
// }

// $('#test1').click(() => {
//     const te = canvas.getActiveObjects()[0].toJSON();
//     console.log(te)
//     setId(te);
// })

// let c2 = new fabric.Circle({
//     left: 250, 
//     top: 200,
//     strokeWidth: 5,
//     radius: 60,
//     stroke: $('#color-border').val(),
//     fill: $('#color-fill').val(),
//     originX: 'center',
//     originY: 'center',
//     cornerStyle: 'circle',
//     padding: 3,
//     user: 'cd',
//     hasBorders: false,
//     hasControls: false,
//     status: ' is editing'

//     // evented: false,
//     // selectable: false

// })

// let c2t = new fabric.Text(c2.user+c2.status, {
//     fontSize: 20,
//     opacity: 0.3,
//     originX: 'center',
//     originY: 'center',
//     left: c2.left,
//     top: c2.top
// })

// let group = new fabric.Group([c2, c2t], {
//     objectCaching: false,
//     selectable: false,
//     evented: false
// })

// canvas.add(group)

// // canvas.add(c2)

// // canvas.on('mouse:down', e => {
// //     if (e.target != null) {
// //         e.target.on('mousedown', function(e) { 
// //             // console.log(e)
// //             // console.log(e.target)
// //             // console.log(e.target.status);
// //             console.log(e.target.objId);
// //         })
// //     } else {
// //         console.log('should be blank')
// //     }
// // })

// canvas.on('mouse:down', e => {
//     if (e.target != null) {
//         if (e.target.status != ' is editing') {
//             e.target.on('mousedown', function(e) { 
//                 // console.log(e)
//                 // console.log(e.target)
//                 // console.log(e.target.status);
//                 console.log(e.target.objId);
//             })
//         } else {
//             // e.target.on('mousedown', function(e) { 
//             //     // console.log(e)
//             //     // console.log(e.target)
//             //     console.log(e.target.status);
//             //     // console.log(e.target.objId);
//             // })
//         }
//     } else {
//         console.log('should be blank')
//     }
// })