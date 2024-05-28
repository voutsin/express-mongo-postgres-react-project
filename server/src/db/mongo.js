import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("Mongo DB connected!");
    }catch (e) {
        console.log(e);
        process.exit(1)
    }
}

export default connectToMongoDB;