const checkUser = async () => {
    const payload = await verifyUserToken(userToken);
    if (userToken && payload) {
        $('main').removeClass('hide');
        return payload;
    } else {
        location.replace('/login.html');
    }
};

checkUser()

const loader = document.getElementById('loader');
const body = document.getElementsByTagName('body')[0];
const main = document.getElementsByTagName('main')[0];
body.style.height = '100vh';
window.addEventListener('load', () => {
    loader.style.display = 'none';
    body.style.height = 'unset';
    main.style.backgroundColor = '#dfdfdf';
});