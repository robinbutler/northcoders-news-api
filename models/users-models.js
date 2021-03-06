const query = require("../db/connection");

const fetchUser = account => {
  return query
    .select("*")
    .from("users")
    .where({ username: `${account}` })
    .then(user => {
      if (user.length === 0)
        return Promise.reject({ status: 404, msg: "User not found" });
      return user[0];
    });
};

const addUser = user => {
  return query("topics")
    .insert(user)
    .returning("*")
    .then(user => {
      return user[0];
    });
};
module.exports = { fetchUser, addUser };
