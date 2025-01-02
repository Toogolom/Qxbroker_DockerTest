const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: "http://localhost",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
