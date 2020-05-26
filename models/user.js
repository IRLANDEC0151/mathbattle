const { Schema, model } = require("mongoose");
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,  
        required: true,  
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
    statistics: {
       items:[{
           statisticsModesId:{
            type: Schema.Types.ObjectId,
            ref:'statisticsModes',
            required:true,
           }
       }]
    },
});

module.exports = model("User", userSchema);
