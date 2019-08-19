const handleRegister = (req, res, db, bcrypt) => {
  // Destructuring
  const { email, name, password } = req.body;
  // hashing the password asynchronous way
  // bcrypt.hash(password, null, null, function(err, hash) {
  //   // Store hash in your password DB.
  //   console.log(hash);
  // });

  // Doing backend side validation here
  if (!email || !name || !password) {
    res.status(400).json("incorrect form submission");
  }

  const hash = bcrypt.hashSync(password);
  // I am doing TRANSACTION here
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      // we are doing one transactin where we first inset email and password into login table and then insert all the values into the users table. 1 transaction
      .into("login")
      .returning("email")
      .then(loginEmail => {
        //  console.log("loginEmail", loginEmail);
        return trx("users")
          .returning("*") //knex gave this to return
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit) //this is done to add it to the database , commit to the database if everything above passes
      .catch(trx.rollback); //rollback if everything above does not pass
  }).catch(err => res.status(400).json("Unable to register"));
}; //we can do console.log to see what is sent back

module.exports = {
  handleRegister: handleRegister
};
