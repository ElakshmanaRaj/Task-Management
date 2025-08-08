const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONOGO_URL, {});
        console.log(`Databse Connected: ${conn.connection.host}, ${conn.connection.name}`);
        
    } catch (error) {
        console.error(`Database Connected Failed:${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;