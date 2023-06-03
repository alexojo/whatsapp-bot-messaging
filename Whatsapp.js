/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
const { Client, LocalAuth } = require("whatsapp-web.js");

class WhatsappClient {
  constructor(id) {
    this.client = new Client({
      restartOnAuthFail: true,
      puppeteer: {
        headless: false,
        args: [
          "--no-sandbox",
          "--disable-dev-shm-usage", // <-- add this one.
        ],
      },
      authStrategy: new LocalAuth({
        clientId: id,
      }),
      takeoverOnConflict: true,
    });
  }

  initialize() {
    this.client.initialize();
  }

  on(event, callback) {
    this.client.on(event, callback);
  }
  // Add other methods that you need for your application
}

module.exports = WhatsappClient;
