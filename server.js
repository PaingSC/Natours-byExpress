const dotenv = require('dotenv');
const mongoose = require('mongoose');

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

  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));

console.log(process.env);

// 4| Server
const port = process.env.PORT || 3000;
// const host = '127.0.0.1';
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
