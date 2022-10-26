const User = require("../Models/user");

const controller = {
  getInfoCollaborator: async (req, res, next) => {
   
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(400).json({ msg: "Error to get user." });
    res.json(user);
  },
  
};

module.exports = controller;
