import { DialogWrapper } from "@/components/DialogWrapper";
import { RenderField } from "@/components/FormRender/renderFields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSocket } from "@/hooks/useSocket";
import { Game } from "@/interfaces/GameInterface";
import { useStartSessionMutation } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
  selectedTeam: z.enum(["A", "B"]),
});
export type GameTeamValues = z.infer<typeof schema>;

export default function PlayGameDialog({ game }: { game: Game }) {
  const form = useForm<GameTeamValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstTeamName: "",
      secondTeamName: "",
      firstTeamMembers: 1,
      secondTeamMembers: 1,
      selectedTeam: "A",
    },
  });

  const [sessionStart, { isLoading }] = useStartSessionMutation();
  const socket = useSocket();
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
    <DialogWrapper
      title="Select Team Information"
      size="xl"
      resetForm={() => form.reset()}
      trigger={
        <div className=" cursor-pointer bg-white text-[#a90000] text-center text-lg 2xl:text-2xl font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
          Team Play
        </div>
      }
    >
      <Form {...form}>
        <div
          className={`relative ${
            isLoading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
            <div className="grid gap-4 md:gap-8 lg:gap-10 2xl:gap-x-16 sm:grid-cols-2 mt-2 md:mt-14 xl:mt-6 2xl:mt-8 max-w-4xl 4xl:max-w-6xl mx-auto">
              {/* First Team */}
              <div>
                <h3 className="text-lg xl:text-2xl font-semibold text-center font-cairo mb-3">
                  First Team
                </h3>
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  type="text"
                  label=""
                  name="firstTeamName"
                  inputProps={{ placeholder: "Bug" }}
                  className="border border-[#707070] px-2 lg:px-3 xl:px-5 py-2 sm:py-3 h-auto md:py-3 text-center rounded-full placeholder:text-inherit text-lg 2xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                />
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  name="firstTeamMembers"
                  label=""
                  type="number"
                  inputProps={{
                    placeholder: "Number of members",
                  }}
                  className="border mt-6 border-[#707070] px-2 lg:px-3 xl:px-5 py-2 sm:py-3 h-auto text-center md:py-3 rounded-full placeholder:text-inherit text-lg 2xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                />
              </div>

              {/* Second Team */}
              <div>
                <h3 className="text-lg xl:text-2xl font-semibold text-center font-cairo mb-3">
                  Second Team
                </h3>
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  type="text"
                  label=""
                  inputProps={{ placeholder: "error" }}
                  name="secondTeamName"
                  className="border border-[#707070] text-center h-auto px-2 lg:px-3 xl:px-5 py-2 sm:py-3 md:py-3 rounded-full placeholder:text-inherit text-lg 2xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                />
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  name="secondTeamMembers"
                  type="number"
                  inputProps={{
                    placeholder: "Number of members",
                  }}
                  label=""
                  className="border mt-6 text-center border-[#707070] h-auto px-2 lg:px-3 xl:px-5 py-2 sm:py-3 md:py-3 rounded-full placeholder:text-inherit text-lg 2xl:text-2xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none"
                />
              </div>
            </div>
            <div className="mt-12 mx-auto">
              <h3 className="text-lg xl:text-2xl font-semibold text-center font-cairo mb-4">
                Select Your Team
              </h3>
              <div className="mx-auto w-fit">
                <RenderField
                  Inputvariant="solidred"
                  name="selectedTeam"
                  label="Choose Team"
                  control={form.control}
                  type="radio"
                  options={[
                    { label: "First Team", value: "A" },
                    { label: "Second Team", value: "B" },
                  ]}
                />
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-10">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 h-auto text-white px-6 py-2 rounded-full text-lg flex items-center justify-center gap-2"
              >
                {isLoading && (
                  <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {isLoading ? "Starting..." : "Start Game"}
              </Button>
            </div>
          </form>
        </div>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
            <Loader2 className="loader w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </Form>
    </DialogWrapper>
  );
}
