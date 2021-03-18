class Controller {

    constructor(service) {
        this.service = service;
        this.getAll = this.getAll.bind(this);
        this.insert = this.insert.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    async getAll(req, res, next) {
        try {
            return res.status(200).json(await this.service.getAll(req.query)).end();
        } catch (err) { next(err); }
    }

    async insert(req, res, next) {
        try {
            const item = await this.service.insert(req.body);
            return res.status(201).json(item).end();

        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const item = await this.service.update(id, req.body);
            return res.status(202).json(item);

        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await this.service.delete(id);
            return res.status(202);

        } catch (err) { next(err); }
    }
}
module.exports = Controller;
