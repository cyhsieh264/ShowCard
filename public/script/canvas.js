const canvas = new fabric.Canvas('canvas', {
    width: 600,
    height: 400,
    originX: 'center',
    backgroundColor: '#fff',
})

// console.log(canvas)

const rect = new fabric.Rect({
    height: 100,
    width: 200,
    top: 200,
    left: 200,
    fill: '#fcba03'
})

canvas.add(rect)

// canvas.isDrawingMode = true;
// const brush = new fabric.PatternBrush(canvas);

const textbox = new fabric.Textbox('hello world', { 
    left: 150, 
    top: 100,
    editable: true,
    width: 300,
    textAlign: 'center',
    fill: '#8a91ab', // 字型顏色
    fontFamily: 'Delicious', // 設定字型
    // fontStyle: 'italic',  // 斜體
    // fontSize: 20, // 字型大小
    // fontWeight: 800, // 字型粗細
});

canvas.add(textbox);

const brush = new fabric.PatternBrush(canvas);

$('#brush-on').click(() => canvas.isDrawingMode = true)
$('#brush-off').click(() => canvas.isDrawingMode = false)

$('.lower-canvas').css({ left: 'auto' })

$('.upper-canvas').css({ left: 'auto' })

$('#save-canvas').click(() => {
    data = canvas.toJSON();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/1.0/canvas/savecanvas');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            socket.emit('edit canvas', data)
        }
    };
})

socket.on('change canvas', (otherCanvas) => {
    let newCanvas = otherCanvas
    console.log(newCanvas)
    if (canvas.getActiveObject()) {
        const activeObject = canvas.getActiveObject()
        console.log(activeObject)
        newCanvas = otherCanvas.objects.push(activeObject)
        
        canvas.clear();
        canvas.loadFromJSON(newCanvas, canvas.renderAll.bind(canvas));
    }
    // console.log(newCanvas)
    // canvas.clear();
    // canvas.loadFromJSON(newCanvas, canvas.renderAll.bind(canvas));
});

$('#undo-canvas').click(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/1.0/canvas/undocanvas');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const result = JSON.parse(xhr.responseText);
            canvas.clear();
            canvas.loadFromJSON(result.data[0].canvas, canvas.renderAll.bind(canvas));
        }
    };
})

$('#redo-canvas').click(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/1.0/canvas/redocanvas');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const result = JSON.parse(xhr.responseText);
            canvas.clear();
            canvas.loadFromJSON(result.data[0].canvas, canvas.renderAll.bind(canvas));
        }
    };
})

$('#del-obj').click(() => {
    canvas.remove(canvas.getActiveObject())
})

