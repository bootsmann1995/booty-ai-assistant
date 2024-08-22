import geminiModel from "../utils/geminiModel";

export default defineEventHandler(async (event) => {
  const model = geminiModel();
  const eventPayload = await readBody(event);
  if (eventPayload.chatModel != null) {
    const chatModel = model.startChat({
      history: eventPayload.chatModel._history,
    });
    console.log(chatModel);
    const chat = await chatModel.sendMessage(newFeedPromt);
    console.log(chat);
    return { chat, chatModel };
  } else {
    const chatModel = model.startChat({});
    const chat = await chatModel.sendMessage(firstPromt(eventPayload));
    return { chat, chatModel };
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

const newFeedPromt = `Can you provide me with more knowledge on this topic based on the Subject, based on the type of education i chose, and taken the tags i provided in consideration?`;
