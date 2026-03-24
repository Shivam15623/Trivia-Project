import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function GradientChevron({
  size = 20,
  strokeWidth = 2,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <linearGradient id="chevronGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="61.54%" stopColor="#2884C7" />
          <stop offset="38.94%" stopColor="#7BFDFD" />
        </linearGradient>
      </defs>
      <path
        d="M6 9l6 6 6-6"
        stroke="url(#chevronGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQItem({
  value,
  question,
  answer,
}: {
  value: string;
  question: string;
  answer: string;
}) {
  return (
    <AccordionItem
      value={value}
      className="ease-[cubic-bezier(0.4,0,0.2,1)] before:ease-[cubic-bezier(0.4,0,0.2,1)] group relative rounded-[20px] border-b-0 bg-transparent transition-all duration-500 before:absolute before:left-0 before:top-0 before:h-[4px] before:w-full before:bg-gradient-to-r before:from-[#2884C7] before:to-[#7BFDFD] before:transition-all before:duration-500 first:before:hidden data-[state=open]:bg-gradient-to-b data-[state=open]:from-[#7BFDFD] data-[state=open]:to-[#2884C7] data-[state=open]:p-[3px] data-[state=open]:pb-[6px] data-[state=open]:before:opacity-0 [[data-state=open]+&]:before:opacity-0"
    >
      <div className="rounded-[17px] bg-black">
        <div className="ease-[cubic-bezier(0.4,0,0.2,1)] rounded-[17px] bg-black px-5 transition-all duration-500 group-data-[state=open]:bg-white/10">
          <AccordionTrigger className="flex items-center justify-between py-5 text-left text-lg font-bold leading-[150%] text-white hover:no-underline [&>svg]:hidden">
            <div className="flex items-center max-w-fit justify-center">
              <span className="leading-[100%]">{question}</span>
            </div>

            <span className="ease-[cubic-bezier(0.4,0,0.2,1)] transition-transform duration-500 group-data-[state=open]:rotate-180">
              <GradientChevron size={32} strokeWidth={1.33} />
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-[16px] font-normal leading-[150%] text-white/80 sm:text-lg">
            {answer}
          </AccordionContent>
        </div>
      </div>
    </AccordionItem>
  );
}

export default function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <FAQItem
        value="item-1"
        question="How do I start a duel?"
        answer="Select Live Duels from the main menu, choose an opponent or let the system match you with someone at your level, and play in real time. Results are instant."
      />
      <FAQItem
        value="item-2"
        question="Is Trivvy free?"
        answer="Yes, Trivvy is free to play with optional premium features."
      />
      <FAQItem
        value="item-3"
        question="How are rankings calculated?"
        answer="Rankings are based on wins, difficulty, and opponent skill level."
      />
      <FAQItem
        value="item-4"
        question="Do I need an account?"
        answer="You can play as a guest, but an account is required for rankings."
      />
    </Accordion>
  );
}
