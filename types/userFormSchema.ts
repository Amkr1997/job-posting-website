import * as z from "zod";

// Single schema with optional fields for signup/signin
export const usersFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be 8 characters" })
      .optional(),
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

export type usersFormSchemaType = z.infer<typeof usersFormSchema>;

export type usersFormErrors = Partial<
  Record<keyof usersFormSchemaType, string[]>
>;
