const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientTechLeadSchema = new Schema({
  projectTechLeadName: {
    type: String,
    required: true,
  },
  projectTechLeadLastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  occupation: {
    type: String,
    required: false,
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

module.exports = mongoose.model("clientTechLeads", clientTechLeadSchema);
