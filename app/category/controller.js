const Categories = require('./model');

const store = async (req, res, next) => {
    try{
        const payload = req.body;
        const category = new Categories(payload);
        await category.save()
        return res.json(category);

    } catch (error) {
        throw error
    }
};

const update = async (req, res, next) => {
    try{
        const payload = req.body;
        const { id } = req.params;
        const category = await Categories.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        res.json(category)
    } catch (error) {
        throw error
    }
}

const index = async (req, res, next) => {
    try {
        const category = await Categories.find();
        return res.json(category);
        
    }   catch (error) {
        throw error
    }
};

const destroy = async (req, res, next) => {
    try {
        let category = await Categories.findByIdAndDelete(req.params.id);
        return res.json(category);
    }   catch (error) {
        throw error
    }
}

module.exports = {
    store,
    index,
    update,
    destroy,
}