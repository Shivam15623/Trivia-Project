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
});
export const StartGameSessionSchema = yup.object({
  mode: yup
    .string()
    .required("Mode is required")
    .oneOf(
      ["solo", "team", "timed_solo"],
      "Mode must be either solo , team , timed_solo",
    ),
  categoryIds: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^[0-9a-fA-F]{24}$/,
          "Each category must be a valid MongoDB ObjectId",
        ),
    )
    .required("Categories are required")
    .min(6, "You must provide exactly 6 categories")
    .max(6, "You must provide exactly 6 categories"),
  title: yup.string().required("Title is required"),
  teamAName: yup.string(),
  teamBName: yup.string(),
  teamAmembers: yup
    .number()
,
  teamBmembers: yup
    .number()
  ,
  socketId: yup.string().required("Socket ID is required"),
  hostTeam: yup
    .string()

});
