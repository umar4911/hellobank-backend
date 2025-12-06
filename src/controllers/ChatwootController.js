const axios = require("axios");
const Logger = require("../utils/Logger");
const { Chatwoot, environment, Groq } = require("../../config");

const GroqSDK = require("groq-sdk");
const groq = new GroqSDK({ apiKey: Groq.apiKey });

const logger = new Logger();
async function generateAiReply(messageContent, conversation) {
  try {
    const convMeta = conversation?.meta || {};
    const userId =
      convMeta?.identifier || conversation?.contact_inbox?.contact_id;

    const prompt = `
You are HelloBank's virtual assistant. 
You MUST follow these rules:
- Be concise, friendly, and clear.
- NEVER ask for full card number, full CVV, or full password.
- If user mentions balances, transactions, account limits, or anything that requires real bank data, say you cannot access sensitive data and they must use the HelloBank app or secure support.
- If you're not sure, say so and suggest contacting human support.
User message:
"${messageContent}"
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // or another Groq model you prefer
      messages: [
        {
          role: "system",
          content:
            "You are a banking customer support assistant for HelloBank.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();
    return reply || "I'm not sure I fully understood that, could you rephrase?";
  } catch (err) {
    logger.error("Groq error: " + err.message + "\n" + err.stack);
    return "Sorry, I'm having trouble responding right now. Please try again later or contact human support.";
  }
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
