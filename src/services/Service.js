const mongoose = require("mongoose");

class Service {

    constructor(model) {
        this.model = model;
        this.getAll = this.getAll.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(query) {
        let { skip, limit } = query;

        skip = skip ? Number(skip) : 0;
        limit = limit ? Number(limit) : 10;

        delete query.skip;
        delete query.limit;

        if (query._id)
            query._id = new mongoose.mongo.ObjectId(query._id);
        let items = await this.model.find(query).skip(skip).limit(limit);
        let total = await this.model.count();

        return { items, total };
    }

    async getOne(query) {
        if (query._id)
            query._id = new mongoose.mongo.ObjectId(query._id);
        let item = await this.model.findOne(query);
        return item;
    }

    async insert(data) {
        let item = await this.model.create(data);
        if (item)
            return item;
    }

    async update(id, data) {
        let item = await this.model.findByIdAndUpdate(id, data, { new: true });
        return item;
    }

    async delete(id) {
        let item = await this.model.findByIdAndDelete(id);
        return item;
    }
}
module.exports = Service;
