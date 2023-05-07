const { Schema, Model } = require('mongoose');

// Schema for Thought:
const thoughtSchema = new Schema({
    
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },

    createdAt: {
        type: Date,
        default: Date.now(),
        // uses getter to formate the timestamp on query call
        get: (date) => formatDate(date),
    },

    username: {
        type: String,
        required: true,
    },
    // Going to try this in this format due to it also being defined in the same file structure.
    reactions: [reactionSchema],
});

// Our virtual to get reactions length:
thoughtSchema
.virtual('reactionCount')
.get(function () { return this.reactions.length });

// Exporting Statements
const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;