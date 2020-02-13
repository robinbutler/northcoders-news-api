const fs = require("fs");
const axios = require("axios");

const fetchEndpoints = () => {
  const endpoints = require("../endpoints.json");
  return endpoints;
};

module.exports = fetchEndpoints;
