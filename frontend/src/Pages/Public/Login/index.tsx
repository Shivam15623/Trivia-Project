import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { useLoginUserMutation } from "@/services";

import { useDispatch } from "react-redux";
import { setLoggedIn } from "@/redux/AuthSlice/authSlice";

import { handleApiError } from "@/utills/handleApiError";
import { showSuccess } from "@/components/toastUtills";
import { RenderField } from "@/components/FormRender/renderFields";
import { LoginSchema, LoginValues } from "@/SchemaValidations/AuthSchema";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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

  const [login] = useLoginUserMutation(); // ⛳️ Change if needed

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
    <div className=" flex items-center patt min-h-screen justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl overflow-hidden p-0 space-y-0 gap-0">
        <CardHeader className="bg-gradient-to-r from-[#ff100f] to-[#ffc070] p-6 text-center">
          <div className="bg-white/90 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <User className="w-10 h-10 text-[#e34b4b]" />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-2 text-[#e34b4b]">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Sign in to your account to continue
          </p>
          <Form {...form}>
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
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#fcbf49] to-[#f29e4e] text-white font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                Log In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-[#fff8f0] p-4 text-center border-t border-orange-100">
          <p className="text-sm text-gray-600 mx-auto">
            Don't have an account?
            <Link
              to="/signup"
              className="text-[#e34b4b]  hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
