const displayUser = async () => {
    const userName = (await verifyUserToken(userToken)).name;
    if (userToken && userName) {
        $('#login').addClass('hide');
        $('#start-with-showcard').addClass('hide');
        $('#user').removeClass('hide');
        $('#logout').removeClass('hide');
        $('#user')[0].innerHTML = `${userName}`;
    }
};

displayUser()

$('#login').click(() => {
    localStorage.setItem('history', '/studio.html');
});

$('#login-btn').click(() => {
    localStorage.setItem('history', '/studio.html');
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

$(document).ready(function() {
    $(".owl-carousel").owlCarousel({
        autoPlay: 3000,
        items : 4,
        itemsDesktop : [1199,3],
        itemsDesktopSmall : [979,3],
        center: true,
        nav:true,
        loop:true,
        responsive: {
            600: {
            items: 4
            }
        }
    });
});

