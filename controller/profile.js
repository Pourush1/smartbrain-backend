const handleProfileGet = (req, res) => {
  const { id } = req.params;
  // let found = false;
  db.select("*")
    .from("users")
    .where({
      id: id
    })
    .then(user => {
      // console.log(user);
      if (user.length) {
        //checking whehter the user with id exist or not, since if we give wrong id it will response with an empty array which catch will not be able to catch
        res.json(user[0]);
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch(err => res.status(400).json("Not found"));
  // when we write this much, even if we request profile id thet is not there it won't send you an error but an empty array. So, we have to check with an empty arry to find error
  // if (!found) {
  //   res.status(400).send("No such user found");
  // }
};

module.exports = {
  handleProfileGet: handleProfileGet
};
