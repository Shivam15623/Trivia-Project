import { Form } from "@/components/ui/form";

import { useUpdatePasswordMutation } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { handleApiError } from "@/utills/handleApiError";
import { RenderField } from "@/components/FormRender/renderFields";
import {
  passwordChangeSchema,
  passwordChangeValue,
} from "@/SchemaValidations/UserSchema";
import { showSuccess } from "@/components/toastUtills";
import PasswordStrength from "@/components/PasswordStrength";

import { GradientButton } from "@/components/GradientButton";
const AccountPassword = () => {
  const [passwordChange] = useUpdatePasswordMutation();
  const form = useForm<passwordChangeValue>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentpassword: "",
      newpassword: "",
      confirmpassword: "",
    },
  });
  const password = form.watch("newpassword");
  const handleSubmit = async (data: passwordChangeValue) => {
    try {
      const response = await passwordChange(data).unwrap();
      if (response.statuscode === 200) {
        showSuccess(response.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5 px-6 py-8 sm:px-10 sm:py-10 md:px-14"
      >
        <RenderField
          control={form.control}
          label="Current Password"
          name="currentpassword"
          labelClass="text-[#ffffffb3] "
          type="password"
          className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
          inputProps={{
            placeholder: "••••••••",
          }}
        />

        <RenderField
          control={form.control}
          label="New Password"
          name="newpassword"
          labelClass="text-[#ffffffb3] "
          className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
          type="password"
          inputProps={{
            placeholder: "••••••••",
          }}
        />

        <PasswordStrength password={password} />

        <RenderField
          control={form.control}
          label="Confirm Password"
          name="confirmpassword"
          className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
          labelClass="text-[#ffffffb3] "
          type="password"
          inputProps={{
            placeholder: "••••••••",
          }}
        />

        <div className="pt-2">
          <GradientButton
            type="submit"
            icon={false}
            className="mx-auto w-full max-w-fit sm:w-auto"
          >
            Update Password
          </GradientButton>
        </div>
      </form>
    </Form>
  );
};
export default AccountPassword;
