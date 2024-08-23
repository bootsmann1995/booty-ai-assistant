import geminiModel from "../utils/geminiModel";

export default defineEventHandler(async (event) => {
  const model = geminiModel();
  const eventPayload = await readBody(event);

  if (
    eventPayload != null &&
    eventPayload.last_prompt_fired != null &&
    !isYesterdayOrOlder(eventPayload.last_prompt_fired) &&
    eventPayload.chatModel != null
  ) {
    const lastChat =
      eventPayload.chatModel._history &&
      eventPayload.chatModel._history.length != null
        ? eventPayload.chatModel._history
        : null;
    let text = "";
    if (
      lastChat[lastChat.length - 1] &&
      lastChat[lastChat.length - 1].parts &&
      lastChat[lastChat.length - 1].parts[0] &&
      lastChat[lastChat.length - 1].parts[0].text
    ) {
      text = lastChat[lastChat.length - 1].parts[0].text;
    }
    return {
      chat: text,
      chatModel: eventPayload.chatModel,
      cancelUpdateDate: true,
    };
  }
  if (eventPayload.chatModel != null) {
    const chatModel = model.startChat({
      history: eventPayload.chatModel._history,
    });
    const chat = await chatModel.sendMessage(newFeedPromt);
    return { chat: chat.response.text(), chatModel };
  } else {
    const chatModel = model.startChat({});
    const chat = await chatModel.sendMessage(firstPromt(eventPayload));
    return { chat: chat.response.text(), chatModel };
  }
});

const firstPromt = (obj: {
  subject: string;
  education_type: string;
  tags: string;
}) => {
  return `
You are a knowledgeable and engaging teacher. 
Your goal is to provide clear, concise, 
and informative responses to the user's queries on the given subject.

Please respond in a conversational tone, 
using examples and analogies where appropriate. 
Remember to tailor your responses to the user's level of understanding and interests.

Subject: ${obj.subject}
Type: ${obj.education_type}
Tags: ${obj.tags}
`;
};

const newFeedPromt = `Can you provide me with more knowledge on this topic based on the Subject, based on the type of education i chose, and taken the tags i provided in consideration? answer like i didn't ask, but like you are a news stand / a blog writing an article to me.`;

const isYesterdayOrOlder = (date: Date) => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  return date <= yesterday;
};
