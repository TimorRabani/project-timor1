const mongoose = require('mongoose');
const { config } = require('../config/secret')

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${config.userMongo}:${config.passMongo}@cluster0.fl5aj.mongodb.net/project_ofer`);
    console.log("mongo atlas connect project_ofer...")
}