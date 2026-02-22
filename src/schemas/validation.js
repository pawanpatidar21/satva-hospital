import { z } from 'zod';

// Appointment Form Schema
export const appointmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\u0900-\u097F]+$/, 'Name should only contain letters and spaces'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Phone number should only contain digits and valid characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  service: z
    .string()
    .min(1, 'Please select a service'),
  date: z
    .string()
    .min(1, 'Please select a date')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Date must be today or in the future'),
  time: z
    .string()
    .min(1, 'Please select a time'),
  period: z
    .enum(['AM', 'PM'], {
      errorMap: () => ({ message: 'Period must be AM or PM' })
    }),
  message: z
    .string()
    .max(500, 'Message must not exceed 500 characters')
    .optional()
    .or(z.literal(''))
});

// Login Schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username must not exceed 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(100, 'Password must not exceed 100 characters')
});

// Admin Appointment Update Schema
export const appointmentUpdateSchema = z.object({
  date: z
    .string()
    .min(1, 'Please select a date')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Date must be today or in the future')
    .optional(),
  time: z
    .string()
    .min(1, 'Please select a time')
    .optional(),
  period: z
    .enum(['AM', 'PM'])
    .optional(),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal(''))
});

// Admin Create Appointment Schema (allows any date for walk-ins / back-dated entries)
export const appointmentCreateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s\u0900-\u097F]+$/, 'Name should only contain letters and spaces'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Phone number should only contain digits and valid characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  service: z
    .string()
    .min(1, 'Please select a service'),
  date: z
    .string()
    .min(1, 'Please select a date'),
  time: z
    .string()
    .min(1, 'Please select a time'),
  period: z
    .enum(['AM', 'PM'], { errorMap: () => ({ message: 'Period must be AM or PM' }) }),
  message: z
    .string()
    .max(500, 'Message must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['pending', 'confirmed', 'cancelled', 'completed'])
    .optional()
});

