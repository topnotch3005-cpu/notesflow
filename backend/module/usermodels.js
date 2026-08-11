const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const Users = mongoose.model("Users", userSchema)

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: String,
    tags: Array,
    color: String,
    isPinned: Boolean,
    isArchived: Boolean,
    isTrashed: Boolean,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    email: String,
})

const Notes = mongoose.model("Notes", noteSchema)

module.exports = {Users, Notes}