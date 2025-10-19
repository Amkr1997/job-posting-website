import * as z from "zod";

// Single schema with optional fields for signup/signin
export const signUpUserSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be 8 characters" })
      .refine((val) => val !== "", {
        message: "Confirm password is required",
      }),
  })
  .refine(
    (data) => {
      // Only validate confirmPassword if it's provided (signup form)
      if (data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const signInUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be 8 characters" }),
});

export type signUpUserSchemaType = z.infer<typeof signUpUserSchema>;
export type signInUserSchemaType = z.infer<typeof signInUserSchema>;

export type signUpUserErrors = Partial<
  Record<keyof signUpUserSchemaType, string[]>
>;

export type signInUserErrors = Partial<
  Record<keyof signInUserSchemaType, string[]>
>;
