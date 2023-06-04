const express = require("express");
const WhatsappClient = require("./Whatsapp");
const qrcode = require("qrcode-terminal");
const app = express();
const port = 3000;
let whatsappBot = {};

// body is needed to parse the request body
app.use(express.json());

app.post("/api/send-message", async (req, res) => {
  try {
    const { groupId, message } = req.body;
    const group = await whatsappBot.client.getChatById(groupId);
    // TODO: here is where we should add the logic to send the message to the group by using CHAT GPT API
    group.sendMessage(message + new Date().toString());
    res.json({ status: "ok", message: "Message sent" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});
app.get("/api/healthcheck", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/getAllChats", async (req, res) => {
  const chats = await whatsappBot.client.getChats();
  let groups = chats.filter((chat) => chat.isGroup);

  res.json(groups);
});

const { client } = new WhatsappClient("whatsappBot");

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  whatsappBot = {
    client,
  };
});
client.initialize();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
