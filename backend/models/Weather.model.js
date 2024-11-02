const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: {
    name: String,
    region: String,
    country: String,
    lat: Number,
    lon: Number,
    tz_id: String,
    localtime_epoch: Number,
    localtime: String,
  },
  current: {
    last_updated: String,
    temp_f: Number,
    is_day: Number,
    condition: {
      text: String,
      icon: String,
      code: Number,
    },
    wind_mph: Number,
    wind_dir: String,
    precip_in: Number,
    humidity: Number,
    cloud: Number,
    feelslike_f: Number,
    windchill_f: Number,
    dewpoint_f: Number,
    vis_miles: Number,
    uv: Number,
    gust_mph: Number,
  },
});

module.exports = mongoose.model('Weather', weatherSchema);
