import mongoose from 'mongoose'
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection

const connectToMongoDB = async () => {
    try {
        const mongoURI = `${process.env.MONGO_URI}/${process.env.MONGO_DB}`;
        await mongoose.connect(mongoURI, {})
        console.log("Mongo DB connected!");
    }catch (e) {
        console.log(e);
        process.exit(1)
    }
}

export default connectToMongoDB;