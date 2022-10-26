const User = require("../Models/user");
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generatePassword, verifyPass } = require("../utils/apiUtils");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MESSAGE_EMAIL,
    pass: process.env.PASS_EMAIL, /// 2 step verification account, Generate another passWord
  },
});

const savePassword = async ({ user, newPassword, res }) => {
  const email = user.email;
  let mailOptions = {
    from: process.env.MESSAGE_EMAIL,
    to: email,
    subject: `Password restore from A-Project`,
    text: `New password generated ${newPassword}`,
  };

  await transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      return res.status(302).json({ msg: "Something went wrong" });
    } else {
      const passwordHash = await bCrypt.hash(newPassword, 10);
      await User.findOneAndUpdate(
        { email },
        {
          password: passwordHash,
        }
      );
      return res.status(200).json({ msg: "Email Sent" });
    }
  });
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "11m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
/////////////////////////////////////////////////////////////////////////////// Controllers ///////////////////////////////////

const controller = {
  register: async (req, res, next) => {
    const { name, email, lastName, password, occupation, repeatPassword, currentManager, currentTechLead, currentClient} =
      req.body;

    if (!email)
      return res.status(401).json({ msg: "You forgot write your email" });

    if (password != repeatPassword)
      return res.status(401).json({ msg: "Passwords do not match" });

    const user = await User.findOne({ email });
    if (user) return res.status(401).json({ msg: "Email already exist" });

    if (!verifyPass(password))
      return res.status(401).json({
        msg: "Create a password with numbers, using one of these symbols , ? ! : ; . @ # % and capital letters one o more letters",
      });
    const passwordHash = await bCrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      lastName,
      occupation,
      currentManager,
      currentTechLead,
      currentClient
    });
  
    await newUser
      .save()
      .then((result) => {
        const accessToken = createAccessToken({
          id: newUser._id,
          email: newUser.email,
          role: 'Collaborator',
        });
        const refreshToken = createRefreshToken({
          id: newUser._id,
          email: newUser.email,
          role: 'Collaborator',
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          path: "/api/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        });
        res.json({ accessToken });
      })
      .catch((err) => {
        return next(err);
      });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ msg: "User does not exist." });

    const isMatch = await bCrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ msg: "Incorrect Email or Password." });

    const accessToken = createAccessToken({ id: user._id, email: user.email, role: user.role });
    const refreshToken = createRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
    res.json({ accessToken });
  },

  logout: async (req, res) => {
    res.clearCookie("refreshToken", { path: "/api/refresh_token" });
    return res.json({ msg: "Logged out" });
  },

  refreshToken: async (req, res, next) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(401).json({ msg: "Please Login or Register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({ msg: "Session expired" });

        const accessToken = createAccessToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });
        res.json({ accessToken });
      });
    } catch (err) {
      return res.status(302).json({ msg: "Please Login or Register" });
    }
  },

  getInfo: async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(400).json({ msg: "Error to get user." });
    res.json(user);
  },

  getRole: async (req, res, next) => {
    const user = await User.findById(req.user.id).select("role");
    if (!user) return res.status(400).json({ msg: "Error to get role." });
    res.json(user);
  },

  restorePassword: async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("email -_id");
    if (!user) return res.status(400).json({ msg: "Email does not exist." });

    if(user.role === 'private') return res.status(400).json({ msg: "your email is private and you can not access" });

    const newPassword = generatePassword();
    savePassword({ user, newPassword, res });
  },
};

module.exports = controller;
