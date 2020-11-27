// const ajax = (data, method, endpoint) => {

// }


// const xhr = new XMLHttpRequest();
// xhr.onreadystatechange = function() {
//     if (xhr.readyState === 4) {
//         const result = JSON.parse(xhr.responseText);
//         const orderNumber = result.data.number;
//         localStorage.removeItem('cart');
//         alert('付款成功，您的訂單已送出');
//         location.href = `./thankyou.html?number=${orderNumber}`;
//     }
// };
// xhr.open('POST', 'api/1.0/order/checkout');
// xhr.setRequestHeader("Content-type", "application/json");
// // xhr.setRequestHeader("Authorization", "Bearer x48aDD534da8ADSD1XC4SD5S");
// xhr.send(data);