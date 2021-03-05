var mongoose = require('mongoose');
var adminSchema = mongoose.Schema({

    name: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model("Admin", adminSchema);