"use client";

import { useState, useEffect } from "react";
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

export default function RegisterPage() {
  const [input, setInput] = useState({ name: "", email: "", password: "" });
  const [registerUser, { data: registerData, isLoading, isSuccess, error }] = useRegisterMutation();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    await registerUser(input).unwrap();
  };

  useEffect(() => {
    if (isSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.");
      router.push("/login");
    }

    if (error) {
      // @ts-ignore
      toast.error(error?.data?.message || "Registration Failed");
    }
  }, [isSuccess, registerData, error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md">
        <form onSubmit={(e) => e.preventDefault()}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Create new account</FieldLegend>
              <FieldDescription>
                Fill in the details to create your new account
              </FieldDescription>
              <FieldGroup>
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
            <FieldGroup className="pt-4">
              <Button 
                type="button" 
                onClick={handleRegister} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </FieldGroup>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
