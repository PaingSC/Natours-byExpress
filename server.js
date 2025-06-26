const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Handling(Catching) Uncaught Exceptions

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {})

  .then(() => console.log('DB connection successful!'));
// .catch((err) => console.error('DB connection error:', err));
// .catch((err) => console.log('Error !'));

// console.log(process.env);

// 4| Server
const port = process.env.PORT || 3000;
// const host = '127.0.0.1';
const sever = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

//Handling Unhandled Rejections: Safety Net
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION! 💥 shutting down...');
  console.log(err.name, err.message);
  // console.log(err);
  sever.close(() => {
    // process.exit(0) : Stands for success
    // process.exit(0) : Stands for uncaught exception
    process.exit(1);
  });
});
