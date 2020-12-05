const token = localStorage.getItem('user_token');

const checkUser = async () => {
    const user = await verifyUserToken(token);
    if (token && user) {
        $('#login').addClass('hide');
        $('#user').removeClass('hide');
        $('#logout').removeClass('hide');
        $('#user')[0].innerHTML = `Hello, ${user}`;
    }
};

checkUser()

$('#login').click(() => {
    localStorage.setItem('history', location.href)
});

$('#logout').click(() => {
    localStorage.removeItem('user_token');
    alert('Sign out successfully!');
    location.replace('/');
});