const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
    path: '../.env'
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected successfully....');
    } catch (error) {
        console.error('Connection to database failed!', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
