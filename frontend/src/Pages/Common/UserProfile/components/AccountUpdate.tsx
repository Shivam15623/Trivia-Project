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
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { UpdateUserDetails } from "@/redux/AuthSlice/authSlice";

const AccountUpdate = () => {
  const { data: userdata, isLoading } = useGetUserProfileQuery(undefined);
  const [updateDetails, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
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

      if (values.profilePic instanceof File) {
        formData.append("profilePic", values.profilePic);
      }
      formData.append("lastname", values.lastname);
      formData.append("email", values.email);
      formData.append("phoneNo", values.phoneNo);
      formData.append("DOB", format(values.DOB, "yyyy-MM-dd"));

      const response = await updateDetails(formData).unwrap();
      if (response?.success === true) {
        
        const payload = {
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
          phoneNo: response.data.phoneNo,
          DOB: response.data.DOB,
          profilePic: response.data.profilePic,
        };
        dispatch(UpdateUserDetails({ UserData: payload }));
        showSuccess(response?.message);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Form {...form}>
      <div className="relative">
        {isUpdating && (
          <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-md">
            <Loader2 className="animate-spin h-6 w-6 text-[#e34b4b]" />
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-4xl w-full mx-auto p-4 sm:p-6 bg-white space-y-6 rounded-md shadow-md"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Left Column */}
            <div className="flex flex-col items-center md:w-1/3 text-center">
              <RenderField
                Inputvariant="solidred"
                control={form.control}
                label="Profile Picture"
                name="profilePic"
                type="profile-upload"
              />
              <h2 className="my-3 text-lg font-semibold">
                {userdata.data.firstname} {userdata.data.lastname}
              </h2>
              <p className="text-sm text-gray-500 break-words">
                {userdata.data.email}
              </p>
            </div>

            {/* Right Column */}
            <div className="md:w-2/3 w-full">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RenderField
                    Inputvariant="solidred"
                    control={form.control}
                    label="Date of Birth"
                    name="DOB"
                    type="date"
                    className="w-full"
                    inputProps={{
                      required: true,
                    }}
                  />
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

              <div className="flex mt-5">
                <Button
                  type="submit"
                  variant="gradient"
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  {isUpdating && (
                    <Loader2 className="animate-spin h-4 w-4 text-white" />
                  )}
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default AccountUpdate;
