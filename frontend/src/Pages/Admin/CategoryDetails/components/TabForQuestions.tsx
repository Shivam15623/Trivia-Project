import React, { useState, useMemo } from "react";
import { QuestionsByPoints, Question } from "@/interfaces/QuestionInterface";
import QuestionTable from "./QuestionListing";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const POINTS_LIST = [200, 400, 600] as const;
type PointsKey = (typeof POINTS_LIST)[number];

const TABS = [
  { label: "All Questions", value: "all" },
  ...POINTS_LIST.map((p) => ({ label: `${p} Points`, value: String(p) })),
];

const TabForQuestions = ({
  questionsData,
}: {
  questionsData: QuestionsByPoints;
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const allQuestions = useMemo<Question[]>(
    () => POINTS_LIST.flatMap((p) => questionsData[p as PointsKey] ?? []),
    [questionsData],
  );

  const filteredQuestions = useMemo(() => {
    const byTab: Record<string, Question[]> = {
      all: allQuestions,
      ...Object.fromEntries(
        POINTS_LIST.map((p) => [
          String(p),
          questionsData[p as PointsKey] ?? [],
        ]),
      ),
    };

    const base = byTab[activeTab] ?? [];
    if (!search.trim()) return base;

    const q = search.toLowerCase();
    return base.filter(
      (question) =>
        question.questionText?.toLowerCase().includes(q) ||
        question.answer?.toLowerCase().includes(q),
    );
  }, [activeTab, search, allQuestions, questionsData]);

  return (
    <div className="mt-4 space-y-7">
      <h2 className="mb-6 text-[32px] font-semibold text-white">Questions</h2>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full max-w-[400px]">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="h-[44px] w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 pr-11 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-white/50" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <TabButton
                key={tab.value}
                label={tab.label}
                isActive={isActive}
                onClick={() => setActiveTab(tab.value)}
              />
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>
        {filteredQuestions.length === 0 ? (
          <p className="text-white/60">
            {search ? `No results for "${search}".` : "No questions available."}
          </p>
        ) : (
          <QuestionTable questions={filteredQuestions} />
        )}
      </div>
    </div>
  );
};

// Extracted to avoid inline style repetition
const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "gradient-border h-[40px] shadow-[0px_0px_34px_0px_#F5FFE633] transition",
    )}
    style={
      {
        "--border-gradient":
          "linear-gradient(93.58deg, #67C3FF 8.55%, #010A2A 47.56%, #67C3FF 94.76%)",
        "--radius": "20px",
        "--padding": "1px",
      } as React.CSSProperties
    }
  >
    <div
      className={cn(
        "relative z-10 flex h-full items-center justify-center rounded-[20px] px-5 font-outfit text-[18px] font-normal text-white transition",
        isActive ? "bg-[#2985C8]" : "bg-transparent hover:bg-white/10",
      )}
    >
      {label}
    </div>
  </button>
);

export default TabForQuestions;
