// Sign Up
// const signup = () => {
    // check if blank & if password is the same
    // const name = $('#signupUsername').val();
    // const email = $('#signupEmail').val();
    // const password = $('#signupPassword').val();
    // const passwordCheck = $('#signupPassword2').val();
    // console.log(name, email, password, passwordCheck)


// $('#new-card-btn').click(newCard);

$('#new-card-btn').click(() => {
    newCard($('#new-card-link')[0])  // newCard(dom)
});



$('#signup-btn').click(() => {
    data = {
        username: $('#signupUsername').val(),
        email: $('#signupEmail').val(),
        password: $('#signupPassword').val()
    };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/1.0/user/signup');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const result = JSON.parse(xhr.responseText);
            if (result.error) {
                $('#signup-alert').removeClass('hidden');
                $('#signup-alert-msg')[0].innerHTML = result.error;
            } else {
                const token = result.data.access_token;
                localStorage.setItem('user_token', token);
            }
        }
    };
});

$('.close-alert').click(() => {
    $('#signup-alert').addClass('hidden');
    $('#signin-alert').addClass('hidden');
})


// const signin = () => {
    // check if blank & if password is the same
    // const name = $('#signupUsername').val();
    // const email = $('#signupEmail').val();
    // const password = $('#signupPassword').val();
    // const passwordCheck = $('#signupPassword2').val();
    // console.log(name, email, password, passwordCheck)
$('#signin-btn').click(() => {
    data = {
        user: $('#signinUser').val(),
        password: $('#signinPassword').val()
    };
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/1.0/user/signin');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const result = JSON.parse(xhr.responseText);
            if (result.error) {
                $('#signin-alert').removeClass('hidden');
                $('#signin-alert-msg')[0].innerHTML = result.error;
            } else {
                const token = result.data.access_token;
                localStorage.setItem('access_token', token);
            }
        }
    };
});

// $('.signup-form-btn:first').click(() => {
//     $('.form-container').removeClass('hide');
//     $('.signup-form').removeClass('hide');
// });

// $('.signin-form-btn:first').click(() => {
//     $('.form-container').removeClass('hide');
//     $('.signin-form').removeClass('hide');
// });

// $('#signup-btn').click(signUp);
// $('#signup-name').blur(() => {
//     if($('#signup-name').val() == '') {

//     }
// })

// Check Input Information by AJAX
const checkExistence = (value, category) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/1.0/user/checkexistence');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            const result = JSON.parse(xhr.responseText);
            if (result.message) {
                alert(result.message)
            } else {
                canvas.clear();
                canvas.loadFromJSON(result.data.step.canvas, canvas.renderAll.bind(canvas));
            }
        }
    };
};

