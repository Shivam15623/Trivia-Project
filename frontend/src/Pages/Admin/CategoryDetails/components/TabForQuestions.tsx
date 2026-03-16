import React, { useState } from "react";
import { QuestionsByPoints, Question } from "@/interfaces/QuestionInterface";
import QuestionTable from "./QuestionListing";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const TabForQuestions = ({
  questionsData,
}: {
  questionsData: QuestionsByPoints;
}) => {
  const pointsList = [200, 400, 600];
  const [activeTab, setActiveTab] = useState<string>("all");

  // Flatten all questions
  const allQuestions: Question[] = pointsList.flatMap(
    (point) => questionsData[point as keyof QuestionsByPoints] || [],
  );

  const tabs = [
    {
      label: "All Questions",
      value: "all",
      content:
        allQuestions.length === 0 ? (
          <p className="text-muted-foreground">No questions available.</p>
        ) : (
          <QuestionTable questions={allQuestions} />
        ),
    },
    ...pointsList.map((point) => {
      const questions = questionsData[point as keyof QuestionsByPoints] || [];

      return {
        label: `${point} Points`,
        value: String(point),
        content:
          questions.length === 0 ? (
            <p className="text-muted-foreground">
              No questions for {point} points.
            </p>
          ) : (
            <QuestionTable questions={questions} />
          ),
      };
    }),
  ];

  const activeContent =
    tabs.find((tab) => tab.value === activeTab)?.content ?? null;

  return (
    <div className="mt-4 space-y-7">
      <h2 className="mb-6 text-[32px] font-semibold text-white">Questions</h2>

      <div className="flex flex-row justify-between">
        <div className="relative w-full max-w-[400px]">
          <Input
            type="text"
            placeholder="Search categories..."
            className="h-[44px] w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 pr-11 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
          />
          <Search className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-white/50" />
        </div>

        <div className="flex flex-row gap-[18px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "gradient-border h-[40px] shadow-[0px_0px_34px_0px_#F5FFE633] transition",
                  isActive && "bg-[#2985C8]",
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
                    "relative z-10 flex h-full items-center justify-center rounded-[20px] px-5 font-outfit text-[18px] font-normal text-white",
                    isActive && "bg-[#2985C8]",
                  )}
                >
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active tab content */}
      <div>{activeContent}</div>
    </div>
  );
};

export default TabForQuestions;
