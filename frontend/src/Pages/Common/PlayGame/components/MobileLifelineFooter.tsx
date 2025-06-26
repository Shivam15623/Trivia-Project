import { Button } from "@/components/ui/button";
import { Divide, MinusCircle, Zap } from "lucide-react";

export const MobileLifelineFooter = ({
  isFifty,
  handlefiftyfifty,
  DeductUsed,
  twiceUsed,
  useAid,
  setUseAid,
}: {
  isFifty: boolean;
  handlefiftyfifty: () => void;
  DeductUsed: boolean;
  twiceUsed: boolean;
  useAid: string;
  setUseAid: (aid: "Deduct" | "None" | "twicePoint") => void;
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-200 p-3 ">
      <div className="flex justify-between gap-2">
        <Button
          disabled={!isFifty}
          onClick={handlefiftyfifty}
          className={`flex-1 flex items-center justify-center gap-1 text-sm rounded-lg py-2 transition
            ${
              isFifty
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          <Divide size={18} />
          50-50
        </Button>

        <Button
          disabled={!DeductUsed || useAid !== "None"}
          onClick={() => setUseAid("Deduct")}
          className={`flex-1 flex items-center justify-center gap-1 text-sm rounded-lg py-2 transition
            ${
              useAid === "Deduct"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : !DeductUsed || useAid !== "None"
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-blue-100"
            }`}
        >
          <MinusCircle size={18} />
          Deduct
        </Button>

        <Button
          disabled={!twiceUsed || useAid !== "None"}
          onClick={() => setUseAid("twicePoint")}
          className={`flex-1 flex items-center justify-center gap-1 text-sm rounded-lg py-2 transition
            ${
              useAid === "twicePoint"
                ? "bg-green-600 text-white hover:bg-green-700"
                : !twiceUsed || useAid !== "None"
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-green-100"
            }`}
        >
          <Zap size={18} />
          2x
        </Button>
      </div>
    </div>
  );
};
