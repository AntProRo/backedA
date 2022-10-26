const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientManagersSchema = new Schema({
  clientManagerName: {
    type: String,
    required: true,
  },
  clientManagerLastName: {
    type:String,
    required:true
  },
  email: {
    type:String,
    required:false
  },
  client: {
    type:Schema.Types.ObjectId,
    ref:'client'
  },
  user: {
    type:Schema.Types.ObjectId,
    ref:'user'
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("clientManagers", clientManagersSchema);
