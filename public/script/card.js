const token = localStorage.getItem('access_token');
const urlParams = new URLSearchParams(location.search);
const room = urlParams.get('room');

if (!room) {
    // 如果沒有roomid，alert然後打回去
    // location.href = '/'
}

// 跟後台確認room，loading canvas，如果不存在一樣打回去

// axios.get('/room/check', {
//     params: {

//     }
// })
//     .then()



