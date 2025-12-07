"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/features/auth/authApi";
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

export default function RegisterPage() {
  const [input, setInput] = useState({ name: "", email: "", password: "" });
  const [registerUser, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const data = await registerUser(input).unwrap();
      
      // Save both token and user data (same as login)
      dispatch(setAuth({
        token: data.token,
        user: data.user
      }));
      
      toast.success("Registration successful! Welcome!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 py-24">
        <Card className="w-full max-w-md border border-border shadow-md bg-card/40 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Register</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <FieldGroup>
                <FieldSet>
                  <FieldLegend className="text-center">Create new account</FieldLegend>
                  <FieldDescription className="text-center">
                    Fill in the details to create your new account
                  </FieldDescription>

                  <FieldGroup className="mt-4">
                    <Field>
                      <FieldLabel htmlFor="register-name">Full Name</FieldLabel>
                      <Input
                        id="register-name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={input.name}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="register-email">Email</FieldLabel>
                      <Input
                        id="register-email"
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={input.email}
                        onChange={handleChange}
                        required
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="register-password">Password</FieldLabel>
                      <Input
                        id="register-password"
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
                    onClick={handleRegister}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </FieldGroup>

                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <span
                    className="text-primary cursor-pointer hover:underline font-medium"
                    onClick={() => router.push("/login")}
                  >
                    Login here
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