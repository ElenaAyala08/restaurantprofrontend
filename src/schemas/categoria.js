import { z } from 'zod';

export const categoriaZodSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),

  descripcion: z
    .string()
    .optional()
});
