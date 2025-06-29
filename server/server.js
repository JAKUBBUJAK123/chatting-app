require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);


const Message = require('./models/Message');

app.use(cors());
app.use(express.json());


const io = new Server(server, {
    cors: {
        origin: process.env.ANGULAR_APP_URL || 'http://localhost:4200',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on('sendMessage', async (message) => {
        const {username, content} = DataTransfer;
        if (!username || !content){
            console.warn('received invalid message:', message);
            return;
        }
        try {
            const newMessage = new Message({ username, content});
            await newMessage.save();
            io.emit('message', newMessage);
            console.log(`Message saved and broadcasted: ${username}: ${content}`);
        } catch (err) {
            console.error('Error saving or broadcasting message:', err);
        }
    });
    socket.on('disconnect', ()=> {
        console.log(`User disconeccted: ${socket.id}`)
    })
})

const mongoURI = process.env.MONGO_URI;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    await mongoose.connect(mongoURI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
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
// app.post('/api/messages', async (req, resp)=> {
//     const {username, content} = req.body;
//     if (!username || !content){
//         return resp.status(400).json({error : "Invalid username or message"});
//     };
//     try {
//         const newMessage = new Message({
//             username,
//             content
//         });
//         await newMessage.save();
//         resp.status(201).json(newMessage);
//     } catch (error) {
//         resp.status(500).json({error : "Server error"})
//     }
// })

const PORT = process.env.PORT
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    run().catch(console.dir);
});