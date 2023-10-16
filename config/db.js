require('dotenv').config()

const mongoose = require('mongoose');

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.o1gr5ky.mongodb.net/`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

//db.on('error', console.error.bind(console, 'MongoDB connection error:'));
/*db.once('open', () => {
  console.log('Connected to the MongoDB Atlas cluster');
});*/