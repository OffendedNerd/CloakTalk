const MessageModel = require("../models/messageModel");

const fetchAndSendMessages = async (req, res, next) => {
  try {
    const { sender, receiver } = req.body;

    const queriedMessages = await MessageModel.find({
      users: { $all: [sender, receiver] },
    }).sort({ updatedAt: 1 });

    const processedMessages = queriedMessages.map((message) => ({
      sentBySender: message.sender.toString() === sender,
      content: message.message.text,
    }));

    res.json({ result: processedMessages });
  } catch (err) {
    next(err);
  }
};

const saveNewMessage = async (req, res, next) => {
  try {
    const { sender, receiver, text } = req.body;

    const newMessage = await MessageModel.create({
      message: { text: text },
      users: [sender, receiver],
      sender: sender,
    });

    if (newMessage) {
      res.json({ success: true, message: "Message saved successfully." });
    } else {
      res.json({ success: false, message: "Failed to save the message in the database." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchAndSendMessages,
  saveNewMessage,
};
