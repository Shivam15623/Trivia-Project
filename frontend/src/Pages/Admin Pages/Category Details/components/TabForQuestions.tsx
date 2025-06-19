import { QuestionsByPoints, Question } from "@/interfaces/QuestionInterface";
import TabsWrapper from "@/components/TabsWrapper";
import QuestionTable from "./QuestionTable";

const TabForQuestions = ({
  questionsData,
}: {
  questionsData: QuestionsByPoints;
}) => {
  const pointsList = [200, 400, 600];

  // Flatten all questions
  const allQuestions: Question[] = pointsList.flatMap(
    (point) => questionsData[point as keyof QuestionsByPoints] || []
  );

  const tabs = [
    {
      label: "All Questions",
      value: "all",
      content:
        allQuestions.length === 0 ? (
          <p className="text-muted-foreground">No questions available.</p>
        ) : (
          <QuestionTable questions={allQuestions} enableSearch />
        ),
    },
    ...pointsList.map((point) => {
      const questions = questionsData[point as keyof QuestionsByPoints] || [];

      const content =
        questions.length === 0 ? (
          <p className="text-muted-foreground">
            No questions for {point} points.
          </p>
        ) : (
          <QuestionTable questions={questions} />
        );

      return {
        label: `${point} Points`,
        value: String(point),
        content,
      };
    }),
  ];

  return (
    <div className="mt-4 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Questions</h2>
      <TabsWrapper defaultValue="all" tabs={tabs} variant="default" size="md" />
    </div>
  );
};

export default TabForQuestions;
