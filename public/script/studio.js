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