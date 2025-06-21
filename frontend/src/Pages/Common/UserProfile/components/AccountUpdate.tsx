import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGetUserProfileQuery, useUpdateProfileMutation } from "@/services";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

import { handleApiError } from "@/utills/handleApiError";
import { RenderField } from "@/components/FormRender/renderFields";
import {
  UserDetailsSchema,
  UserDetailsValues,
} from "@/SchemaValidations/UserSchema";
import { showSuccess } from "@/components/toastUtills";

const AccountUpdate = () => {
  const { data: userdata, isLoading } = useGetUserProfileQuery(undefined);
  const [updateDetails] = useUpdateProfileMutation();
  const form = useForm<UserDetailsValues>({
    resolver: zodResolver(UserDetailsSchema),
    defaultValues: {
      firstname: userdata?.data?.firstname || "",
      lastname: userdata?.data?.lastname || "",
      email: userdata?.data?.email || "",
      DOB: userdata?.data?.DOB ? new Date(userdata.data.DOB) : new Date(),
      phoneNo: userdata?.data?.phoneNo || "",
      profilePic: userdata?.data?.profilePic || "",
    },
  });
  useEffect(() => {
    if (!userdata?.data) return;

    form.reset({
      firstname: userdata.data.firstname,
      lastname: userdata.data.lastname,
      email: userdata.data.email,
      DOB: userdata.data.DOB ? new Date(userdata.data.DOB) : undefined,
      phoneNo: userdata.data.phoneNo,
      profilePic: userdata.data.profilePic,
    });
  }, [userdata?.data, form]);
  if (isLoading || !userdata?.data) {
    return <div className="p-5">Loading...</div>;
  }
  const onSubmit = async (values: UserDetailsValues) => {
    try {
      const formData = new FormData();
      formData.append("firstname", values.firstname);

      if (
        values.profilePic instanceof FileList &&
        values.profilePic.length > 0
      ) {
        formData.append("profilePic", values.profilePic[0]);
      }
      formData.append("lastname", values.lastname);
      formData.append("email", values.email);
      formData.append("phoneNo", values.phoneNo);
      formData.append("DOB", values.DOB.toISOString().split("T")[0]);

      const response = await updateDetails(formData).unwrap();

      // Check for success
      if (response?.success === true) {
        // Show success toast
        showSuccess(response?.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-6 bg-white  space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-center">
            <RenderField
              Inputvariant="solidred"
              control={form.control}
              label="Profile Picture"
              name="profilePic"
              type="profile-upload"
            />
            <h2 className="my-3">
              {userdata.data.firstname} {userdata.data.lastname}
            </h2>
            <p>{userdata.data.email}</p>
          </div>
          {/* Right Column: Profile Pic */}
          <div className="flex-1">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  label="First Name"
                  name="firstname"
                  type="text"
                  inputProps={{
                    placeholder: "john",
                    required: true,
                  }}
                />

                {/* Last Name */}
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  label="Last Name"
                  name="lastname"
                  type="text"
                  inputProps={{
                    placeholder: "Doe",
                    required: true,
                  }}
                />
              </div>

              {/* Email */}
              <RenderField
                Inputvariant="solidred"
                control={form.control}
                label="Email"
                name="email"
                type="email"
                inputProps={{
                  placeholder: "you@example.com",
                  required: true,
                }}
              />
              {/* DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  label="Date of Birth"
                  name="DOB"
                  type="date"
                  inputProps={{
                    required: true,
                  }}
                />

                {/* Phone Number */}
                <RenderField
                  control={form.control}
                  label="Phone No"
                  name="phoneNo"
                  type="phone"
                  inputProps={{
                    required: true,
                  }}
                />
              </div>
            </div>
            <div className="flex  mt-3 justify-start">
              <Button type="submit" variant={"gradient"}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AccountUpdate;
