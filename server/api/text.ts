import geminiModel from "../utils/geminiModel";

export default defineEventHandler(async (event) => {
  const model = geminiModel();
  const eventPayload = await readBody(event);

  if (
    eventPayload != null &&
    eventPayload.last_prompt_fired != null &&
    eventPayload.chatModel != null &&
    isDateWithinTwoHours(new Date(eventPayload.last_prompt_fired))
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

  console.log(eventPayload);

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
  language: string;
}) => {
  return `
You are a knowledgeable and engaging teacher.
Your goal is to provide clear, concise,
and informative responses to the user's queries on the given subject.

Please respond in a conversational tone,
using examples and analogies where appropriate.
Try not to repeat yourself.
If you ask a question, try to answer it yourself as well.
The way you respond should be engaging and informative and talk like your a blog post not talking to a person.
Remember to tailor your responses to the user's level of understanding and interests.
Please get your knowledge from this day on ${new Date().toDateString()}.

Don't reply as you speak to a group of people, but as you speak to a single person.

Please reply like i can't reply back to you, only provide information, This is not a conversation.

And keep the conversation within the language provided under here. Even if i reply in a different language, you should always reply in the language provided here.
The tags provided down under is just to give you a hint on what i'm interested in, you don't have to use them in your response only to focus your information around these.


Subject: ${obj.subject}
Type: ${obj.education_type}
Tags: ${obj.tags}
Language: ${obj.language}
`;
};

const newFeedPromt = `Can you provide me with more knowledge on this topic based on the Subject, based on the type of education i chose, and taken the tags i provided in consideration? answer like i didn't ask, but like you are a news stand / a blog writing an article to me.`;

const isYesterdayOrOlder = (date: Date) => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setHours(now.getDate() - 1);
  return date <= yesterday;
};

function isDateWithinTwoHours(date: Date) {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  return date >= twoHoursAgo;
}

function isDateWithinTwoMinutes(date: Date) {
  const now = new Date();
  const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
  return date >= twoMinutesAgo;
}
