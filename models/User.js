const { Schema, Model } = require('mongoose');

// Schema for User:
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // Found on site: https://masteringjs.io/tutorials/mongoose/mongoose-validate-unique-email Validates min one character before the @, before the . for the site, and then one after the . for the site
            match: [/.+\@.+\..+/, 'Please enter a valid email address']
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]

    }
);

// Virtual property to get the length of the user's friends array.

userSchema

.virtual('friendCount')

.get(function () {return this.friends.length});


const User = mongoose.model('User', userSchema);
module.exports = User;