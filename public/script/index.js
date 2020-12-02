// Sign Up
const signup = () => {
    // console.log('hi')
    // const name = $('#signupUsername').val();
    // const email = $('#signupEmail').val();
    // const password = $('#signupPassword').val();
    // const passwordCheck = $('#signupPassword2').val();
    // console.log(name, email, password, passwordCheck)
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
            const token = result.data.access_token;
            localStorage.setItem('access_token', token);
        }
    };

};

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

