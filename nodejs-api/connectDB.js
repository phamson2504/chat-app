const mongodb = require("mongoose");

const connectToMongo = async () => {
    try {
        mongodb.set('strictQuery', false)
        mongodb.connect(process.env.MONGO_LINK)
        console.log('DB connection successful')
    }
    catch (error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectToMongo;