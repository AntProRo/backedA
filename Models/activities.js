const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    evidenceImage:{
      type: Object,
      required: false,
    },
    subject: {
      type: String,
      required: true,
    },
    observable: {
      default: "private",
      type: String,
      required: true,
    },
    dateToComplete: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    importanceLevel: {
      type: String,
      required: true,
      default: "low",
    },
    statusDone: {
      default: "todo",
      type: String,
      required: true,
    },
    collaborator_id: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("activity", activitySchema);
