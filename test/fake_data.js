const assets = [
    {
        title: 'asset_1',
        file_format: '.png',
        category: 'background',
        width: 540,
        height: 540,
        left_position: 100,
        top_pisition: 100
    },
    {
        title: 'asset_2',
        file_format: '.jpg',
        category: 'background',
        width: 540,
        height: 540,
        left_position: 100,
        top_pisition: 100
    },
    {
        title: 'asset_3',
        file_format: '.png',
        category: 'icon',
        width: 300,
        height: 300,
        left_position: 100,
        top_pisition: 100
    },
    {
        title: 'asset_4',
        file_format: '.png',
        category: 'icon',
        width: 300,
        height: 300,
        left_position: 100,
        top_pisition: 100
    },
    {
        title: 'asset_5',
        file_format: '.jpg',
        category: 'background',
        width: 540,
        height: 540,
        left_position: 100,
        top_pisition: 100
    }
];

const objects = [
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 1,
        action: 'origin',
        obj_id: null,
        obj_type: null,
        object: null,
        is_background: null
    },
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 2,
        action: 'origin',
        obj_id: null,
        obj_type: null,
        object: null,
        is_background: null
    },
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 1,
        action: 'create',
        obj_id: 'aaa',
        obj_type: 'circle',
        object: "{'object':'aaa1'}",
        is_background: false
    },
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 2,
        action: 'create',
        obj_id: 'bbb',
        obj_type: 'path',
        object: "{'object':'bbb1'}",
        is_background: false
    },
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 1,
        action: 'modify',
        obj_id: 'aaa',
        obj_type: 'circle',
        object: "{'object':'aaa2'}",
        is_background: false
    },
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 1,
        action: 'recreate',
        obj_id: 'bbb',
        obj_type: 'path',
        object: "{'object':'bbb1'}",
        is_background: false
    },
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 1,
        action: 'modify',
        obj_id: 'bbb',
        obj_type: 'path',
        object: "{'object':'bbb2'}",
        is_background: false
    },
    {
        card_id: '7h2c9vp2esgnh3d',
        user_id: 2,
        action: 'remove',
        obj_id: 'aaa',
        obj_type: 'circle',
        object: "{'object':'aaa2'}",
        is_background: false
    }
]

module.exports = {
    assets,
    objects
};