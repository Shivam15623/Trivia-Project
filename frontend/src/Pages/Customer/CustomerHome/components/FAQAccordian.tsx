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
      className="
    group
    relative
    border-b-0
    rounded-[20px]
    p-[3px]
    bg-transparent
    transition-all
    duration-300

    data-[state=open]:bg-gradient-to-b
    data-[state=open]:from-[#7BFDFD]
    data-[state=open]:to-[#2884C7]

    /* Gradient divider */
    after:absolute
    after:left-0
    after:bottom-0
    after:h-[4px]
    after:w-full
    after:bg-gradient-to-r
    after:from-[#2884C7]
    after:to-[#7BFDFD]

    /* hide divider when open */
    data-[state=open]:after:opacity-0

    /* hide divider for last item */
    last:after:hidden
  "
    >
      {/* Inner container */}
      <div
        className="
        rounded-[17px]
          bg-black
        "
      >
        <div
          className=" bg-black rounded-[17px] px-5 transition-all
          duration-300  group-data-[state=open]:bg-white/10"
        >
          <AccordionTrigger
            className="
            py-5
            flex
            items-center
            justify-between
            text-left
            text-white
            text-lg
            leading-[150%]
            font-bold
            hover:no-underline
            [&>svg]:hidden
          "
          >
            <span>{question}</span>
            <span
              className="
              transition-transform
              duration-300
              group-data-[state=open]:rotate-180
            "
            >
              <GradientChevron size={32} strokeWidth={1.33} />
            </span>
          </AccordionTrigger>

          {/* Content */}
          <AccordionContent
            className="
            pb-6
            text-white/80
            text-[16px]
            sm:text-lg
            leading-[150%]
            font-normal
          "
          >
            {answer}
          </AccordionContent>
        </div>
        {/* Trigger */}
      </div>
    </AccordionItem>
  );
}

export default function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full   space-y-2">
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
