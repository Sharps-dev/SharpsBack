const { MissingBodyFieldError, AppError } = require("../helpers/AppError");
const Service = require("./Service");
class UserHistoryService extends Service {
    constructor(model) {
        super(model);
        this.insert = this.insert.bind(this);
    }

    async insert(data) {
        const eventFunc = {
            UNLIKE: async (data) => {
                if (!data.content) throw new MissingBodyFieldError();
                if (!data.user) throw new AppError('', 500);
                data.eventType = 'LIKE';
                await this.model.deleteOne(data);
            }
        }
        if (eventFunc[data.eventType]) await eventFunc[data.eventType](data);
        else return await super.insert(data);
    }
}

module.exports = UserHistoryService;
