const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/youtubeRegistration")
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });
