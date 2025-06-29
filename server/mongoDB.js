
const mongoose = require('mongoose');
const uri = "mongodb+srv://ZiomsonPL:<kuba123456>@chat.x0e15jw.mongodb.net/?retryWrites=true&w=majority&appName=Chat";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
