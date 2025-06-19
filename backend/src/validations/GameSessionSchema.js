import * as yup from "yup";
export const JoinGameSessionSchema = yup.object({
  sessionCode: yup.string().required("Session code is required"),
  teamName: yup.string().required("Team name is required"),
  socketId: yup.string().required("Socket ID is required"),
});

export const FiftyFiftyAidSchema = yup.object({
  gameSessionId: yup.string().required("Game session ID is required"),
  teamIndex: yup
    .number()
    .required("Team index is required")
    .min(0, "Team index must be 0 or 1"),
  questionId: yup.string().required("Question ID is required"),
});

export const SubmitAnswerSchema = yup.object({
  sessionId: yup.string().required("Session ID is required"),
  questionId: yup.string().required("Question ID is required"),
  answer: yup.string().required("Answer is required"),
  aid: yup
    .string()
    .oneOf(["Deduct", "twicePoint", "None"], "Invalid aid type")
    .required("Aid type is required"),
});
export const StartGameSessionSchema = yup.object({
  gameId: yup.string().required("Game ID is required"),
  teamAName: yup.string().required("Team A name is required"),
  teamBName: yup.string().required("Team B name is required"),
  teamAmembers: yup
    .number()
    .required("Team A members count is required")
    .min(1, "Team A must have at least one member"),
  teamBmembers: yup
    .number()
    .required("Team B members count is required")
    .min(1, "Team B must have at least one member"),
  socketId: yup.string().required("Socket ID is required"),
  hostTeam: yup
    .string()
    .required("Host team is required")
    .oneOf(["A", "B"], "Host team must be either teamA or teamB"),
});
