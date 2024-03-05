const express = require('express');
require('dotenv').config();
const User = require('./models/users');

const app = express();

app.use(express.json({ extended: false }));

const userRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const profileRouter = require('./routes/api/profiles');
const postRouter = require('./routes/api/posts');

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 4000;

const connectDB = require('./db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Listening on ${PORT} port`));
  } catch (error) {
    console.log(error);
  }
};

start();
