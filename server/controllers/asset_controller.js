const Asset = require('../models/asset_model');

const getAssets = async (req, res) => {
    const category = req.params.category;
    const { result, error } = await Asset.getAssets(category);
    if (error) return res.status(500).json({ error: 'Internal server error' });
    return res.status(200).json({ data: { asset: result } });
};

module.exports = {
    getAssets
}