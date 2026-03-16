// TeamGameTab.tsx
import { useState } from "react";
import CategoryCard from "@/components/CategoryCard";
import PlayGameDialog from "./playGameDialog";
import { useFetchCategoryPublicQuery } from "@/services";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CategoryCardSkeleton } from "@/components/CategoryCardSkeleton";
import { GradientButton } from "@/components/GradientButton";

// ── Validation ────────────────────────────────────────────────────────────────
interface ValidationErrors {
  teamAName?: string;
  teamBName?: string;
  categories?: string;
  gameTitle?: string;
}

function validate(
  teamAName: string,
  teamBName: string,
  selectedCategories: string[],
  gameTitle: string,
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!teamAName.trim()) errors.teamAName = "Team A name is required.";
  if (!teamBName.trim()) errors.teamBName = "Team B name is required.";
  if (selectedCategories.length < 6)
    errors.categories = `Select ${6 - selectedCategories.length} more categor${6 - selectedCategories.length === 1 ? "y" : "ies"} (${selectedCategories.length}/6 selected).`;
  if (!gameTitle.trim()) errors.gameTitle = "Game title is required.";
  return errors;
}

// ── Inline error component ────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

// ── Summary banner shown above the Start button ───────────────────────────────
function ValidationSummary({
  errors,
  show,
}: {
  errors: ValidationErrors;
  show: boolean;
}) {
  const messages = Object.values(errors).filter(Boolean);
  if (!show || messages.length === 0) return null;

  return (
    <div className="mb-4 w-full max-w-md rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4 backdrop-blur-sm">
      <p className="mb-2 flex items-center gap-2 font-semibold text-red-300">
        <AlertCircle className="h-4 w-4" />
        Please fix the following before starting:
      </p>
      <ul className="space-y-1">
        {messages.map((msg) => (
          <li key={msg} className="flex items-start gap-2 text-sm text-red-200">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const TeamGameTab = () => {
  const { data: categories,isLoading:categoriesLoading } = useFetchCategoryPublicQuery();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [gameTitle, setGameTitle] = useState("");
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");

  // Track whether the user has attempted to open the dialog (show errors after first try)
  const [attempted, setAttempted] = useState(false);
  const INITIAL_VISIBLE = 10; // matches your 5-col grid — 2 full rows
  const [showAll, setShowAll] = useState(false);

  // then inside your .map(), slice the categories:
  const visibleCategories = showAll
    ? categories?.data
    : categories?.data?.slice(0, INITIAL_VISIBLE);
  const errors = validate(teamAName, teamBName, selectedCategories, gameTitle);
  const isValid = Object.keys(errors).length === 0;

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((c) => c !== id)
        : prev.length < 6
          ? [...prev, id]
          : prev,
    );
  };

  // Called when the user clicks "Start Now" — validate first, then let
  // PlayGameDialog open only if everything is fine.
  const handleStartAttempt = () => {
    setAttempted(true);
  };

  return (
    <>
      {/* ── Team names ── */}
      <section className="mb-10 flex flex-col items-center justify-center gap-6 px-[20px] sm:flex-row sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <div className="flex flex-col gap-3.5 text-center text-white">
          <h3 className="text-[48px] font-semibold">
            Team{" "}
            <span className="bg-a-sun bg-clip-text text-transparent">A</span>
          </h3>
          <div>
            <input
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              placeholder="Team A Name"
              className={`w-[260px] rounded-full border bg-white/10 px-5 py-3 text-white outline-none backdrop-blur-md transition-colors ${
                attempted && errors.teamAName
                  ? "border-red-400/70 placeholder-red-300/60"
                  : "border-white/20 placeholder-white/50"
              }`}
            />
            {attempted && <FieldError message={errors.teamAName} />}
          </div>
        </div>

        <img src="/Vs.svg" alt="VS" className="sm:h-[269px] sm:w-[290px]" />

        <div className="flex flex-col gap-3.5 text-center text-white">
          <h3 className="text-[48px] font-semibold">
            Team{" "}
            <span className="bg-aqua-abyss bg-clip-text text-transparent">
              B
            </span>
          </h3>
          <div>
            <input
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              placeholder="Team B Name"
              className={`w-[260px] rounded-full border bg-white/10 px-5 py-3 text-white outline-none backdrop-blur-md transition-colors ${
                attempted && errors.teamBName
                  ? "border-red-400/70 placeholder-red-300/60"
                  : "border-white/20 placeholder-white/50"
              }`}
            />
            {attempted && <FieldError message={errors.teamBName} />}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="flex flex-col items-center gap-6 px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
        <h2 className="text-center text-4xl font-semibold text-white sm:text-5xl">
          Choose Categories
        </h2>

        {/* Live counter badge */}
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selectedCategories.length === 6
              ? "bg-green-500/20 text-green-300"
              : "bg-white/10 text-white/70"
          }`}
        >
          {selectedCategories.length === 6 ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {selectedCategories.length}/6 categories selected
        </div>

        <div className="grid max-w-[1280px] grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-16">
          {categoriesLoading
            ? // ── Skeleton state ──────────────────────────
              Array.from({ length: INITIAL_VISIBLE }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : // ── Loaded state ─────────────────────────────
              visibleCategories?.map((category) => (
                <CategoryCard
                  key={category._id}
                  disabled={
                    selectedCategories.length >= 6 &&
                    !selectedCategories.includes(category._id)
                  }
                  category={category}
                  selected={selectedCategories.includes(category._id)}
                  toggleCategory={toggleCategory}
                />
              ))}
        </div>

        {attempted && <FieldError message={errors.categories} />}
        {!categoriesLoading &&
          !showAll &&
          (categories?.data?.length ?? 0) > INITIAL_VISIBLE && (
            <GradientButton
              type="button"
              className="w-full max-w-[150px]"
              onClick={() => setShowAll(true)}
            >
              View All
            </GradientButton>
          )}
      </section>

      {/* ── Game title ── */}
      <div className="relative z-10 mb-20 sm:mb-[180px]">
        <section className="relative z-10 flex flex-col items-center gap-6 px-[20px] sm:px-[40px] md:px-[60px] lg:px-[80px] xl:px-[120px]">
          <h2 className="text-center text-3xl font-semibold text-white sm:text-5xl">
            Name Your Masterpiece
          </h2>
          <div className="flex w-full max-w-[330px] flex-col items-center">
            <input
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              placeholder="e.g. Ultimate Friday Night Quiz"
              className={`h-[40px] w-full rounded-full bg-white/20 px-5 text-white placeholder-white/60 transition-colors focus:outline-none ${
                attempted && errors.gameTitle ? "ring-2 ring-red-400/70" : ""
              }`}
            />
            {attempted && <FieldError message={errors.gameTitle} />}
          </div>
          <section className="flex flex-col items-center gap-3">
            <div onClick={!isValid ? handleStartAttempt : undefined}>
              <PlayGameDialog
                categoryIds={selectedCategories}
                title={gameTitle}
                teamAName={teamAName}
                teamBName={teamBName}
                // Remove the disabled prop so the button is always clickable;
                // validation is now handled above.
              />
            </div>
            {/* Summary banner — only visible after first attempt while errors exist */}
            <ValidationSummary errors={errors} show={attempted && !isValid} />

            {/*
          We always render PlayGameDialog but intercept the trigger click.
          If invalid → mark attempted (shows errors) and keep dialog closed.
          If valid  → let the dialog open normally.
        */}
          </section>
        </section>
      </div>
    </>
  );
};

export default TeamGameTab;
