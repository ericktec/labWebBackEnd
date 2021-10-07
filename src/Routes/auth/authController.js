const db = require("../../Services/db");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const controller = {
  signUp: async (req, res) => {
    const { email, name, password, password2 } = req.body;
    if (password !== password2) {
      return res.json({ "status": "Passwords not match" });
    }
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      const query = `INSERT INTO admins (email, name, password)
    VALUES (?,?,?)`
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
    const { email, password } = req.body;
    const query = `SELECT password from admins where email = ?`;
    const [user] = await db.query(query, [email]);

    const isLogIn = await bcrypt.compare(password, user.password);
    return res.json({ "logIn": isLogIn });
  }
}

module.exports = controller;