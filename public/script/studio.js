const checkUser = async () => {
    const payload = await verifyUserToken(userToken);
    if (userToken && payload) {
        $('main').removeClass('hide');
        return payload;
    } else {
        location.replace('/login.html');
    }
};

checkUser().then( async (res) => {
    const user = res.id;
    const userCards = (await axios.get('api/1.0/studio/user', { params: { user: user } })).data.data.cards;
    userCards.map((card) => {
        let element = $('<a>');
        element.attr('class', 'row-card');
        element.attr('id', card.id);
        element.attr('href', location.origin+`/card.html?card=${card.id}`);
        $('#row-card-wrapper').append(element);
        let title = $('<h3>');
        title.html(card.title);
        $(`#${card.id}`).append(title);
        let picture = $('<img>');
        picture.attr('src', card.picture);
        $(`#${card.id}`).append(picture);
    });
});

$('#new-card').hover(() => {
    $('#new-card-image').attr('src', './images/icons/newcard_hover.png')}, () => {
        $('#new-card-image').attr('src', './images/icons/newcard.png')
    }
);

$('#new-card').on('click', () => {
    axios.get('api/1.0/card/enroll')
        .then((res) => {
            const card = res.data.data.card;
            location.href = `card.html?card=${card}`
        })
        .catch((error) => { console.error(error) });
});

// --- PRELOADER ---
const loader = document.getElementById('loader');
const body = document.getElementsByTagName('body')[0];
const main = document.getElementsByTagName('main')[0];
body.style.height = '100vh';
window.addEventListener('load', () => {
    loader.style.display = 'none';
    body.style.height = 'unset';
    main.style.backgroundColor = '#dfdfdf';
});