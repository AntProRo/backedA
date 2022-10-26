const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collaboratorProjectSchema = new Schema({
  isCurrentProject: {
    type: Boolean,
    required: true,
    default:false
  },
  clientManager: {
    type: String,
    required: true,
  },
  clientTeachLead: {
    type: String,
    required: true,
  },
},
{
  timestamps: true
});
module.exports = mongoose.model('collaboratorProject',collaboratorProjectSchema)
