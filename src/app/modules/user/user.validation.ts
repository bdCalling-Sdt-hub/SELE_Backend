import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    confirmPassword: z.string({ required_error: 'Confirm Password is required' }),
    location: z.string({ required_error: 'Location is required' }),
    profile: z.string().optional(),
    description:z.string().optional(),
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
  description:z.string().optional()
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
