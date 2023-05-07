const { Schema, model } = require('mongoose');


// Function for formatting the date:
const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
};

// Schema for reaction (will go inside thought and needs to exist beforehand so that it can be used as a subdocument)
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (date) => formatTimestamp(date)
        }
    },
    { _id: false } //disables automatic creation of id's
);



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
        get: (date) => formatTimestamp(date),
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
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;