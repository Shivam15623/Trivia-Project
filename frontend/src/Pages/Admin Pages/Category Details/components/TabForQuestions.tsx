import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuestionsByPoints } from "@/interfaces/QuestionInterface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // Assuming you are using ShadCN UI's Badge
import ViewQuestion from "./QuestionDialog/ViewQuestion";
import RemoveQuestionDialog from "./QuestionDialog/DeleteQuestion";
import { QuestionDialog } from "./QuestionDialog/QuestionDialog";



const TabForQuestions = ({
  questionsData,
}: {
  questionsData: QuestionsByPoints;
}) => {
  const pointsList = [200, 400, 600];

  return (
    <Tabs defaultValue="200" className="w-full  mx-auto">
      <TabsList className="mb-4 flex space-x-4">
        {pointsList.map((point) => (
          <TabsTrigger key={point} value={String(point)}>
            {point} Points
          </TabsTrigger>
        ))}
      </TabsList>

      {pointsList.map((point: number) => {
        const questions = questionsData[point as keyof QuestionsByPoints] || [];

        return (
          <TabsContent key={point} value={String(point)}>
            {questions.length === 0 ? (
              <p className="text-muted-foreground">
                No questions for {point} points.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q) => (
                    <TableRow key={q._id}>
                      <TableCell>{q.questionText}</TableCell>
                      <TableCell>
                        <ul className="list-disc ml-4">
                          {q.options?.map((opt, idx) => (
                            <li
                              key={idx}
                              className={
                                opt === q.answer
                                  ? "text-green-600 font-medium"
                                  : ""
                              }
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{q.answer}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row gap-3">
                          <RemoveQuestionDialog
                            questionId={q._id}
                            questionName={q.questionText}
                          />

                          <ViewQuestion questionId={q._id} />

                          <QuestionDialog id={q._id} triggerLabel="" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default TabForQuestions;
