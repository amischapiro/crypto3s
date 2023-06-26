const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Location = mongoose.model("locations", locationSchema);

module.exports = Location;
