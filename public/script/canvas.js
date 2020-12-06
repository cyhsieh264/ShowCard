// Init Canvas
const canvas = new fabric.Canvas('canvas', {
    width: 600,
    height: 400,
    originX: 'center',
    backgroundColor: '#fff',
});

const token = localStorage.getItem('user_token');

// set username and get token
// 一進來就確認有沒有token，如果沒有就執行-

// Check and Load Canvas When Entering the Room
// const token = localStorage.getItem('access_token');
const xhr = new XMLHttpRequest();
xhr.open('GET', 'api/1.0/canvas/check');
xhr.setRequestHeader("Content-type", "application/json");
xhr.setRequestHeader('Authorization', `Bearer ${token}`);
xhr.send();
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        const result = JSON.parse(xhr.responseText);
        if (result.data.count == 0){
            data = canvas.toJSON();
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'api/1.0/canvas/init');
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send(JSON.stringify(data));
        } else {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'api/1.0/canvas/load');
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.send();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    const result = JSON.parse(xhr.responseText);
                    canvas.clear();
                    canvas.loadFromJSON(result.data.step.canvas, canvas.renderAll.bind(canvas));
                }
            };
        }
    }
};

// Init Color Selector


// Init Brush Function
const brush = new fabric.PatternBrush(canvas);

$('#brush-on').click(() => canvas.isDrawingMode = true);
$('#brush-off').click(() => canvas.isDrawingMode = false);

// Init Icon Function


// Init Text Function
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

// Init Shape Function
const rect = new fabric.Rect({
    height: 100,
    width: 200,
    top: 200,
    left: 200,
    fill: '#fcba03'
})

canvas.add(rect);

const rect2 = new fabric.Rect({
    height: 100,
    width: 200,
    top: 250,
    left: 80,
    fill: '#42f587'
})

canvas.add(rect2);
canvas.setActiveObject(rect2);

// canvas.isDrawingMode = true;
// const brush = new fabric.PatternBrush(canvas);

// Init Image Function


// Remove Object
$('#rm-obj').click(() => {
    const objects = canvas.getActiveObjects();
    objects.map(obj => canvas.remove(obj));
});

// Save and Synchronize Canvas
const saveCanvas = () => {
    data = canvas.toJSON();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/1.0/canvas/save');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            socket.emit('edit canvas', data);
        }
    };
};

$('#save-canvas').click(saveCanvas);
canvas.on('object:modified', saveCanvas);
canvas.on('object:created', saveCanvas);
canvas.on('object:removed', saveCanvas);
canvas.on('path:created', saveCanvas);

socket.on('change canvas', (newCanvas) => { 
    canvas.clear();
    canvas.loadFromJSON(newCanvas, canvas.renderAll.bind(canvas));
});

// Undo and Redo
$('#undo-canvas').click(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/1.0/canvas/undo');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const result = JSON.parse(xhr.responseText);
            if (result.error) {
                alert(result.error)
            } else {
                canvas.clear();
                canvas.loadFromJSON(result.data.step.canvas, canvas.renderAll.bind(canvas));
            }
        }
    };
});

$('#redo-canvas').click(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/1.0/canvas/redo');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const result = JSON.parse(xhr.responseText);
            if (result.error) {
                alert(result.error)
            } else {
                canvas.clear();
                canvas.loadFromJSON(result.data.step.canvas, canvas.renderAll.bind(canvas));
            }
        }
    };
});

// // Modify CSS Layout
// $('.lower-canvas').css({ left: 'auto' })
// $('.upper-canvas').css({ left: 'auto' })