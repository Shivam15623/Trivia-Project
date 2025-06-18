import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useUpdatePasswordMutation } from "@/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { handleApiError } from "@/utills/handleApiError";

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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-4xl   mx-auto p-6 bg-white space-y-6"
      >
        <RenderField
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
          control={form.control}
          label="New Password"
          name="newpassword"
          
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
  );
};

export default AccountPassword;
