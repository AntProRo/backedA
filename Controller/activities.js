const Act = require("../Models/activities");
const User = require("../Models/user");

const controller = {
  getAct: async (req, res, next) => {
    await Act.find({ collaborator_id: req.params.id })
      .then((activities) => {
        const todo = [];
        const inProgress = [];
        const review = [];
        const completed = [];
        for (i = 0; i < activities.length; i++) {
          if (activities[i].statusDone === "todo") {
            todo.push(activities[i]);
          }
          if (activities[i].statusDone === "inProgress") {
            inProgress.push(activities[i]);
          }
          if (activities[i].statusDone === "review") {
            review.push(activities[i]);
          }

          if (activities[i].statusDone === "completed") {
            completed.push(activities[i]);
          }
        }
        res.json({
          todo: todo,
          inProgress: inProgress,
          review: review,
          completed: completed,
        });
      })
      .catch(next);
  },
  postAct: async (req, res, next) => {
    const {
      description,
      observable,
      importanceLevel,
      subject,
      dateToComplete,
      collaborator_id,
      evidenceImage
    } = req.body;
    if (
      !description ||
      !observable ||
      !subject ||
      !dateToComplete ||
      !collaborator_id
    )
      return res.status(302).json({ msg: "Complete all fields" });

    const newActivity = new Act({
      description: description,
      observable: observable,
      importanceLevel: importanceLevel,
      subject: subject,
      dateToComplete: dateToComplete,
      collaborator_id: collaborator_id,
      statusDone: "todo",
      evidenceImage:evidenceImage
    });
    await newActivity
      .save()
      .then(() => {
        return res.json({ msg: "New activity added" });
      })
      .catch(next);
  },
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
    /* Delete task logic and not physically */
    await Act.findByIdAndRemove({ _id: req.params.id })
      .then(async () => {
        /* await User.findOneAndUpdate({Activities:req.params.id},{ $pull: {Activities:req.params.id } })  */
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
  },

};

module.exports = controller;
