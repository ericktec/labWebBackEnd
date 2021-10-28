const db = require("../../Services/db");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const controller = {
  signUp: async (req, res) => {
    const { email, name, password, password2, adminCode } = req.body;
    if (adminCode !== process.env.ADMIN_SECRET) {
      return res.json({ "status": "Unauthorized" });
    }
    if (password !== password2) {
      return res.json({ "status": "Passwords not match" });
    }
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      const query = `INSERT INTO admins (email, name, password)
    VALUES (?,?,?)`;
      const rows = await db.query(query, [email, name, hash]);
      return res.json(rows);
    } catch (error) {
      res.json({
        "status": "error",
        error
      });
    }

  },

  logIn: async (req, res) => {
    console.log(req.cookie)
    console.log(req.user);
    return res.json({ status: "authorized", "logIn": req.user });
  },

  logOut: (req, res) => {
    req.logOut();
    return res.json({ status: "log out successfully" });
  },

  checkLogIn: (req, res) => {
    if (req.isAuthenticated()) {
      return res.json({ status: "loggedIn", user: req.user });
    }
    return res.json({ status: "unauthorized" });
  }
}

module.exports = controller;