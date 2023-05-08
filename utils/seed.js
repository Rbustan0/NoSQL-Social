// !WORK HERE SECOND THING (then proceeed to controller)
const connection = require('../config/connection');
const { User, Thought } = require('../models');

// const { getRandomUserEmail, getRandomThoughts } = require('/.data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected to server');
    await Thought.deleteMany({});
    await User.deleteMany({});
    
    const users = [];
    //const thoughts = getRandomThoughts(?);

    // for loops gp here


    await User.collection.insertMany(users);
    await Thought.collection.insertMany(thoughts);
});

console.table(users);
console.table(thoughts);
console.info('Seeding complete! 🌱');
process.exit(0);