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
                if (result.data) resolve(result.data.payload);
                else resolve(false);
            }
        };
    })
};

const generateId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36).substring(4);
};