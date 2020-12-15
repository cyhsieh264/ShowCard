const displayUser = async () => {
    const userName = (await verifyUserToken(userToken)).name;
    if (userToken && userName) {
        $('#login').addClass('hide');
        $('#user').removeClass('hide');
        $('#logout').removeClass('hide');
        $('#user')[0].innerHTML = `${userName}`;
    }
};

displayUser()

$('#login').click(() => {
    localStorage.setItem('history', '/studio.html')
});

$('#logout').click(() => {
    localStorage.removeItem('user_token');
    alert('Sign Out Successfully');

    // swal({
    //     title: 'Notification',
    //     text: 'Sign Out Successfully',
    //     type: 'warning',
    //     confirmButtonText: 'OK'
    // }).then(() => {

    // });
});

$('#new-card-btn').click(() => {
    const card = generateId();
    $('#new-card-link')[0].href = `card.html?card=${card}`
});