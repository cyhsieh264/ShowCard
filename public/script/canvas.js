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
