// PlayGameDialog.tsx
import { DialogWrapper } from "@/components/DialogWrapper";
import { RenderField } from "@/components/FormRender/renderFields";
import { GradientButton } from "@/components/GradientButton";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSocket } from "@/hooks/useSocket";
import { StartSessionPayload } from "@/interfaces/GameInterface";
import { useStartSessionMutation } from "@/services";
import { handleApiError } from "@/utills/handleApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// ✅ Validation schema
const schema = z.object({
  firstTeamName: z.string().min(1, "First Team Name is required"),
  secondTeamName: z.string().min(1, "Second Team Name is required"),
  firstTeamMembers: z.coerce
    .number()
    .min(1, "Team A must have at least 1 member")
    .max(5, "Max 5 members"),

  secondTeamMembers: z.coerce
    .number()
    .min(1, "Team B must have at least 1 member")
    .max(5, "Max 5 members"),
  selectedTeam: z.enum(["A", "B"]),
  title: z.string().min(1, "Game Title is required"),
  categoryIds: z
    .array(z.string())
    .min(6, "Select 6 category")
    .max(6, "Max 6 categories"),
});

export type GameTeamValues = z.infer<typeof schema>;

export default function PlayGameDialog({
  teamAName = "",
  teamBName = "",
  title = "",
  categoryIds = [],
}: {
  teamAName?: string;
  teamBName?: string;
  title?: string;
  categoryIds?: string[];
}) {
  const navigate = useNavigate();
  const socket = useSocket();
  const [sessionStart, { isLoading }] = useStartSessionMutation();

  const form = useForm<GameTeamValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstTeamName: teamAName,
      secondTeamName: teamBName,
      firstTeamMembers: 1,
      secondTeamMembers: 1,
      selectedTeam: "A",
      title,
      categoryIds,
    },
  });
  const teamAMembers = useWatch({
    control: form.control,
    name: "firstTeamMembers",
  });
  const teamBMembers = useWatch({
    control: form.control,
    name: "secondTeamMembers",
  });
  useEffect(() => {
    form.reset({
      firstTeamName: teamAName,
      secondTeamName: teamBName,
      firstTeamMembers: 1,
      secondTeamMembers: 1,
      selectedTeam: "A",
      title,
      categoryIds,
    });
  }, [teamAName, teamBName, title, categoryIds, form]);
  const onSubmit = async (values: GameTeamValues) => {
    if (!socket) return;

    try {
      const payload: StartSessionPayload = {
        teamAName: values.firstTeamName,
        teamBName: values.secondTeamName,
        teamAmembers: values.firstTeamMembers,
        teamBmembers: values.secondTeamMembers,
        hostTeam: values.selectedTeam,
        socketId: socket.id!,
        title: values.title,
        categoryIds: values.categoryIds,
        mode: "team",
      };

      const response = await sessionStart(payload).unwrap();
      if (response.statuscode === 200) {
        navigate(`/game/Waitingroom/${response.data.sessionCode}`);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <DialogWrapper
      title="Select Team Information"
      size="3xl"
      resetForm={() => form.reset()}
      trigger={
        <GradientButton
          className="max-w-[157px] gap-[10px]"
          disabled={
            !title || categoryIds.length !== 6 || !teamAName || !teamBName
          }
        >
          Start Now
        </GradientButton>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("FORM ERRORS:", errors),
          )}
          className="relative flex flex-col gap-5 sm:gap-10"
        >
          <div className="flex w-full flex-col justify-center gap-0 sm:flex-row sm:gap-[9px]">
            <div className="flex flex-1 flex-col justify-center gap-3.5">
              <h3 className="text-center font-inter text-[48px] font-semibold leading-[70px] text-white">
                Team{" "}
                <span className="bg-[linear-gradient(180deg,_#FCD645_54.81%,_#FCB734_79.33%,_#D37200_95.19%)] bg-clip-text text-transparent">
                  A
                </span>
              </h3>
              <RenderField
                control={form.control}
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
                type="text"
                name="firstTeamName"
                label=""
                inputProps={{ placeholder: "Team A Name" }}
              />
              <div className="mx-auto flex h-[40px] max-w-fit items-center gap-10 rounded-full bg-[#FFFFFF33] px-8 py-2 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)]">
                <Button
                  type="button"
                  onClick={() =>
                    form.setValue(
                      "firstTeamMembers",
                      Math.max(1, teamAMembers - 1),
                      { shouldValidate: true },
                    )
                  }
                  className="h-6 w-6 bg-transparent p-0 text-white hover:bg-white/10"
                >
                  <Minus className="h-6 w-6" />
                </Button>

                <span className="select-none text-lg font-semibold text-white">
                  {teamAMembers}
                </span>

                <Button
                  type="button"
                  onClick={() =>
                    form.setValue(
                      "firstTeamMembers",
                      Math.min(5, teamAMembers + 1),
                      { shouldValidate: true },
                    )
                  }
                  className="h-6 w-6 bg-transparent p-0 text-white hover:bg-white/10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <img
              src="/Vs.svg"
              className="mx-auto aspect-square w-full max-w-[109px] sm:max-h-[200px] sm:max-w-[200px]"
            />

            <div className="flex flex-1 flex-col justify-center gap-3.5">
              {" "}
              <h3 className="text-center font-inter text-[48px] font-semibold leading-[70px] text-white">
                Team{" "}
                <span className="bg-[linear-gradient(180deg,_#7BFDFD_62.5%,_#2884C7_100%)] bg-clip-text text-transparent">
                  B
                </span>
              </h3>
              <RenderField
                control={form.control}
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
                type="text"
                name="secondTeamName"
                label=""
                inputProps={{ placeholder: "Team B Name" }}
              />
              <div className="mx-auto flex h-[40px] max-w-fit items-center gap-10 rounded-full bg-[#FFFFFF33] px-8 py-2 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)]">
                <Button
                  type="button"
                  onClick={() =>
                    form.setValue(
                      "secondTeamMembers",
                      Math.max(1, teamBMembers - 1),
                      { shouldValidate: true },
                    )
                  }
                  className="h-6 w-6 bg-transparent p-0 text-white hover:bg-white/10"
                >
                  <Minus className="h-6 w-6" />
                </Button>

                <span className="select-none text-lg font-semibold text-white">
                  {teamBMembers}
                </span>

                <Button
                  type="button"
                  onClick={() =>
                    form.setValue(
                      "secondTeamMembers",
                      Math.min(5, teamBMembers + 1),
                      { shouldValidate: true },
                    )
                  }
                  className="h-6 w-6 bg-transparent p-0 text-white hover:bg-white/10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
          {/* First Team */}

          {/* Host Team */}
          <div className="flex flex-col items-center gap-[18px]">
            <p className="font-outfit text-sm font-normal leading-[100%] text-white sm:text-[18px]">
              Select Your Team
            </p>
            <RenderField
              name="selectedTeam"
              className="gap-[54px]"
              control={form.control}
              type="radio"
              options={[
                { label: "Team A", value: "A" },
                { label: "Team B", value: "B" },
              ]}
            />
          </div>

          {/* Submit */}
          <div className="mt-4 flex justify-center">
            <GradientButton
              className="max-w-fit"
              type="submit"
              disabled={isLoading}
            >
              <div className="flex flex-row gap-2 items-center ">
          
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}{" "}
                <span> {isLoading ? "Starting..." : "Start Game"}</span>
              </div>
            </GradientButton>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
