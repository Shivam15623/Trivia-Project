import RemoveQuestionDialog from "./QuestionDialog/Delete";
import ViewQuestion from "./QuestionDialog/View";
import { QuestionDialog } from "./QuestionDialog/Manage";
import { Question } from "@/interfaces/QuestionInterface";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/paggination";
import { useEffect } from "react";

import CustomTable from "@/components/CustomTable";

type Props = {
  questions: Question[];
};
const columns = [
  {
    name: "Question",
    cell: (q: Question) => (
      <p className="max-w-[600px] text-wrap font-medium">{q.questionText}</p>
    ),
  },
  {
    name: "Options",
    cell: (q: Question) => (
      <ul className="ml-4 flex list-disc flex-col gap-2">
        {q.options?.map((opt, idx) => (
          <li
            key={idx}
            className={
              "font-inter text-sm font-normal leading-[100%] text-white"
            }
          >
            {opt}
          </li>
        ))}
      </ul>
    ),
  },
  {
    name: "Answer",

    cell: (q: Question) => (
      <div className="relative max-w-fit overflow-hidden rounded-full px-[18px] py-3 font-medium text-white">
        <span className="relative z-10 text-sm"> {q.answer}</span>

        <div className="absolute inset-0 rounded-full border border-white/30 bg-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl" />

        {/* Light reflection */}
        {/* <div className="absolute -top-5 left-[-20%] h-20 w-40 rotate-[-45deg] bg-white/20 blur-xl" /> */}
      </div>
    ),
  },
  {
    name: "Actions",
    cell: (q: Question) => (
      <div className="flex flex-row gap-3">
        <RemoveQuestionDialog
          questionId={q._id}
          questionName={q.questionText}
        />
        <ViewQuestion questionId={q._id} />
        <QuestionDialog
          id={q._id}
          trigger={
            <Button className="text-white" variant={"link"}>
              <Edit className="h-6 w-6" />
            </Button>
          }
        />
      </div>
    ),
  },
];

const QuestionTable = ({ questions }: Props) => {
  const filtered = questions;
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedquestions,
    setPage,
  } = usePagination(filtered || [], 20);

  useEffect(() => {
    setPage(1);
  }, [filtered?.length]);

  if (filtered.length === 0) {
    return <p className="text-muted-foreground">No questions to display.</p>;
  }

  return (
    <div>
      <CustomTable data={paginatedquestions} columns={columns} />
      <div className="mt-4 p-3">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default QuestionTable;
