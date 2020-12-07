const userToken = localStorage.getItem('user_token');

const verifyUserToken = (token) => {
    return new Promise ((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'api/1.0/user/verify');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                const result = JSON.parse(xhr.responseText);
                if (result.error) {
                    console.log(result.error);
                    resolve(false);
                } else {
                    resolve(result.data);
                }
            }
        };
    })
};

const generateCardId = () => {
    return Date.now().toString(36) + Math.random().toString(36).split('.')[1].substr(-8);
};