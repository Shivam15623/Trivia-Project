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

import logError from "@/utills/logError";
import { showSuccess } from "@/components/toastUtills";
import { RenderField } from "@/components/renderFields";
import { LoginSchema, LoginValues } from "@/SchemaValidations/AuthSchema";
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

  const [login] = useLoginUserMutation(); // ⛳️ Change if needed

  const handleLogin = async (data: LoginValues) => {
    try {
      const response = await login(data).unwrap();

      if (response.statuscode === 200) {
        showSuccess(response.message);
        dispatch(
          setLoggedIn({
            UserData: response.data.user,
            accessToken: response.data.accessToken,
          })
        );
      }
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div className=" flex items-center patt min-h-screen justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center py-6">
          <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
          <p className="text-sm text-gray-500">Welcome back! Please log in.</p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-6"
            >
              <RenderField
                control={form.control}
                label="Email"
                name="email"
                type="email"
                inputProps={{
                  placeholder: "you@example.com",
                  required: true,
                }}
              />

              <RenderField
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
                <a
                  href="/reset-request-password"
                  className="text-blue-600 hover:underline font-medium text-sm text-right"
                >
                  forgot Password?
                </a>
              </p>

              <CardFooter className="pt-4 flex flex-col gap-2">
                <Button type="submit" className="w-full">
                  Log In
                </Button>
                <p className="text-sm text-center text-gray-600">
                  Don’t have an account?{" "}
                  <a
                    href="/Signup"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Create one
                  </a>
                </p>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
