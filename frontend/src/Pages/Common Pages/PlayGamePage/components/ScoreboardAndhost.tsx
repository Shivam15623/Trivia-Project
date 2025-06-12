import { Team } from "@/interfaces/GameSessionInterface";
import { Button } from "@/components/ui/button";

export const ScoreboardAndHost = ({
  teams,
  isHost,
  onEndGame,
}: {
  teams: Team[];
  isHost: boolean;
  onEndGame?: () => void;
}) => {

  return (
    <div className="w-full top-0 right-0 px-4 py-3 bg-orange-50 shadow-md border-b border-orange-200 z-50 md:hidden">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-orange-800">Live Scoreboard</h2>
        {isHost && (
          <Button
            onClick={onEndGame}
            className="bg-orange-400 hover:bg-orange-500 text-xs font-semibold px-3 py-1 h-auto"
          >
            End Game
          </Button>
        )}
      </div>

      <div className="flex justify-around gap-2 bg-orange-100 rounded-lg p-2 overflow-x-auto">
        {teams.map((team, index) => (
          <div
            key={index}
            className="min-w-[80px] w-1/2 text-center border-r last:border-r-0 pr-2 last:pr-0"
          >
            <p className="text-sm font-medium text-orange-700 truncate">
              {team.name}
            </p>
            <p className="text-base font-bold text-orange-600">{team.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
