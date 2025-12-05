"use client";

import { useState, useEffect } from "react";
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

export default function LoginPage() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loginUser, { data: loginData, isLoading, isSuccess, error }] = useLoginMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    await loginUser(input).unwrap();
  };

  useEffect(() => {
    if (isSuccess && loginData) {
      if (loginData.token) {
        localStorage.setItem("edly_token", loginData.token);
      }
      toast.success(loginData.message || "Login successful.");
      router.push("/");
    }

    if (error) {
      // @ts-ignore
      toast.error(error?.data?.message || "Login Failed");
    }
  }, [isSuccess, loginData, error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Navbar />
      <div className="w-full max-w-md">
        <form onSubmit={(e) => e.preventDefault()}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Login to your account</FieldLegend>
              <FieldDescription>
                Enter your credentials to access your account
              </FieldDescription>
              <FieldGroup>
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
            <FieldGroup className="pt-4">
              <Button 
                type="button" 
                onClick={handleLogin} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </FieldGroup>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
