
const SequelizeAuto = require('sequelize-auto');

const auto = new SequelizeAuto('booking_website', 'root', 'db_password', {
  host: 'localhost',
  dialect: 'mysql',
  directory: './models', // where to write files
  additional: {
    timestamps: false // set to true if you have createdAt/updatedAt fields
  }
});

auto.run().then(data => {
  console.log('Models generated!');
}).catch(err => {
  console.error('Error generating models:', err);
});