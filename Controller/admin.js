const User = require("../Models/user");
const Activities = require("../Models/activities");
const bCrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { generatePassword } = require("../utils/apiUtils");
const ChatRoom = require("../Models/chatRoom");
let mongoose = require("mongoose");

/* Search Method */
class APIfeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    /*     const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );

    this.query.find(JSON.parse(queryStr));
    return this; */

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
    /* const test= JSON.parse(queryStr.replace(/}{/g,',')); */
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
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

/*  Search Method*/
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MESSAGE_EMAIL,
    pass: process.env.PASS_EMAIL, /// 2 step verification account, Generate another passWord
  },
});

const notifyPassword = async ({ email, newPassword, res }) => {
  let mailOptions;
  if (!newPassword) {
    mailOptions = {
      from: process.env.MESSAGE_EMAIL,
      to: email,
      subject: `Your email has been blocked to access  A-Project`,
      text: `your current password is not working anymore`,
    };
  } else {
    mailOptions = {
      from: process.env.MESSAGE_EMAIL,
      to: email,
      subject: `Your email has access to A-Project`,
      text: `Here is your password assigned ${newPassword}`,
    };
  }

  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.status(302).json({ msg: "Something went wrong" });
    } else {
      return res.status(200).json({ msg: "Email send" });
    }
  });
};
/* Register */
const createUserAndNotifyAccount = async ({ newUser, res, newPassword }) => {
  const email = newUser.email;
  await newUser.save().then(() => {
    notifyPassword({ email, res, newPassword });
  });
};

const createUserAndBlockAccount = async ({ newUser, res }) => {
  await newUser.save().then(() => {
    return res.status(200).json({ msg: "New user created and not notified" });
  });
};

const updateCurrentUserLogged = async ({ newChatRoom, res, req }) => {
  const logged = req.user.id;
  await User.findById(logged).then((saveChat) => {
    saveChat.chatRoom.push(newChatRoom);
    saveChat.save();
  });

  newChatRoom.save();

  /*  await User.findByIdAndUpdate({ _id:logged }, {chatRoom:newChatRoom})  */
};

const updateUserAndNotifyAccount = async ({ email, newPassword, res }) => {
  notifyPassword({ email, res, newPassword });
};

/////////////////////////////////////////////////////////////////////////////// Controllers

const controller = {
  getAllUser: async (req, res, next) => {
    let features =
      (req.user.role === "Admin" &&
        new APIfeature(User.find().select({ password: 0 }).lean(), req.query)
          .filtering()
          .sorting()
          .paginating()) ||
      (req.user.role === "Manager" &&
        new APIfeature(
          User.find({ role: "Collaborator", owner: req.user.id })
            .select("-password")
            .lean(),
          req.query
        )
          .filtering()
          .sorting()
          .paginating()) ||
      (req.user.role === "Collaborator" &&
        new APIfeature(
          Activities.find({ collaborator_id: req.user.id })
            .select({ password: 0 })
            .lean(),
          req.query
        )
          .filtering()
          .sorting()
          .paginating());

    const user = await features.query;

    res.json({
      status: "success",
      result: user.length,
      users: user,
    });
  },

  getAllManager: async (req, res, next) => {
    const getAllManagers = await User.find({ role: "Manager" });
    return res.status(200).json({ getAllManagers });
  },
  registerNewUserAccount: async (req, res, next) => {
    const {
      name,
      email,
      lastName,
      occupation,
      role,
      userImage,
      status,
      manager,
    } = req.body;

   let {currentClient, currentTechLead, currentManager} = req.body

    if ((!name, !email, !lastName, !occupation))
      return res.status(401).json({ msg: "Complete all fields" });
    const user = await User.findOne({ email });
    if (user) return res.status(401).json({ msg: "Email already exist" });

    const newPassword = generatePassword();
    const passwordHash = await bCrypt.hash(newPassword, 10);

     if(currentClient === "" ) (currentClient = null)
    if(currentTechLead === "") (currentTechLead = null)
    if(currentManager === "") (currentManager = null)
    const passwordChatRoom = mongoose.Types.ObjectId();

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      lastName,
      occupation,
      role,
      status,
      manager,
      userImage,
      currentManager,
      currentTechLead,
      currentClient,
      owner: req.user.id,
      chatRoom: [],
    });

    /*Create ChatRoom */
    const newChatRoom = new ChatRoom({
      chatRoomSharedId: passwordChatRoom,
      guestUserA: req.user.id,
      guestUserB: newUser._id,
    });

    newUser.chatRoom.push(newChatRoom);

    if (status === "public") {
      createUserAndNotifyAccount({ newUser, res, newPassword });
    }
    if (status === "private") {
      createUserAndBlockAccount({ newUser, res });
    }

    updateCurrentUserLogged({ newChatRoom, res, req });
  },

  addToManagerUserAccountAlreadyDone: async (req, res, next) => {
    await User.findById({ _id: req.params.id })
      .then((upToDate) => {
        upToDate.owner = req.user.id;
        upToDate.save();
      })
      .catch((err) => {
        return next(err);
      });
  },

  updateUserAccount: async (req, res, next) => {
    const {
      name,
      email,
      lastName,
      occupation,
      role,
      userImage,
      status,
      manager,
    } = req.body;

    let { currentClient, currentTechLead, currentManager } = req.body;

    if(currentClient === "" ) (currentClient = null)
    if(currentTechLead === "") (currentTechLead = null)
    if(currentManager === "") (currentManager = null)

    const user = await User.findOne({_id:req.params.id});

    const newPassword = generatePassword();
    const passwordHash = await bCrypt.hash(newPassword, 10);

    let saveUser = {
      name,
      email,
      lastName,
      occupation,
      role,
      userImage,
      status,
      /*  password: passwordHash, */
      manager,
      currentManager,
      currentTechLead,
      currentClient,
    };
    if (status === "private") saveUser["password"] = passwordHash;
    if (user.status !== status && status === "private")
      notifyPassword({ email, res });
    if (user.status !== status && status === "public")
      updateUserAndNotifyAccount({ email, newPassword, res });

    await User.findByIdAndUpdate({ _id: req.params.id }, saveUser).then(()=> {
      res.json({ msg: "User Updated" });
    }).catch(
      (err) => {
        return next(err);
      }
    );
  },

  deleteUserAccount: async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json({ msg: "User account deleted" });
      })
      .catch((err) => {
        return next({ msg: "not found" });
      });
  },

  deleteUserAccountManager: async (req, res, next) => {
    // Retrieve document
    const user = await User.findById(req.params.id);

    // Delete role field
    user.owner = null;
    

    // Save changes
    await user
      .save()
      .then(() => {
        res.json({ msg: "User account deleted" });
      })
      .catch((err) => {
        return next({ msg: "not found" });
      });
  },
};

module.exports = controller;
