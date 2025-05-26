import { z } from "zod";

/** ------------------------------
 *  Reusable Field-Level Schemas
 *  ------------------------------ */

export const email = z
    .string()
    .email({ message: "Please provide a valid email" })
    .min(1, { message: "Email too short" });

export const password = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" });

/** ------------------------------
 *  Utility Functions
 *  ------------------------------ */

function passwordsMatch(data: { password: string; passwordConfirmation: string }) {
    return data.password === data.passwordConfirmation;
}

/** ------------------------------
 *  Form Schemas
 *  ------------------------------ */

export const signUpSchema = z
    .object({
        email,
        password,
        passwordConfirmation: z
            .string()
            .min(1, { message: "Password confirmation is required" }),
    })
    .refine(passwordsMatch, {
        message: "Password and confirmation do not match",
        path: ["passwordConfirmation"],
    });

export const signInSchema = z.object({
    identifier: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please provide a valid email" }),
    password,
});
