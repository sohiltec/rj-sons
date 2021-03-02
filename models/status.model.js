var mongoose = require('mongoose');
var statusSchema = mongoose.Schema({

    orderStatus: {
        type: String
    }
});

module.exports = mongoose.model("Status", statusSchema);