"use client";
import "../app/global.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card, CardBody, CardFooter, Input } from "@heroui/react";
import { signUpSchema } from "@/schema/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [verificationCode, setVerificationCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (error: any) {
      setError(
        error.errors?.[0]?.message ||
          "An error occurred during sign-up. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        setVerificationError("Verification failed. Please try again.");
      }
    } catch (error: any) {
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occurred during verification. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg bg-[#2A233E] text-[#FCEAFF] border border-[#A786DF] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] shadow-neonPink transition";

  const errorClass = "text-red-400 mt-1 text-sm";

  return (
    <div className="min-h-screen bg-[#0F0E17] flex items-center justify-center text-[#A786DF] px-4">
      <Card className="w-full max-w-md bg-[#1F1B2E] border border-[#A786DF] shadow-[0_0_15px_#FF6EC7] rounded-lg">
        <CardBody content="form" className="px-8 py-10">
          <div
            className={
              isSubmitting ? "opacity-50 blur-sm pointer-events-none" : ""
            }
          >
            {verifying ? (
              <form
                onSubmit={handleVerificationSubmit}
                className="space-y-6"
                aria-busy={isSubmitting}
              >
                <Input
                  label="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={inputClass}
                />
                {verificationError && (
                  <div className="bg-red-900 text-red-300 p-4 rounded-lg shadow-md">
                    {verificationError}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FF6EC7] text-black font-bold hover:bg-[#F429A5] shadow-neonPink flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  )}
                  {isSubmitting ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                aria-busy={isSubmitting}
              >
                <Input
                  placeholder="Email"
                  type="email"
                  {...register("email")}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message}
                  className={inputClass}
                />
                {!!errors.email && (
                  <p className={errorClass}>{errors.email?.message}</p>
                )}

                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  className={inputClass}
                />
                {!!errors.password && (
                  <p className={errorClass}>{errors.password?.message}</p>
                )}

                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...register("passwordConfirmation")}
                  isInvalid={!!errors.passwordConfirmation}
                  errorMessage={errors.passwordConfirmation?.message}
                  className={inputClass}
                />
                {!!errors.passwordConfirmation && (
                  <p className={errorClass}>
                    {errors.passwordConfirmation?.message}
                  </p>
                )}

                {error && (
                  <div className="bg-red-900 text-red-300 p-4 rounded-lg shadow-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FF6EC7] text-black font-bold hover:bg-[#F429A5] shadow-neonPink flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin h-5 w-5 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  )}
                  {isSubmitting ? "Signing Up..." : "Sign Up"}
                </Button>
              </form>
            )}
          </div>
        </CardBody>

        {!verifying && (
          <CardFooter className="flex justify-center py-4 border-t border-[#A786DF]">
            <p className="text-sm text-[#C3B1E1]">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#FF6EC7] hover:underline font-semibold"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SignUpForm;
