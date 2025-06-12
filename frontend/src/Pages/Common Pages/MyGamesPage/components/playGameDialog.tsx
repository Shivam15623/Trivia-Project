import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Game } from "@/interfaces/GameInterface";
import { useStartSessionMutation } from "@/services";
import { initializeSocket } from "@/utills/Socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
const schema = z.object({
  firstTeamName: z.string().min(1, "First Team Name is required"),
  firstTeamMembers: z
    .number()
    .min(1, "First Team Members should be at least 1")
    .max(5, "First Team Members should be less than or equal to 5"),
  secondTeamName: z.string().min(1, "Second Team Name is required"),
  secondTeamMembers: z
    .number()
    .min(1, "Second Team Members should be at least 1")
    .max(5, "Second Team Members should be less than or equal to 5"),
  selectedTeam: z.enum(["A", "B"]).optional(),
});
export type GameTeamValues = z.infer<typeof schema>;

export default function PlayGameDialog({
  game,
  children,
}: {
  game: Game;
  children: React.ReactNode;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstTeamName: "",
      secondTeamName: "",
      firstTeamMembers: 1,
      secondTeamMembers: 1,
      selectedTeam: undefined,
    },
  });

  const [sessionStart] = useStartSessionMutation();
  const socket = initializeSocket();
  const navigate = useNavigate();
  const onSubmit = async (values: GameTeamValues) => {
    if (!values.selectedTeam || !socket) {
      return;
    }
    const payload = {
      teamAName: values.firstTeamName,
      teamBName: values.secondTeamName,
      teamAmembers: values.firstTeamMembers,
      teamBmembers: values.secondTeamMembers,
      hostTeam: values.selectedTeam,
      gameId: game._id,
      socketId: socket.id!,
    };

    const response = await sessionStart(payload).unwrap();
    if (response.statuscode === 200) {
      navigate(`/game/Waitingroom/${response.data.sessionCode}`);
    }
  };
  if (!game) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="rounded-2xl bg-white px-6 pt-6 pb-8 sm:max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>
            <h3 className="text-2xl xl:text-4xl font-bold text-center text-gray-900 font-cairo">
              Select Team Information
            </h3>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-4">
          <div className="grid gap-4 md:gap-8 lg:gap-10 2xl:gap-x-16 sm:grid-cols-2 mt-4 md:mt-10 xl:mt-12 2xl:mt-16 max-w-4xl 4xl:max-w-6xl mx-auto">
            {/* First Team */}
            <div>
              <h3 className="text-lg xl:text-2xl font-semibold text-center font-cairo mb-3">
                First Team
              </h3>
              <Controller
                name="firstTeamName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Team Name"
                    className="border border-[#707070] px-2 lg:px-3 xl:px-5 py-2 sm:py-3 md:py-3 rounded-full placeholder:text-inherit text-lg 4xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                  />
                )}
              />
              {errors.firstTeamName && (
                <p className="text-red-500 text-sm">
                  {errors.firstTeamName.message}
                </p>
              )}
              <Controller
                name="firstTeamMembers"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    value={field.value ?? ""} // handles undefined gracefully
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Team Members"
                    className="border mt-6 border-[#707070] px-2 lg:px-3 xl:px-5 py-2 sm:py-3 md:py-3 rounded-full placeholder:text-inherit text-lg 4xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                  />
                )}
              />
              {errors.firstTeamMembers && (
                <p className="text-red-500 text-sm">
                  {errors.firstTeamMembers.message}
                </p>
              )}
            </div>

            {/* Second Team */}
            <div>
              <h3 className="text-lg xl:text-2xl font-semibold text-center font-cairo mb-3">
                Second Team
              </h3>
              <Controller
                name="secondTeamName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Team Name"
                    className="border border-[#707070] px-2 lg:px-3 xl:px-5 py-2 sm:py-3 md:py-3 rounded-full placeholder:text-inherit text-lg 4xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                  />
                )}
              />
              {errors.secondTeamName && (
                <p className="text-red-500 text-sm">
                  {errors.secondTeamName.message}
                </p>
              )}
              <Controller
                name="secondTeamMembers"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Team Members"
                    className="border mt-6 border-[#707070] px-2 lg:px-3 xl:px-5 py-2 sm:py-3 md:py-3 rounded-full placeholder:text-inherit text-lg 4xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                  />
                )}
              />
              {errors.secondTeamMembers && (
                <p className="text-red-500 text-sm">
                  {errors.secondTeamMembers.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-lg xl:text-2xl font-semibold text-center font-cairo mb-4">
              Select Your Team
            </h3>
            <div className="flex justify-center gap-6">
              <label className="flex items-center gap-2 text-lg cursor-pointer">
                <Controller
                  name="selectedTeam"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="radio"
                      value="A"
                      className="accent-black w-5 h-5"
                    />
                  )}
                />
                First Team
              </label>
              <label className="flex items-center gap-2 text-lg cursor-pointer">
                <Controller
                  name="selectedTeam"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="radio"
                      value="B"
                      className="accent-black w-5 h-5"
                    />
                  )}
                />
                Second Team
              </label>
            </div>
            {errors.selectedTeam && (
              <p className="text-red-500 text-sm">
                {errors.selectedTeam.message}
              </p>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-10">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-lg"
            >
              Start Game
            </button>
            <button
              type="button"
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full text-lg"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Buttons */}
      </DialogContent>
    </Dialog>
  );
}
