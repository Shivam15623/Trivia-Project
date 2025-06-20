import { Badge } from "@/components/ui/badge";
import RemoveQuestionDialog from "./QuestionDialog/Delete";
import ViewQuestion from "./QuestionDialog/View";
import { QuestionDialog } from "./QuestionDialog/Manage";
import { Question } from "@/interfaces/QuestionInterface";
import { Button } from "@/components/ui/button";
import { Edit, Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/paggination";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import CustomTable from "@/components/CustomTable";

type Props = {
  questions: Question[];
  enableSearch?: boolean;
};
const columns = [
  {
    name: "Question",
    cell: (q: Question) => (
      <span className="font-medium text-gray-900">{q.questionText}</span>
    ),
  },
  {
    name: "Options",
    cell: (q: Question) => (
      <ul className="list-disc ml-4">
        {q.options?.map((opt, idx) => (
          <li
            key={idx}
            className={opt === q.answer ? "text-[#ff8c42] font-medium" : ""}
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
      <Badge
        variant="outline"
        className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#fff0e5] text-[#ff8c42] border border-[#ff8c42]/20"
      >
        {q.answer}
      </Badge>
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
            <Button
              variant={"ghost"}
              className="p-1.5 rounded-md text-[#ff8c42] hover:bg-[#ff8c42]/10 transition-colors"
            >
              <Edit />
            </Button>
          }
        />
      </div>
    ),
  },
];

const QuestionTable = ({ questions, enableSearch }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = enableSearch
    ? questions.filter((q) =>
        q.questionText.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : questions;
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedquestions,
    setPage,
  } = usePagination(filtered ||[], 3);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filtered?.length]);

  if (filtered.length === 0) {
    return (
      <p className="text-muted-foreground">
        {enableSearch && searchTerm
          ? "No matching questions found."
          : "No questions to display."}
      </p>
    );
  }

  return (
    <div>
      {enableSearch && (
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#ff8c42]/60" />
          </div>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions by text..."
            className="w-full pl-10 pr-4 py-2 border border-[#fff0e5] rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8c42]/30 focus-visible:border-[#ff8c42] transition-colors"
          />
        </div>
      )}
      <CustomTable data={paginatedquestions} columns={columns} />
      <div className="p-3 mt-4">
        <Pagination variant="default"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default QuestionTable;
