localStorage.setItem('history', location.pathname + location.search)

const checkUser = async () => {
    const data = await verifyUserToken(userToken);
    if (userToken && data) {
        $('main').removeClass('hide');
        return data;
    } else {
        alert('Please Sign in');
        location.replace('/login.html')
    }
};

checkUser().then( user => {
    console.log(user)
});




// // 一進房間產生/更新room_token, 不管是誰
// const setRoomToken = () => {
//     const urlParams = new URLSearchParams(location.search);
//     const room = urlParams.get('room');
//     const name = getUserName();
//     const color = '#b6b6b6';
//     const data = {
//         room: room, 
//         name: name,
//         color: color
//     };
//     // 打ajax，順便response是不是owner跟pin code
//     if (res.name == name) { // 表示是owner
//         localStorage.setItem(room, res.token);
//     } else {
//         const pinCode = prompt('Please enter the pin code:');
//         if (res.pinCode == pinCode) {
//             localStorage.setItem('room_token', res.token);
//             return { result: res.token }
//         } else {
//             alert('Wrong pin code, please try again'); // 輸入幾次錯誤？
//             return { error: 'Wrong pin code' }
//             // location.href = '/' // 回到上一步，再call一次
//         }
//     }
// };

// const roomToken = setRoomToken();
// if (checkUser.error) {
//     setRoomToken();
// } else {
//     // 用roomToken跟後台確認, 找到 card_id 然後loading最新的canvas
//     // 跑之前一進canvas的流程
// }








// // // 一進房間產生room_token，不管是誰
// // if ( !token ) {
// //     // 輸入userdisplayname
// // }


// // if (!room) {
// //     // 如果沒有roomid，alert然後打回去
// //     // location.href = '/'
// // }

// // 跟後台確認room，loading canvas，如果不存在一樣打回去

// // axios.get('/room/check', {
// //     params: {

// //     }
// // })
// //     .then()



