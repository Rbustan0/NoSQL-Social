const { User, Thought } = require('../models');
const mongoose = require('mongoose');

module.exports = {

    //! /api/thoughts

    // 1. GET all thoughts:
    getAllThoughts: async (req, res) => {
        try {
            const thoughts = await Thought.find();

            res.status(200).json(thoughts);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to get all thoughts' });
        }
    },
    // 2. GET a single thought by its _id
    getSingleThought: async (req, res) => {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            !thought
                ? res.status(404).json({ error: 'Thought not found' })
                : res.status(200).json(thought);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue' });
        }
    },
    // 3. POST to create a new thought (dont forget to push the created thought's _id to the associated user's thoughts array field)

    createThought: async (req, res) => {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findByIdAndUpdate(
                req.body.userId,
                { $push: { thoughts: thought._id } }, //adds element to array field
                { new: true }
            );

            // Changed this because threw an error
            if(!user){
               return res.status(404).json({ error: 'User not found' });
            }
                 
            res.status(201).json(thought);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue' });
        }
    },

    //  4. PUT to update a thought by its _id
    updateThought: async (req, res) => {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                req.body,
                { new: true }
            );

            !updatedThought
                ? res.status(404).json({ error: 'Thought not found' })
                : res.status(200).json(updatedThought);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue' });
        }
    },

    //  5. DELETE to remove a thought by its _id
    deleteThought: async (req, res) => {
        try {
            const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);

            // need this to be a standard if statement
            if (!deletedThought) {
                return res.status(404).json({ error: 'Thought not found' });
            }

            // Remove the thought from the associated user's thoughts array
            // NEED THIS due to no cascade defined in model
            await User.findByIdAndUpdate(
                deletedThought.userId,
                { $pull: { thoughts: deletedThought._id } }
            );

            res.status(200).json({ message: 'Thought was deleted!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue' });
        }
    },

    //! api/thoughts/:thoughtId/reactions

    // 1. POST to create a reaction stored in a single thought's reactions array field.
    createReaction: async (req, res) => {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                { $push: { reactions: req.body } },
                { new: true }
            );
            !thought
                ? res.status(404).json({ error: 'Thought not found' })
                : res.status(201).json(thought);

        } 
        
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue' });
        }
    
    },

    // 2. DELETE to pull and remove a reaction by the reaction's reactionId value.

    deleteReaction: async (req, res) => {
        try {
            const { thoughtId } = req.params;
            const { reactionId } = req.body;

            const thought = await Thought.findByIdAndUpdate(
                thoughtId,
                // could not get it to work without this new id 
                { $pull: { reactions: { _id: new mongoose.Types.ObjectId(reactionId) } } },
                { new: true }
            );

            !thought
                ? res.status(404).json({ error: 'Thought not found' })
                : res.status(200).json(thought);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Issue' });
        }
    }
};