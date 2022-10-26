const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userCommentSchema = new Schema({
  content: 
    {
      type: String,
      required:true
    },
  commentTo: 
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  user: {
    type:Schema.Types.ObjectId,
    ref:'user'
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("dailyComment", userCommentSchema);
