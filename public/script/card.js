localStorage.setItem('history', location.pathname + location.search)
const urlParams = new URLSearchParams(location.search);
const card = urlParams.get('card');

if (!card) location.replace('/');

const api = axios.create({
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
    },
    responseType: 'json'
});

const checkUser = async () => {
    const payload = await verifyUserToken(userToken);
    if (userToken && payload) {
        $('main').removeClass('hide');
        return payload;
    } else {
        location.replace('/login.html');
    }
};

checkUser().then( async (user) => {
    const socket = io({
        auth: {
            cid: card,
            uid: user.id,
            username: user.name
        }
    });

    // --- CHAT ---
    socket.on('join', message => {
        $('.room').append(`<p>${message}</p>`)
    });
    socket.on('leave', message => {
        $('.room').append(`<p>${message}</p>`)
    });
    socket.on('message', message => {
        $('.room').append(`<p>${message}</p>`)
    });
    $('#send-btn').click( () => {
        if ($('#msg').val()) {
            socket.emit('input msg', $('#msg').val())
            $('#msg').val('')
        } else {
            alert('Please enter your message')
        }
    });
    $('#msg').keypress(function(e) {
        code = e.keyCode ? e.keyCode : e.which;
        if ( $('#msg').val() && code == 13 ) {
            e.preventDefault();
            socket.emit('input msg', $('#msg').val())
            $('#msg').val('')
        } else if ( !$('#msg').val() && code == 13 ) {
            alert('Please enter your message')
        }
    });

    // --- CARD AND CANVAS INIT ---
    let memberCount;
    const setUserColor = async () => {
        const colors = ['#6e6b64', '#1a326b', '#8c355e', '#cc9543', '#58ad49', '#f5e8cb', '#402745', '#6bc2a6', '#b2bad1', '#f5940c'];
        const index = memberCount % 10;
        localStorage.setItem('color_'+card, colors[index]);
    };
    const cardInfo = (await api.get('api/1.0/card/check', { params: { card: card } })).data.data;
    switch (cardInfo.existence) {
        case false:
            const newCard = {
                id: card,
                owner: user.id,
                title: 'untitled'
            };
            await api.post('api/1.0/card/create', newCard);
            memberCount = 1;
            const newCanvas = {
                "card_id": card,
                "user_id": user.id,
                "action": "origin",
                "obj_id": null,
                "obj_type": null,
                "object": null
            };
            await api.post('api/1.0/canvas/save', newCanvas);
        case true:
            // backlog: shared or not
            memberCount = (await api.patch('api/1.0/card/addmember', { card: card })).data.data.count;
            const userCanvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card, user: user.id } })).data.data.existence;
            if (!userCanvasExistence) {
                const newCanvas = {
                    "card_id": card,
                    "user_id": user.id,
                    "action": "origin",
                    "obj_id": null,
                    "obj_type": null,
                    "object": null
                };
                await api.post('api/1.0/canvas/save', newCanvas);
            }
            const canvasLoad = (await api.get('api/1.0/canvas/load', { params: { card: card } })).data.data.step;
            await(canvasLoad);
        default:
            await setUserColor();
    }

    // --- CANVAS EVENT ---
    // Save canvas
    // const saveObject = async(action) => {
    //     // getactiveobject
    //     const target = canvas.getActiveObjects()[0]






    //     const data = {
    //         card_id: card,
    //         user_id: user.id,
    //         action: 'modify',
            

    //         canvas: canvas.toJSON()
    //     };
    //     await api.post('api/1.0/canvas/save', data);
    //     socket.emit('edit canvas', data.canvas);
    // }

    const saveCanvas = async() => {
        const data = {
            card_id: card,
            user_id: user.id,
            user_name: user.name,
            action: 'modify',
            canvas: canvas.toJSON()
        };
        await api.post('api/1.0/canvas/save', data);
        socket.emit('edit canvas', data.canvas);
    }



    // $('#save-canvas').click(saveCanvas);
    // canvas.on('object:modified', saveObject('modify'));  // action: modify
    canvas.on('object:modified', saveCanvas);  // action: modify
    canvas.on('object:created', saveCanvas);  // action: create 
    canvas.on('object:removed', saveCanvas);  // action: remove
    canvas.on('path:created', saveCanvas);  // action: create
    // Undo canvas
    $('#undo-canvas').click( async () => {
        api.get('api/1.0/canvas/undo', { params: { card: card, user: user.id } })
        .then((response) => {
            const step = response.data.data.step;
            canvas.clear();
            canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
            socket.emit('edit canvas', step.canvas);
        }).catch((error) => {
            alert('Already the last step');
        });
    });
    // Redo canvas
    $('#redo-canvas').click( async () => {
        api.get('api/1.0/canvas/redo', { params: { card: card, user: user.id } })
        .then((response) => {
            const step = response.data.data.step;
            canvas.clear();
            canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
            socket.emit('edit canvas', step.canvas);
        }).catch((error) => {
            alert('Already the last step');
        });
    });
    // Change canvas
    socket.on('change canvas', (newCanvas) => { 
        canvas.clear();
        canvas.loadFromJSON(newCanvas, canvas.renderAll.bind(canvas));
    });
    





    // --- CANVAS TOOLBOX ---
    // Selector

    // Brush
    // const brush = new fabric.PatternBrush(canvas);
    $('#brush-on').click(() => {
        canvas.freeDrawingBrush.color = $('#color-fill').val();
        canvas.freeDrawingBrush.width = 5;
        canvas.isDrawingMode = true
    });
    $('#brush-off').click(() => canvas.isDrawingMode = false);

    // $('#color-fill').mouseout((event) => {
    //     canvas.freeDrawingBrush.color = $('#color-fill').val();
    //     canvas.freeDrawingBrush.width = 5;
    //     // event.preventDefault();
    // })

    $('#color-fill').mousemove(() => {
        canvas.freeDrawingBrush.color = $('#color-fill').val();
        canvas.freeDrawingBrush.width = 5;
    })

    // $('#canvas').mouseenter(() => {
    //     canvas.freeDrawingBrush.color = $('#color-fill').val();
    //     canvas.freeDrawingBrush.width = 5;
    // })

    const newObject = async(data) => {
        // set object 的 objId、user（在轉json之前）
        canvas.isDrawingMode = false
        const v = {
            card_id: card,
            user_id: user.id,
            user_name: user.name,
            action: 'modify',
            // canvas: data
            canvas: canvas.toJSON()
        };
        await api.post('api/1.0/canvas/save', v);
        socket.emit('edit canvas', v.canvas);
    }


    // Icon
    $('#add-icon').click(() => {
        fabric.Image.fromURL('../images/material/icons/planet.png', function(myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({ left: 0, top: 0 ,width:150,height:150});  // set objId、user
        canvas.add(img1); 
        saveCanvas();
        });
    });

    // Shape
    $('#add-circle').click(() => {
        let c = new fabric.Circle({  // set objId、user
            left: 250, 
            top: 200,
            strokeWidth: 5,
            radius: 60,
            stroke: $('#color-border').val(),
            fill: $('#color-fill').val(),
            originX: 'center',
            originY: 'center'
        })
        canvas.add(c)
        canvas.setActiveObject(c);
        const data = canvas.getActiveObjects()[0].toJSON();
        newObject(data);
    })

    $('#add-rect').click(() => {
        let c = new fabric.Rect({  // set objId、user
            height: 100,
            width: 200,
            top: 200,
            left: 300,
            fill: $('#color-fill').val(),
            stroke: $('#color-border').val(),
            strokeWidth: 5,
        })
        canvas.add(c)
        canvas.setActiveObject(c);
        const data = canvas.getActiveObjects()[0].toJSON();
        newObject(data);
    })

    // Text
    $('#add-text').click(() => {
        // console.log(canvas.getActiveObjects());
        // console.log(canvas.getActiveObjects()[0].toJSON());
        const textbox = new fabric.Textbox('text', {  // set objId、user
            left: 150, 
            top: 100,
            editable: true,
            width: 300,
            textAlign: 'center',
            fill: $('#color-fill').val(), // 字型顏色
            fontFamily: 'Delicious', // 設定字型
            // fontStyle: 'italic',  // 斜體
            // fontSize: 20, // 字型大小
            // fontWeight: 800, // 字型粗細
        });
        canvas.add(textbox); //  newObject(textbox);
        canvas.setActiveObject(textbox);
        const data = canvas.getActiveObjects()[0].toJSON();
        newObject(data);
    })
    



    // const rect = new fabric.Rect({
    //     height: 100,
    //     width: 200,
    //     top: 200,
    //     left: 200,
    //     fill: '#fcba03',
    //     id: 'rec'
    // })

    // console.log(canvas.toJSON(['rec']))

    // canvas.add(rect);
    // const rect2 = new fabric.Rect({
    //     height: 100,
    //     width: 200,
    //     top: 250,
    //     left: 80,
    //     fill: '#42f587'
    // })
    // canvas.add(rect2);
    // canvas.setActiveObject(rect2);

    // Remove Object
    $('#rm-obj').click(() => {
        const objects = canvas.getActiveObjects();
        objects.map(obj => canvas.remove(obj));
    });

    // canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
    // {"version":"4.2.0","objects":[{"type":"textbox","version":"4.2.0","originX":"left","originY":"top","left":150,"top":100,"width":300,"height":45.2,"fill":"#8a91ab","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"text":"hello world","fontSize":40,"fontWeight":"normal","fontFamily":"Delicious","fontStyle":"normal","lineHeight":1.16,"underline":false,"overline":false,"linethrough":false,"textAlign":"center","textBackgroundColor":"","charSpacing":0,"minWidth":20,"splitByGrapheme":false,"styles":{}},{"type":"rect","version":"4.2.0","originX":"left","originY":"top","left":200,"top":200,"width":200,"height":100,"fill":"#fcba03","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0},{"type":"rect","version":"4.2.0","originX":"left","originY":"top","left":80,"top":250,"width":200,"height":100,"fill":"#42f587","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}],"background":"#ffffff"}

    // let blankCanvas = {
    //     version: "4.2.0",
    //     objects: [],
    //     background: "#ffffff"
    // }

    // canvas.clear()
    // canvas.loadFromJSON(c, canvas.renderAll.bind(canvas));
    
    // const test = {"type":"rect","version":"4.2.0","originX":"left","originY":"top","left":200,"top":200,"width":200,"height":100,"fill":"#fcba03","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0}
    // // const test = (canvas.getObjects())[0].toJSON()
    // c.objects.push(test)
    // console.log(test)
    // console.log(JSON.stringify(test))

    // canvas.loadFromJSON(c, canvas.renderAll.bind(canvas));

    // console.log(canvas._objects.length)
    // console.log(canvas.getObjects())
    // console.log((canvas.getObjects())[0].toJSON());

    // --- CANVAS OPERATE ---
    // Initialize
    // const cardLoad = (await api.get('api/1.0/canvas/load', { params: { card: card } })).data.data.step;
    // const userCanvasExistence = (await api.get('api/1.0/canvas/check', { params: { card: card, user: user.id } })).data.data.existence;
    // if (!cardLoad) {
    //     const newCanvas = {
    //         card_id: card,
    //         user_id: user.id,
    //         user_name: user.name,
    //         action: 'origin',
    //         canvas: canvas.toJSON()
    //     };
    //     await api.post('api/1.0/canvas/init', newCanvas);
    // } else {
    //     canvas.loadFromJSON(cardLoad.canvas, canvas.renderAll.bind(canvas));
    //     if (!userCanvasExistence) {
    //         const newCanvas = {
    //             card_id: card,
    //             user_id: user.id,
    //             user_name: user.name,
    //             action: 'origin',
    //             canvas: canvas.toJSON()
    //         };
    //         await api.post('api/1.0/canvas/init', newCanvas);
    //     }
    // }
    // // Save canvas
    // const saveCanvas = async() => {
    //     const data = {
    //         card_id: card,
    //         user_id: user.id,
    //         user_name: user.name,
    //         action: 'modify',
    //         canvas: canvas.toJSON()
    //     };
    //     await api.post('api/1.0/canvas/save', data);
    //     socket.emit('edit canvas', data.canvas);
    // }
    // // $('#save-canvas').click(saveCanvas);
    // canvas.on('object:modified', saveCanvas);  // action: modify
    // canvas.on('object:created', saveCanvas);  // action: create 
    // canvas.on('object:removed', saveCanvas);  // action: remove
    // canvas.on('path:created', saveCanvas);  // action: create
    // // Undo canvas
    // $('#undo-canvas').click( async () => {
    //     api.get('api/1.0/canvas/undo', { params: { card: card, user: user.id } })
    //     .then((response) => {
    //         const step = response.data.data.step;
    //         canvas.clear();
    //         canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
    //         socket.emit('edit canvas', step.canvas);
    //     }).catch((error) => {
    //         alert('Already the last step');
    //     });
    // });
    // // Redo canvas
    // $('#redo-canvas').click( async () => {
    //     api.get('api/1.0/canvas/redo', { params: { card: card, user: user.id } })
    //     .then((response) => {
    //         const step = response.data.data.step;
    //         canvas.clear();
    //         canvas.loadFromJSON(step.canvas, canvas.renderAll.bind(canvas));
    //         socket.emit('edit canvas', step.canvas);
    //     }).catch((error) => {
    //         alert('Already the last step');
    //     });
    // });
    // // Change canvas
    // socket.on('change canvas', (newCanvas) => { 
    //     canvas.clear();
    //     canvas.loadFromJSON(newCanvas, canvas.renderAll.bind(canvas));
    // });



    // const rect = new fabric.Rect({
    //     height: 100,
    //     width: 200,
    //     top: 200,
    //     left: 200,
    //     fill: '#fcba03',
    // })

    // canvas.add(rect)


    const rect2 = new fabric.Rect({
        height: 100,
        width: 200,
        top: 200,
        left: 100,
        fill: '#000000',
        // id: 1
    })

    canvas.add(rect2)

    // console.log(canvas.toJSON(['rec']))

    canvas.setActiveObject(rect2);

    // rect2.set('id', 1);

    // const te = canvas.getActiveObjects()[0].toJSON();
    const te = canvas.getActiveObjects()[0].toJSON()
    // const te2 = rect2;
    te.objId = 1
    te.left = 200

    // blankCanvas.objects.push(te);

    // canvas.loadFromJSON(blankCanvas, canvas.renderAll.bind(canvas));



    // console.log(te)
    // console.log(te2)

    

    // te.id = 1
    // console.log(te)
    // console.log(te.id)

    const setId = (te) => {
        // console.log(te);
        if (!te.customId) {
            te.customId = 'rec2'
        } else {
            te.customId = 3
        }
        // te.id = 'rec2'
        // console.log(te)
        console.log(te.customId)
    }

    $('#test1').click(() => {
        const te = canvas.getActiveObjects()[0].toJSON();
        console.log(te)
        setId(te);
    })

    let c2 = new fabric.Circle({
        left: 250, 
        top: 200,
        strokeWidth: 5,
        radius: 60,
        stroke: $('#color-border').val(),
        fill: $('#color-fill').val(),
        originX: 'center',
        originY: 'center',
        cornerStyle: 'circle',
        padding: 3,
        user: 'cd',
        hasBorders: false,
        hasControls: false,
        status: ' is editing'

        // evented: false,
        // selectable: false

    })

    let c2t = new fabric.Text(c2.user+c2.status, {
        fontSize: 20,
        opacity: 0.3,
        originX: 'center',
        originY: 'center',
        left: c2.left,
        top: c2.top
    })

    let group = new fabric.Group([c2, c2t], {
        objectCaching: false,
        selectable: false,
        evented: false
    })

    canvas.add(group)

    // canvas.add(c2)

    // canvas.on('mouse:down', e => {
    //     if (e.target != null) {
    //         e.target.on('mousedown', function(e) { 
    //             // console.log(e)
    //             // console.log(e.target)
    //             // console.log(e.target.status);
    //             console.log(e.target.objId);
    //         })
    //     } else {
    //         console.log('should be blank')
    //     }
    // })

    canvas.on('mouse:down', e => {
        if (e.target != null) {
            if (e.target.status != ' is editing') { // unneeded
                e.target.on('mousedown', function(e) { 
                    // console.log(e)
                    // console.log(e.target)
                    // console.log(e.target.status);
                    console.log(e.target.user);
                })
            } else {
                // e.target.on('mousedown', function(e) { 
                //     // console.log(e)
                //     // console.log(e.target)
                //     console.log(e.target.status);
                //     // console.log(e.target.objId);
                // })
            }
        } else {
            console.log('should be blank')
        }
    })
});