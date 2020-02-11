const query = require("../db/connection");

const fetchUser = account => {
  return query
    .select("username", "name", "avatar_url")
    .from("users")
    .where({ username: `${account}` })
    .then(user => {
      if (user.length === 0)
        return Promise.reject({ status: 404, msg: "User not found" });
      return user[0];
    });
};

module.exports = fetchUser;
