import * as z from "zod";

export const registerationSchema = z.object({
  name: z.string().min(2, { error: "Name must be valid" }),
  mobile: z.string().min(10, "Enter a valid mobile number").max(10),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "atleast 8 characters required"),
  age: z.string().regex(/^\d+$/, "Age must be a number"),
  doctor: z.string().min(2, "Name must be valid"),
  gender: z.literal(["male", "female"], "Gender is required"),
  // gender: z.string().min(2, "Name must be at least 2 characters"),
});

export const loginSchema = z.object({
  mobile: z.string().min(10, "Enter a valid mobile number").max(10),
  password: z.string().min(8, "atleast 8 characters required"),
});
