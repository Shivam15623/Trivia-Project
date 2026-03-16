import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { useLoginUserMutation } from "@/services";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "@/redux/AuthSlice/authSlice";
import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { RenderField } from "@/components/FormRender/renderFields";
import { LoginSchema, LoginValues } from "@/SchemaValidations/AuthSchema";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthCardWrapper from "@/components/AuthCardWrapper";
import { GradientButton } from "@/components/GradientButton";
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
            }),
          );
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4">
      <AuthCardWrapper >
        <div className="relative w-full p-6 sm:w-[450px]">
          {isLoading && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
              <Loader2 className="h-6 w-6 animate-spin text-[#e34b4b]" />
            </div>
          )}
          <h2 className="mb-2 text-center text-2xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="mb-6 text-center text-sm text-white/50">
            Sign in to your account to continue
          </p>
          <Form {...form}>
            {" "}
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <RenderField
                control={form.control}
                labelClass="text-[#ffffffb3] "
                className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
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
                  control={form.control}
                  labelClass="text-[#ffffffb3] "
                  className="h-10 w-full rounded-[100px] border-0 bg-[#FFFFFF33] px-5 text-sm text-white shadow-[inset_1px_1px_0_0_rgba(255,255,255,0.5)] placeholder:text-white/50 focus:outline-none sm:text-base"
                  label="Password"
                  name="password"
                  type="password"
                  inputProps={{
                    placeholder: "••••••••",
                    required: true,
                  }}
                />
                <p>
                  <Link
                    to="/reset-request-password"
                    className="mt-2 flex justify-end text-right font-outfit text-xs text-amber-400 hover:underline"
                  >
                    forgot Password?
                  </Link>
                </p>
              </div>
              <GradientButton
                type="submit"
                disabled={isLoading}
                icon={false}
                className="w-full max-w-none font-outfit"
              >
                Log In
              </GradientButton>
            </form>
          </Form>
        </div>
        <div className="border-t border-white/10 p-4 text-center">
          <p className="mx-auto text-center text-sm text-white/50">
            Don't have an account?
            <Link
              to="/signup"
              className="font-inter font-medium text-amber-400 transition-colors hover:text-amber-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </AuthCardWrapper>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[48%] z-0 h-[74vw] w-[448px] rotate-[107.68deg] rounded-[20px] bg-orange-sun opacity-50 blur-[51.6px] sm:w-[748px] md:right-[3.5%] md:z-[2] md:h-[604.663px] md:rotate-[17.68deg] md:rounded-[40px] lg:top-[21%] lg:w-[48.39%]" />

        <div className="absolute left-[10px] top-[150px] z-[2] h-[336px] w-[96.18%] -rotate-[120deg] rounded-[20px] bg-aqua-abyss opacity-50 blur-[51.6px] md:z-0 md:h-[696.774px] md:rotate-[150.39deg] md:rounded-[132px] lg:left-[11%] lg:top-[18%] lg:w-[40.81%]" />
      </div>
    </div>
  );
};

export default Login;
