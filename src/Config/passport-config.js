const LocalStrategy = require("passport-local").Strategy;
const db = require("../Services/db");
const bcrypt = require('bcrypt');


async function authenticate(email, password, done) {
  const query = `SELECT id, password, name from admins where email = ?`;
  const [user] = await db.query(query, [email]);
  if (!user?.id) {
    return done(null, false, { message: "Wrong user or password" });
  }
  try {
    const isLogIn = await bcrypt.compare(password, user.password);
    if (isLogIn) {
      return done(null, { id: user.id, name: user.name })
    }
    else {
      return done(null, false, { message: "Wrong user or password" })
    }
  } catch (error) {
    done(e);
  }

}

function initializePassport(passport) {
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticate));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    const query = `SELECT id, name from admins where id = ?`;
    const [user] = await db.query(query, [id]);
    console.log(user);
    done(null, user);
  });
}



module.exports = initializePassport