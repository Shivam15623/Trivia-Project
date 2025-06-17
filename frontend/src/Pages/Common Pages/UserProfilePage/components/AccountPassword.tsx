import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useUpdatePasswordMutation } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import logError from "@/utills/logError";

import { RenderField } from "@/components/renderFields";
import {
  passwordChangeSchema,
  passwordChangeValue,
} from "@/SchemaValidations/UserSchema";
import { showSuccess } from "@/components/toastUtills";

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
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-8">
      <h2 className="text-xl font-semibold mb-6">Change Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <RenderField
            control={form.control}
            label="Current Password"
            name="currentpassword"
            className="w-full"
            type="password"
            inputProps={{
              placeholder: "••••••••",
              required: true,
            }}
          />
          <RenderField
            control={form.control}
            label="New Password"
            name="newpassword"
            className="w-full"
            type="password"
            inputProps={{
              placeholder: "••••••••",
              required: true,
            }}
          />
          <RenderField
            control={form.control}
            label="Confirm Password"
            name="confirmpassword"
            className="w-full"
            type="password"
            inputProps={{
              placeholder: "••••••••",
              required: true,
            }}
          />
          <div className="pt-4">
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountPassword;
