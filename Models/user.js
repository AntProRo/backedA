const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    status: {
      type: String,
      default: "public",
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userImage: {
      type: Object,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Collaborator",
    },
    manager: {
      type: Object,
      required: false,
    },
    notifications: {
      type: Array,
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    chatRoom: [
      {
        type: Schema.Types.ObjectId,
        ref: "chats",
        default: [],
      },
    ],
    dailyComments: [
      {
        type: Schema.Types.ObjectId,
        ref: "dailyComment",
        required: false,
      },
    ],
    birthDay: {
      type: String,
      required: false,
    },
    hired: {
      type: String,
      required: false,
    },
    previousApexManager: {
      type: Array,
      default: [],
    },
    currentManager: {
      type: Schema.Types.ObjectId,
      ref: "clientTechLeads",
      required: false,
    },

    currentTechLead: {
      type: Schema.Types.ObjectId,
      ref: "clientManagers",
      required: false,
    },

    currentClient: {
      type: Schema.Types.ObjectId,
      ref: "client",
      required: false,
    },

    isStillWorking: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
