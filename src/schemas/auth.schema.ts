import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    username: z.string().min(3, 'Username must be at least 3 characters.'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
  