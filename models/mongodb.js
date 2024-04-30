const mongoose = require('mongoose');

async function connectdb() {
    const url = 'mongodb://127.0.0.1:27017/classa-user-demo';
    try {
        await mongoose.connect(url);
        console.log(`Database connected: ${url}`);
    } catch (err) {
        console.error(`Connection error: ${err}`);
        process.exit(1);
    }
}

module.exports = connectdb;