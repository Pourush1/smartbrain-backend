const handleSignIn = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json("Wrong credentials");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      // console.log(isValid);
      if (isValid) {
        return db
          .select("*") //we have to always make sure we are returning
          .from("users")
          .where("email", "=", email)
          .then(user => {
            //  console.log(user);
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("Unable to get user"));
      } else {
        res.status(400).json("Wrong credentials");
      }
    })
    .catch(err => res.status(400).json("Wrong credentials."));
};

module.exports = {
  handleSignIn: handleSignIn
};
