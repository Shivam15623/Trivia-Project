import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import RemoveQuestionDialog from "./QuestionDialog/DeleteQuestion";
import ViewQuestion from "./QuestionDialog/ViewQuestion";
import { QuestionDialog } from "./QuestionDialog/QuestionDialog";
import { Question } from "@/interfaces/QuestionInterface";

type Props = {
  questions: Question[];
};
const QuestionTable = ({questions}:Props) => {
  return (
    <Table>
      <TableHeader className="bg-gray-50 border-b border-gray-200">
        <TableRow>
          <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
            Question
          </TableHead>
          <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
            Options
          </TableHead>
          <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
            Answer
          </TableHead>
          <TableHead className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((q) => (
          <TableRow key={q._id} className="hover:bg-gray-50">
            <TableCell className="px-4 py-3 text-sm text-gray-900 font-medium">
              {q.questionText}
            </TableCell>
            <TableCell className="px-4 py-3 text-sm text-gray-900 font-medium">
              <ul className="list-disc ml-4">
                {q.options?.map((opt, idx) => (
                  <li
                    key={idx}
                    className={
                      opt === q.answer ? "text-green-600 font-medium" : ""
                    }
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </TableCell>
            <TableCell className="px-4 py-3 text-sm text-gray-900 font-medium">
              <Badge variant="outline">{q.answer}</Badge>
            </TableCell>
            <TableCell className="px-4 py-3 text-sm text-gray-900 font-medium">
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
  );
};

export default QuestionTable;
