const User = require("../Models/user");
const Rooms = require("../Models/chatRoom");
const Comment = require("../Models/dailyComment");


const controller = {
  getChatRooms: async (req, res, next) => {
    const result = await User.findById({
      _id: req.user.id,
    }) /* .populate([{path:"chatRoom",model:"chats"},{path:"guestUserB",model:"user"}]) */
      .populate([
        {
          path: "chatRoom",
          model: "chats",
          populate: [
            { path: "guestUserB", model: "user", select: "-password" },
            { path: "guestUserA", model: "user", select: "-password" },
          ],
        },
      ])
      .select("-password")
      .catch(next);

    return res.json(result);
  },
  postComment: async (req, res, next) => {
    const { message, chatRoom } = req.body;

    const listMessage = await Rooms.findById({ _id: chatRoom }).select(
      "comments"
    );
    /* const newMessage = listMessage.comments.push({message:body,sendBy:req.user.id}) */

    let newArray = listMessage.comments.concat({
      message: message,
      sendBy: req.user.id,
    });
    newArray = [
      ...listMessage.comments,
      { message: message, sendBy: req.user.id },
    ];

    await Rooms.findByIdAndUpdate({ _id: chatRoom }, { comments: newArray })
      .then(() => {
        return res.json({ msg: "Comment Done" });
      })
      .catch(next);
  },

  /* Daily comments */

  getDailyComment: async (req, res, next) => {

    const getAllComments = await Comment.find({commentTo: req.params.id })
    res.json(
     getAllComments,
 
    );
  },
  postDailyComment: async (req, res, next) => {
    const { content } = req.body;
    if (!content)
      return res.status(302).json({ msg: "Content message is necessary" });
    const newDailyComment = new Comment({
      content: content,
      commentTo: req.params.id,
      user: req.user.id,
    });
    await newDailyComment
      .save()
      .then(() => {
        return res.json({ msg: "New comment added" });
      })
      .catch(next);
  },
  deleteDailyComment: async (req, res, next) => {},
  /*
  updateAct: async (req, res, next) => {
    const {
      description,
      observable,
      subject,
      dateToComplete,
      collaborator_id,
      statusDone,
      importanceLevel,
      evidenceImage
    } = req.body;

    await Act.findByIdAndUpdate(
      { _id: req.params.id },
      { description, observable, subject, dateToComplete, collaborator_id, statusDone,importanceLevel,evidenceImage }
    )
      .then(() => {
        return res.json({ msg: "Activity updated" });
      })
      .catch(next);
  },
  deleteAct: async (req, res, next) => {
    await Act.findByIdAndRemove({ _id: req.params.id })
      .then(async () => {
        return res.json({ msg: "activity deleted" });
      })
      .catch(next);
  },

  DoneAct: async (req, res, next) => {
    await Act.findByIdAndUpdate(
      { _id: req.params.id },
      { StatusDone: true }
    ).then(() => {
      return res.json({ msg: "Activity done" });
    });
  }, */
};

module.exports = controller;
