"use client";

import React from "react";
import { DialogWrapper } from "@/components/DialogWrapper";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RenderField } from "@/components/FormRender/renderFields";
import { handleApiError } from "@/utills/handleApiError";
import { useSuspendUserMutation } from "@/services";
import { showSuccess } from "@/components/toastUtills";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const suspendSchema = z.object({
  days: z
    .number({
      required_error: "Days required",
    })
    .min(1, "Minimum 1 day")
    .max(365, "Maximum 365 days"),

  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(200, "Reason too long"),
});

type SuspendFormValues = z.infer<typeof suspendSchema>;

type SuspendStatusProps = {
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    profilePic?: string;
  };
};

const SuspendStatus: React.FC<SuspendStatusProps> = ({ user }) => {
  const [suspendUser, { isLoading }] = useSuspendUserMutation();
  const form = useForm<SuspendFormValues>({
    resolver: zodResolver(suspendSchema),
    defaultValues: {
      days: 7,
      reason: "",
    },
  });

  const onSubmit = async (data: SuspendFormValues) => {
    try {
      const res = await suspendUser({
        userId: user._id,
        days: data.days,
        reason: data.reason,
      }).unwrap();
      if (res.success) {
        showSuccess(res.message);
      }
    } catch (error) {
      handleApiError(error);
    }

    // await suspendUser({ userId: user._id, ...data })
  };

  return (
    <DialogWrapper
      type="edit"
      title="Suspend User"
      trigger={
        <Icon
          icon="lsicon:suspend-outline"
          className="h-6 w-6 cursor-pointer text-white"
        />
      }
      size="3xl"
    >
      <div className="flex flex-col gap-6">
        {/* Warning */}
        <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4 text-yellow-300">
          ⚠ Are you sure you want to suspend this user?
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4 rounded-xl bg-[#FFFFFF10] shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profilePic || ""} />
            <AvatarFallback className="bg-[#7BFDFD] font-outfit text-2xl font-medium leading-[22px] text-[#2884C7]">
              {user?.firstname?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col text-white">
            <span className="font-semibold">
              {user.firstname} {user.lastname}
            </span>
            <span className="text-sm text-white/70">{user.email}</span>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <RenderField<SuspendFormValues>
              name="days"
              label="Suspension Duration (Days)"
              control={form.control}
              type="number"
              inputProps={{
                placeholder: "Enter number of days",
                required: true,
              }}
              className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
            />

            <RenderField<SuspendFormValues>
              name="reason"
              label="Suspension Reason"
              control={form.control}
              type="textarea"
              inputProps={{
                placeholder: "Enter reason for suspension",
                required: true,
              }}
              className="w-full rounded-2xl border-0 bg-[#FFFFFF33] px-5 py-3 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 rounded-full bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Suspend User
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogWrapper>
  );
};

export default SuspendStatus;
