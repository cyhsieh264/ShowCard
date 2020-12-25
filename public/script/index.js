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
    swal({
        title: 'Notification',
        text: 'Sign Out Successfully',
        type: 'warning',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        location.href = '/';
    });
});

$('#new-card-btn').on('click', () => {
    axios.get('api/1.0/card/enroll')
        .then((res) => {
            const card = res.data.data.card;
            location.href = `card.html?card=${card}`
        })
        .catch((error) => { console.error(error) });
});

$('.carousel').carousel();

