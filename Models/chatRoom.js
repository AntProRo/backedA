const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatRoomSchema = new Schema(
  {
    chatRoomSharedId: {
      type: Schema.Types.ObjectId,
    },
    comments: {
      type: Array,
      default: [],
    },
    guestUserA: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    guestUserB: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chats", chatRoomSchema);
