import { useEffect } from "react";
import {
  currentQuestionData,
  CurrentQuestionResponse,
} from "@/interfaces/GameSessionInterface";

export const useSyncQuestionData = (
  questionSuccess: boolean,
  currentQuestionDataFromAPI: CurrentQuestionResponse | undefined,
  setQuestionData: (data: currentQuestionData | undefined) => void
) => {
  useEffect(() => {
    if (questionSuccess && currentQuestionDataFromAPI?.data) {
      setQuestionData(currentQuestionDataFromAPI.data);
    } else if (!currentQuestionDataFromAPI?.data) {
      setQuestionData(undefined);
    }
  }, [questionSuccess, currentQuestionDataFromAPI, setQuestionData]);
};
