const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
/*   clientManagers: [
    {
      type: Schema.Types.ObjectId,
      ref: "clientManagers",
    },
  ],
  clientTeachLeads: [
    {
      type: Schema.Types.ObjectId,
      ref: "clientTeachLeads",
    },
  ], */
  user: {
    type:Schema.Types.ObjectId,
    ref:'user'
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("client", clientSchema);
