const { Schema, model } = require('mongoose');
//reactionSchema require
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //TODO get method to format timestamp on query 
            get: (timestamp) => new Date(timestamp).toLocaleDateString()
        },
        //user that created thought, not sure if needs ref
        username: {
            type: String,
            required: true
        },
        reactions: [
            //Array of nested documents created with the reactionSchema
            reactionSchema
        ]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

//Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema.virtual('reactionCount').get( function() {
    return this.reactions.length;
});

const Thought = model('thought', thoughtSchema);

module.exports = Thought;