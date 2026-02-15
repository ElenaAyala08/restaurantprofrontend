import { z } from 'zod';

export const menuZodSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),

  descripcion: z
    .string()
    .optional(),

  precio: z
    .number({ required_error: 'El precio es obligatorio' }),

  categoria: z
    .string({ required_error: 'La categoría es obligatoria' })
});
