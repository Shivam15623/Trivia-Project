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
import { useBanUserMutation } from "@/services";
import { showSuccess } from "@/components/toastUtills";
import { handleApiError } from "@/utills/handleApiError";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const banSchema = z.object({
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(200, "Reason too long"),
});

type BanFormValues = z.infer<typeof banSchema>;

type BannUserProps = {
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    profilePic?: string;
  };
};

const BannUser: React.FC<BannUserProps> = ({ user }) => {
  const [banuser, { isLoading }] = useBanUserMutation();
  const form = useForm<BanFormValues>({
    resolver: zodResolver(banSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (data: BanFormValues) => {
    try {
      const res = await banuser({
        userId: user._id,
        reason: data.reason,
      }).unwrap();
      if (res.success) {
        showSuccess(res.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <DialogWrapper
      type="delete"
      title="Ban User"
      trigger={
        <Icon
          icon="material-symbols-light:block-outline"
          className="h-6 w-6 cursor-pointer text-white"
        />
      }
      size="3xl"
    >
      <div className="flex flex-col gap-6">
        {/* ⚠ Warning */}
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-300">
          ⚠ Are you sure you want to permanently ban this user?
        </div>

        {/* 👤 User Info */}
        <div className="flex items-center gap-4 rounded-xl bg-[#FFFFFF10] p-4 shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)]">
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

        {/* 📝 Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <RenderField<BanFormValues>
              name="reason"
              label="Ban Reason"
              control={form.control}
              type="textarea"
              inputProps={{
                placeholder: "Explain why this user is being banned",
                required: true,
              }}
              className="w-full rounded-2xl border-0 bg-[#FFFFFF33] px-5 py-3 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Ban User Permanently
            </Button>
          </form>
        </Form>
      </div>
    </DialogWrapper>
  );
};

export default BannUser;
