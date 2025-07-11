import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useLoginUserMutation } from "@/services";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "@/redux/AuthSlice/authSlice";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { RenderField } from "@/components/FormRender/renderFields";
import { LoginSchema, LoginValues } from "@/SchemaValidations/AuthSchema";
import { Loader2, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthCardWrapper from "@/components/AuthCardWrapper";
// 🔁 Replace with actual hook if different

const Login = () => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginUserMutation(); // ⛳️ Change if needed

  const handleLogin = async (data: LoginValues) => {
    try {
      const response = await login(data).unwrap();

      if (response.statuscode === 200) {
        if (response.data.user.isVerified === false) {
          showSuccess("User Email Is Not Verified Verify First");
          navigate("/resent-email");
        } else {
          showSuccess(response.message);
          dispatch(
            setLoggedIn({
              UserData: response.data.user,
              accessToken: response.data.accessToken,
            })
          );
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className=" flex items-center patt min-h-screen justify-center px-4">
      <AuthCardWrapper icon={<User className="w-10 h-10 text-[#e34b4b]" />}>
        <div className="p-6 w-full sm:w-[450px] relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 bg-white/70 pointer-events-none backdrop-blur-sm flex items-center justify-center rounded-2xl">
              <Loader2 className="animate-spin h-6 w-6 text-[#e34b4b]" />
            </div>
          )}
          <h2 className="text-2xl font-semibold text-center mb-2 text-[#e34b4b]">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to your account to continue
          </p>
          <Form {...form}>
            {" "}
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6"
            >
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
              <div>
                {" "}
                <RenderField
                  Inputvariant="solidred"
                  control={form.control}
                  label="Password"
                  name="password"
                  className="w-full"
                  type="password"
                  inputProps={{
                    placeholder: "••••••••",
                    required: true,
                  }}
                />
                <p>
                  <Link
                    to="/reset-request-password"
                    className="text-xs mt-2 text-[#e34b4b] hover:underline text-right flex justify-end"
                  >
                    forgot Password?
                  </Link>
                </p>
              </div>
              <Button
                type="submit"
                variant={"gradient"}
                disabled={isLoading}
                className="w-full"
              >
                Log In
              </Button>
            </form>
          </Form>
        </div>
        <div className="bg-[#fff8f0] p-4 text-center border-t border-orange-100">
          <p className="text-sm text-gray-600 mx-auto">
            Don't have an account?
            <Link
              to="/signup"
              className="text-[#e34b4b]  hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </AuthCardWrapper>
    </div>
  );
};

export default Login;
