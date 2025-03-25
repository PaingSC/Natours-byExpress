const app = require('./app');

// 4| Server
const port = 3000;
const host = '127.0.0.1';
app.listen(port, () => {
  console.log(`App is running on ${port}...`);
});
