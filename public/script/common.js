// 取得token、roomId
const generateRoomId = () => {
    return Date.now().toString(36) + Math.random().toString(36).split('.')[1].substr(-8);
};

const newCard = (dom) => {
    dom.href = `card.html?room=${generateRoomId()}`
};
