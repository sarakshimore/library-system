"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setAuth } from "@/features/auth/authSlice";

export default function LoginPage() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loginUser, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const data = await loginUser(input).unwrap();
      
      // FIX: Save both token and user data
      dispatch(setAuth({
        token: data.token,
        user: data.user
      }));
      
      toast.success("Login successful");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md border border-border shadow-md bg-card/40 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold">Login</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend className="text-center">Login to your account</FieldLegend>
                  <FieldDescription className="text-center">
                    Enter your credentials to continue
                  </FieldDescription>

                  <FieldGroup className="mt-4">
                    <Field>
                      <FieldLabel htmlFor="login-email">Email</FieldLabel>
                      <Input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="patel@gmail.com"
                        value={input.email}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="login-password">Password</FieldLabel>
                      <Input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={input.password}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                  </FieldGroup>
                </FieldSet>

                <FieldGroup className="pt-6">
                  <Button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </FieldGroup>

                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <span
                    className="text-primary cursor-pointer hover:underline font-medium"
                    onClick={() => router.push("/register")}
                  >
                    Register here
                  </span>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}