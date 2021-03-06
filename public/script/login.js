const ifLogin = async () => {
    const data = await verifyUserToken(userToken);
    if (userToken && data) {
        location.replace('/');
    } else {
        $('body').removeClass('hide');
    }
};

ifLogin();

const api = axios.create({
    headers: { 'Content-Type': 'application/json' },
    responseType: 'json'
});

const signin = () => {
    const history = localStorage.getItem('history') || '/';
    const email = $('#signin-email').val();
    const password = $('#signin-password').val();
    if (!email) {
        $('#signin-alert').removeClass('hide');
        $('#signin-alert-msg')[0].innerHTML = 'Email is required';
        return;
    }
    if (!password) {
        $('#signin-alert').removeClass('hide');
        $('#signin-alert-msg')[0].innerHTML = 'Password is required';
        return;
    }
    if (!isValidEmailAddress(email)) {
        $('#signin-alert').removeClass('hide');
        $('#signin-alert-msg')[0].innerHTML = 'Invalid Email Address';
        return;
    }
    const user = {
        provider: 'native',
        email: email,
        password: password
    };
    api.post('api/1.0/user/signin', user)
    .then((response) => {
        const res = response.data.data
        const token = res.user_token;
        localStorage.setItem('user_token', token);
        location.replace(history);
    }).catch((err) => {
        $('#signin-alert').removeClass('hide');
        $('#signin-alert-msg')[0].innerHTML = err.response.data.error;
    });
};

function googleSignin(googleUser) {
    const history = localStorage.getItem('history') || '/';
    const user = {
        provider: 'google',
        token: googleUser.getAuthResponse().id_token
    };
    api.post('api/1.0/user/signin', user)
    .then((response) => {
        const res = response.data.data
        const token = res.user_token;
        localStorage.setItem('user_token', token);
        location.replace(history);
    }).catch((err) => {
        $('#signin-alert').removeClass('hide');
        $('#signin-alert-msg')[0].innerHTML = err.response.data.error;
    });
};

const signup = () => {
    const history = localStorage.getItem('history') || '/';
    const email = $('#signup-email').val();
    const name = $('#signup-name').val();
    const password = $('#signup-password').val();
    const confirmPassword = $('#signup-confirm-password').val();
    if (!email) {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = 'Email is required';
        return;
    }
    if (!name) {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = 'Name is required';
        return;
    }
    if (!isValidEmailAddress(email)) {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = 'Invalid Email Address';
        return;
    }
    if (!password) {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = 'Password is required';
        return;
    }
    if (password.match(/^(?=.*\d)(?=.*[a-z]).{8,30}$/) == null) {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = 'Password must be at least eight characters long and a mix of letters and numbers';
        return;
    }
    if (password != confirmPassword) {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = 'Password and confirm password do not match';
        $('#signup-password').val('');
        $('#signup-confirm-password').val('');
        return;
    }
    if (name.includes('<script>')) {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = 'Invalid username';
        return;
    }
    const user = {
        provider: 'native',
        email: email,
        name: name,
        password: password
    };
    api.post('api/1.0/user/signup', user)
    .then((response) => {
        const res = response.data.data
        const token = res.user_token;
        localStorage.setItem('user_token', token);
        swal({
            title: 'Notification',
            text: 'Sign Up Successfully',
            type: 'warning',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            location.replace(history);
        });
    }).catch((err) => {
        $('#signup-alert').removeClass('hide');
        $('#signup-alert-msg')[0].innerHTML = err.response.data.error;
    });
};

$('#go-register').click(() => {
    $('.signin-card').addClass('hide');
    $('.signup-card').removeClass('hide');
})

$('#go-login').click(() => {
    $('.signup-card').addClass('hide');
    $('.signin-card').removeClass('hide');
})

$('#signin-btn').click(signin);

$('#signin-email').keypress(function(e) {
    let code = e.keyCode ? e.keyCode : e.which;
    if ( code == 13 ) signin();
});

$('#signin-password').keypress(function(e) {
    let code = e.keyCode ? e.keyCode : e.which;
    if ( code == 13 ) signin();
});

$('#signup-btn').click(signup);

$('#signup-email').keypress(function(e) {
    let code = e.keyCode ? e.keyCode : e.which;
    if ( code == 13 ) signup();
});

$('#signup-user').keypress(function(e) {
    let code = e.keyCode ? e.keyCode : e.which;
    if ( code == 13 ) signup();
});

$('#signup-password').keypress(function(e) {
    let code = e.keyCode ? e.keyCode : e.which;
    if ( code == 13 ) signup();
});

$('#signup-confirm-password').keypress(function(e) {
    let code = e.keyCode ? e.keyCode : e.which;
    if ( code == 13 ) signup();
});

$('#close-signin-alert').click(() => {
    $('#signin-alert').addClass('hide');
});

$('#close-signup-alert').click(() => {
    $('#signup-alert').addClass('hide');
});

window.onload = function (e) {
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
};

window.onbeforeunload = function (e) {
    gapi.auth2.getAuthInstance().signOut().then( function () {
        auth2.disconnect();
    });
};