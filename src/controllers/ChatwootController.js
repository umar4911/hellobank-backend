const axios = require("axios");
const Logger = require("../utils/Logger");
const { Chatwoot, environment } = require("../../config");

const logger = new Logger();

async function generateAiReply(messageContent, conversation) {
  return `You said: "${messageContent}". Our AI assistant will help you soon.`;
}

async function sendChatwootMessage({ conversationId, content }) {
  const url = `${Chatwoot.baseUrl}/api/v1/accounts/${Chatwoot.accountId}/conversations/${conversationId}/messages`;

  await axios.post(
    url,
    {
      content,
      message_type: "outgoing",
      private: false,
    },
    {
      headers: {
        "Content-Type": "application/json",
        api_access_token: Chatwoot.botToken,
      },
    },
  );
}

module.exports = {
  HandleWebhook: async (req, res) => {
    try {
      const payload = req.body;

      if (payload.event !== "message_created") {
        return res.sendStatus(200);
      }

      const message = payload.data?.message || payload.message || payload;
      const conversation =
        payload.data?.conversation || payload.conversation || {};

      if (message.message_type !== "incoming") {
        return res.sendStatus(200);
      }

      const conversationId = conversation.id;
      const content = message.content;

      if (!conversationId || !content) {
        return res.sendStatus(200);
      }

      const reply = await generateAiReply(content, conversation);

      await sendChatwootMessage({
        conversationId,
        content: reply,
      });

      return res.sendStatus(200);
    } catch (e) {
      logger.error(e.message + "\n" + e.stack);
      if (environment === "prod") {
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    }
  },
};
