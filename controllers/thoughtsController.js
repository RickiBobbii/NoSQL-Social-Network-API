const { Thought, User } = require('../models');

module.exports = {
// Gets all thoughts
async getThoughts(req, res) {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
},
// Gets a single thought
async getSingleThought(req, res) {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId });

        if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
},
// Creates a new thought. Accepts a request body with the entire Thought object.
// Because thoughts are associated with Users, we then update the User who created the thought and add the ID of the thought to the thoughts array
async createThought(req, res) {
    try {
        const thought = await Thought.create(req.body);
        const user = await User.findOneAndUpdate(
            {username: req.body.username},
            //{ _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
            message: 'Thought created, but found no user with that ID',
        })
        }

        res.json('Thought created!');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},
// Updates the thought using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
async updateThought(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }

        res.json(thought);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
},
// Deletes a thought from the database. Looks for a thought by ID.
// Then if the thought exists, we look for any users associated with the thought based on the thought ID and update the thoughts array for the User.
async deleteThought(req, res) {
    try {
        const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }

        const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: 'Thought created but no user with this id!',
            });
        }

        res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
        res.status(500).json(err);
    }
},
// TEST add reaction to thought
// Adds a reaction to a thought. This method is unique in that we add the entire body of the reaction rather than the ID with the mongodb $addToSet operator.
async addReaction(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
},
// Remove thought reaction. This method finds the thought based on ID. It then updates the reactions array associated with the thought in question by removing it's reactionId from the reactions array.
async removeReaction(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
},
};
