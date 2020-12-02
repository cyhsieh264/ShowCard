// Sign Up
const signUp = () => {
    console.log('he')
    const name = $('#signup-name').val();
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
    const passwordCheck = $('#signup-password-check').val();
    console.log(name, email, password, passwordCheck)
};

$('#signup-btn').click(signUp);

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