const User = require("../Models/user");
let mongoose = require("mongoose");
const ChatRoom = require("../Models/chatRoom");
/* Search Method */
class APIfeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let s = {
      $or: [
        { email: { $regex: this.queryString.email } },
        { name: { $regex: this.queryString.email } },
        { lastName: { $regex: this.queryString.email } },
      ],
    };
    s = JSON.stringify(s);
    this.query.find(JSON.parse(s));
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.quey = this.query.skip(skip).limit(limit);
    return this;
  }
}

const updateCurrentUserLogged = async ({ newChatRoom, res, req }) => {
  const logged = req.user.id;
  await User.findById(logged).then((saveChat) => {
    saveChat.chatRoom.push(newChatRoom);
    saveChat.save();
  });

  newChatRoom.save();

  /*  await User.findByIdAndUpdate({ _id:logged }, {chatRoom:newChatRoom})  */
};

/////////////////////////////////////////////////////////////////////////////// Controllers

const controller = {
  getAllUserNotAdded: async (req, res, next) => {
    let features =
      req.user.role === "Manager" &&
      new APIfeature(
        User.find({ role: "Collaborator", owner: null })
          .select("-password")
          .lean(),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();
    const user = await features.query;

    res.json({
      status: "success",
      result: user.length,
      users: user,
    });
  },

  updateUserAccount: async (req, res, next) => {
    // Retrieve document
    let user = await User.findById(req.params.id);
    user.owner = req.user.id;

    const passwordChatRoom = mongoose.Types.ObjectId();

    /*Create ChatRoom */
    const checkIfChatAlreadyExist = ChatRoom.findOne({
      guestUserA: req.user.id,
      guestUserB: req.params._id,
    });
    const findUser = ChatRoom.findById({ _id: req.params._id });
   
    if (!checkIfChatAlreadyExist) {
      const newChatRoom = new ChatRoom({
        chatRoomSharedId: passwordChatRoom,
        guestUserA: req.user.id,
        guestUserB: req.params._id,
      });

      findUser.chatRoom.push(newChatRoom);
      

      updateCurrentUserLogged({ newChatRoom, res, req });
    }

    // Save changes
    await user
      .save()
      .then(() => {
        res.json({ msg: "User added" });
      })
      .catch((err) => {
        return next({ msg: "not found" });
      });
  },
};

module.exports = controller;
