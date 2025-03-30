const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// console.log(process.env);

// 4| Server
const port = process.env.PORT || 3000;
// const host = '127.0.0.1';
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
