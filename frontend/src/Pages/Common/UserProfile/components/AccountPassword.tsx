import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
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
import PasswordRequirementSection from "@/components/PasswordRequirementSection";

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
        className="max-w-4xl w-1/2   mx-auto  bg-white space-y-6"
      >
        <RenderField
          Inputvariant="solidred"
          control={form.control}
          label="Current Password"
          name="currentpassword"
          type="password"
          inputProps={{
            placeholder: "••••••••",
            required: true,
          }}
        />
        <RenderField
          Inputvariant="solidred"
          control={form.control}
          label="New Password"
          name="newpassword"
          type="password"
          inputProps={{
            placeholder: "••••••••",
            required: true,
          }}
        />
        <PasswordStrength password={password} />
        <PasswordRequirementSection password={password} />
        <RenderField
          Inputvariant="solidred"
          control={form.control}
          label="Confirm Password"
          name="confirmpassword"
          type="password"
          inputProps={{
            placeholder: "••••••••",
            required: true,
          }}
        />
        <div className="pt-4">
          <Button type="submit" variant={"gradient"} className="w-full">
            Update Password
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountPassword;
