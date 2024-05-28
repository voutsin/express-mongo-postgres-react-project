import Message from "../model/Message.js";

const findAll = async (req, res, next) => {
    try{
        const products = await Message.find();
        return res.status(200).json({
            status: 200,
            data: products
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: e
        });
    }
}

const save = async (req, res, next) => {
    try {
        const message = new Message();
        message.groupId = req.groupId;
        message.senderId = req.senderId;
        message.content = req.content;
        message.timestamp = req.timestamp;
        await message.save();

        return res.status(201).json({
            status: 201,
            message: message,
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: e
        });
    }
}

export default {
    findAll,
    save
};