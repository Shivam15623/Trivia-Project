import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useGetUserProfileQuery, useUpdateProfileMutation } from "@/services";

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
import { GradientButton } from "@/components/GradientButton";
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
        {/* Saving overlay */}
        {isUpdating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[17px] bg-black/60 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-[#7BFDFD]" />
          </div>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 md:flex-row md:gap-10 md:px-14"
        >
          {/* Left — avatar */}
          <div className="flex flex-col items-center gap-3 text-center md:w-1/3">
            <RenderField
              control={form.control}
              className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
              label="Profile Picture"
              name="profilePic"
              type="profile-upload"
            />
            <h2 className="text-lg font-semibold text-white">
              {userdata.data.firstname} {userdata.data.lastname}
            </h2>
            <p className="break-words text-sm text-white/50">
              {userdata.data.email}
            </p>
          </div>

          {/* Right — fields */}
          <div className="flex w-full flex-col gap-4 md:w-2/3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RenderField
                control={form.control}
                label="First Name"
                name="firstname"
                labelClass="text-[#ffffffb3] "
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
                type="text"
                inputProps={{ placeholder: "John" }}
              />
              <RenderField
                control={form.control}
                label="Last Name"
                name="lastname"
                    labelClass="text-[#ffffffb3] "
                type="text"
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
                inputProps={{ placeholder: "Doe" }}
              />
            </div>

            <RenderField
              control={form.control}
              label="Email"
              name="email"
              labelClass="text-[#ffffffb3] "
              type="email"
              className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
              inputProps={{
                placeholder: "you@example.com",
              }}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <RenderField
                control={form.control}
                labelClass="text-[#ffffffb3] "
                label="Date of Birth"
                name="DOB"
                type="date"
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
              />
              <RenderField
                control={form.control}
                label="Phone No"
                name="phoneNo"
                    labelClass="text-[#ffffffb3] "
                type="phone"
              />
            </div>

            <div className="mt-2 flex">
              <GradientButton
                type="submit"
                disabled={isUpdating}
                icon={false}
                className="w-full max-w-fit sm:w-auto"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </GradientButton>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default AccountUpdate;
