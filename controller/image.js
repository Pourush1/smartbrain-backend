const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "f52c3fbe9c8c4016a4d04caf9bcd95c7"
});

const handleImageUrl = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("Unable to call the API"));
};

const handleImage = (req, res, db) => {
  // we need to find the id to update the entries
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1) //how can we grab the entries i.e currently in the database and then update it, soln => we can simply use function called increment in knex
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unale to get count"));
};

module.exports = {
  handleImageUrl: handleImageUrl,
  handleImage: handleImage
};
