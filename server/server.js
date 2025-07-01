
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const Message = require('./models/Message');

app.use(cors());
app.use(express.json());


const mongoURI = process.env.MONGO_URI;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    await mongoose.connect(mongoURI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await mongoose.disconnect();
  }
}

app.get('/', (req, res) =>{
    res.send('Hello from the server!');
})

//fetching messages
app.get('api/messages', async (req, resp) => {
    try {
        const messages = await Message.find().sort({ timestamp : 1});
        resp.json(messages)
    } catch (error) {
        console.error('Error fetching messages:', error);
        resp.status(500).json({error : "Server error"})
    }
});
//saving messages
app.post('/api/messages', async (req, resp)=> {
    const {username, content} = req.body;
    if (!username || !content){
        return resp.status(400).json({error : "Invalid username or message"});
    };
    try {
        const newMessage = new Message({
            username,
            content
        });
        await newMessage.save();
        resp.status(201).json(newMessage);
    } catch (error) {
        resp.status(500).json({error : "Server error"})
    }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    run().catch(console.dir);
});