import geminiModel from "../utils/geminiModel";

export default defineEventHandler(async (event) => {
  const model = geminiModel();
  const eventPayload = await readBody(event);

  if (
    eventPayload != null &&
    eventPayload.last_prompt_fired != null &&
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
    if (
      eventPayload.education_type &&
      (eventPayload.education_type == "News" ||
        eventPayload.education_type == "News with examples")
    ) {
      const chat = await chatModel.sendMessage(
        firstPromtNewsPromt(eventPayload)
      );
      return { chat: chat.response.text(), chatModel };
    } else {
      const chat = await chatModel.sendMessage(
        firstPromtLearningPromt(eventPayload)
      );
      return { chat: chat.response.text(), chatModel };
    }
  }
});

const firstPromtNewsPromt = (obj: {
  subject: string;
  education_type: string;
  tags: string;
  language: string;
}) => {
  return `

  You are a news host, and you are providing the latest information on ${
    obj.subject
  }.
  Your goal is to provide clear, concise, and informative responses.
  I want my information based on: ${obj.education_type}.
  Try to provide examples where appropriate.
  Don't ask questions, but provide answers.
  Talk like you are post on a feed.
  Please get your knowledge from this day on ${new Date().toDateString()} or the closest date you got your knowlegde from.
  Don't reply as you speak to a group of people, but as you speak to a single person.
  Only provide information, This is not a conversation.
  Don't repeat yourself.
  Only answer in this language: ${obj.language}.
  Can you respond with a short answer and only with one subject at a time, i will ask for more if needed.
  Tags to get more understanding on my subject: ${obj.tags}
  
`;
};

const firstPromtLearningPromt = (obj: {
  subject: string;
  education_type: string;
  tags: string;
  language: string;
}) => {
  return `
You are a knowledgeable and engaging teacher.
Your goal is to provide clear, concise,
and informative responses this subject ${obj.subject}.
I want my information based on: ${obj.education_type}.

Using examples and analogies where appropriate.
Try not to repeat yourself.
Don't ask questions, but provide answers.
Talk like you are post on a feed.

Please get your knowledge from this day on ${new Date().toDateString()} or the closest date you got your knowlegde from.
Don't reply as you speak to a group of people, but as you speak to a single person.
Only provide information, This is not a conversation.

Only answer in this language: ${obj.language}.

Can you respond with a short answer and only with one subject at a time, i will ask for more if needed.

Tags to get more understanding on my subject: ${obj.tags}
`;
};

const newFeedPromt = `
Give me more information on the subject we are talking about.
This is a clean answer based on the subject, language og tags I provided.
Don't repeat yourself.
Don't ask questions, but provide answers.
Try to work on different examples each time, and different perspectivse, so you don't repeat yourself to much.
You should answer like i didn't ask, but like you are a news stand / a blog writing an article to me. 
Can you boil down your answer to minimum output maybe within 3-4 sentences?`;
