const Tags = require('./model');

const store = async (req, res, next) => {
    try{
        const payload = req.body;
        const tag = new Tags(payload);
        await tag.save()
        return res.json(tag);

    } catch (error) {
        throw error
    }
};

const update = async (req, res, next) => {
    try{
        const payload = req.body;
        const { id } = req.params;
        const tag = await Tags.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        res.json(tag)
    } catch (error) {
        throw error
    }
}

const index = async (req, res, next) => {
    try {
        const tag = await Tags.find();
        return res.json(tag);
        
    }   catch (error) {
        throw error
    }
};

const destroy = async (req, res, next) => {
    try {
        let tag = await Tags.findByIdAndDelete(req.params.id);
        return res.json(tag);
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