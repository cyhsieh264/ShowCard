// const token = localStorage.getItem('access_token'); // 取得username
// const urlParams = new URLSearchParams(location.search);
// const room = urlParams.get('room');

// 包一個確認user資訊的function
const getUserName = () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
        const inputName = prompt('Please enter the name you want to display:');
        return inputName; 
    } else {
        const user = verifyUserToken(token);
        if (!userInfo) {
            alert('Please sign in again');
            // 將url塞入localstorage，方便登入後跳轉
            location.href = '/'
        } else {
            return user.username
        }
    }
};

// 一進房間產生/更新room_token, 不管是誰
const setRoomToken = () => {
    const urlParams = new URLSearchParams(location.search);
    const room = urlParams.get('room');
    const username = getUserName();
    const data = {
        room: room, 
        username: username
    };
    // 打ajax，順便response是不是owner跟pin code
    if (res.username == username) { // 表示是owner
        localStorage.setItem('room_token', res.token);
    } else {
        const pinCode = prompt('Please enter the pin code:');
        if (res.pinCode == pinCode) {
            localStorage.setItem('room_token', res.token);
            return { result: res.token }
        } else {
            alert('Wrong pin code, please try again'); // 輸入幾次錯誤？
            return { error: 'Wrong pin code' }
            // location.href = '/' // 回到上一步，再call一次
        }
    }
};

const roomToken = setRoomToken();
if (checkUser.error) {
    setRoomToken();
} else {
    // 用roomToken跟後台確認, 找到 card_id 然後loading最新的canvas
    // 跑之前一進canvas的流程
}








// // 一進房間產生room_token，不管是誰
// if ( !token ) {
//     // 輸入userdisplayname
// }


// if (!room) {
//     // 如果沒有roomid，alert然後打回去
//     // location.href = '/'
// }

// 跟後台確認room，loading canvas，如果不存在一樣打回去

// axios.get('/room/check', {
//     params: {

//     }
// })
//     .then()



