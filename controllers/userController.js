const { User, Thought } = require('../models');

//! (api/users/) functions
//Going to write everything inside module exports to save time.
// Also prefer async functions to .then() and .catch() functions

module.exports = {
    
    // 1. GET all users:
    getAllUsers: async (req, res) => {
        try{
            const users = await User.find();
            res.status(200).json(users);
        }
        catch(error){
            console.error(error);
            res.status(500).json( { error: 'Failed to get all users'});
        }

    },    
        
    
    // 2. Get a single user by its _id and populated thought and friend data:
    getSingleUser: async (req, res) => {
       try{
        const user = await User.findOne({_id: req.params.userId})
       .select('-__v') //excluded from get
       .populate('thoughts friends'); //includes sub/embedded docs in user schema
        
       !user 
       ? res.status(404).json( { error: ' User not found' })
       : res.status(200).json(user);
       }

       catch(error) {
        console.error(error);
        res.status(500).json( { error: 'Server Issue' } )
       }
    },
    
    // 3. POST a new user with a body:
    
    createUser: async (req, res) => {
        try{
            const user = await User.create(req.body);
            res.status(201).json(user);
        }
        catch(error) {
            console.error(error);
            res.status(500).json( { error: 'Server Issue' });
        }
    },

    // 4. PUT a user by its _id
    
    updateUser: async (req, res) => {
        try{
            const updatedUser = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                { new: true }
            );

            !updatedUser
            ? res.status(404).json({ error: 'User not found' })
            : res.status(200).json(updatedUser);
        }
        catch(error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue' });
        }
    },

    // 5. DELETE to remove a user by its _id

    deleteUser: async (req,res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.userId)
            !deletedUser
            ? res.status(404).json({ error: 'User not found'})
            : res.status(200).json({ message: 'User was deleted!'});
            
            // BONUS Delete associated thoughts
            await Thought.deleteMany({ username: deletedUser.username });
        }
        catch(error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue'});
        }
    }

};




//! /api/users/:userId/friends/:friendId

// 1. POST to add new friend to a user's friends list:

// 2. DELETE to remove a friend from a user's friends list:


