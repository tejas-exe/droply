"use client";
import "../app/global.css";
import { signInSchema } from "@/schema/signupSchema";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";

const SignInForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0E17] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-[#1F1B2E] border border-[#A786DF] p-8 shadow-neonPink">
        <h2 className="text-3xl font-bold text-[#A786DF] text-center mb-4 drop-shadow-neonPurple">
          Sign In
        </h2>
        <p className="text-[#C3B1E1] text-sm text-center mb-6">
          Welcome back, enter your credentials
        </p>

        <div
          className={
            isSubmitting
              ? "opacity-50 pointer-events-none blur-sm transition"
              : "transition"
          }
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm text-[#C3B1E1] mb-1">
                Email or Username
              </label>
              <input
                type="text"
                {...register("identifier")}
                className="w-full rounded-lg bg-[#2A233E] text-[#FCEAFF] border border-[#A786DF] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] shadow-neonPink transition"
                placeholder="you@example.com"
              />
              {errors.identifier && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#C3B1E1] mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full rounded-lg bg-[#2A233E] text-[#FCEAFF] border border-[#A786DF] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] shadow-neonPink transition"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
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
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="text-[#C3B1E1] text-center text-sm mt-6">
          Don’t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-[#FF6EC7] hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
