import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
