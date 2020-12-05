const displayUser = async () => {
    const userName = (await verifyUserToken(userToken)).name;
    if (userToken && userName) {
        $('#login').addClass('hide');
        $('#user').removeClass('hide');
        $('#logout').removeClass('hide');
        $('#user')[0].innerHTML = `Hello, ${userName}`;
    }
};

displayUser()

$('#login').click(() => {
    localStorage.setItem('history', '/studio.html')
});

$('#logout').click(() => {
    localStorage.removeItem('user_token');
    alert('Sign out successfully!');
    location.replace('/');
});

$('#new-card-btn').click(() => {
    const room = generateRoomId();
    $('#new-card-link')[0].href = `card.html?room=${room}`
});