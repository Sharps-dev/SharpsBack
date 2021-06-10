const { MissingBodyFieldError, AppError } = require("../helpers/AppError");
const Service = require("./Service");

class UserHistoryService extends Service {
    constructor(model) {
        super(model);
        this.insert = this.insert.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
    }

    async insert(data) {
        const eventFunc = {
            LIKE: async (data) => {
                const result = await super.insert(data);
                await this.removeEvent('DISLIKE', data);
                return result;
            },
            UNLIKE: async (data) => await this.removeEvent('LIKE', data),
            DISLIKE: async (data) => {
                const result = await super.insert(data);
                await this.removeEvent('LIKE', data);
                return result;
            },
            UNDISLIKE: async (data) => await this.removeEvent('DISLIKE', data)
        }
        if (eventFunc[data.eventType])
            return await eventFunc[data.eventType](data);
        else
            return await super.insert(data);
    }

    async removeEvent(eventType, data) {
        if (!data.content) throw new MissingBodyFieldError();
        if (!data.user) throw new AppError('', 500);
        data.eventType = eventType;
        await this.model.deleteOne(data);
        return false
    }
}

module.exports = UserHistoryService;
