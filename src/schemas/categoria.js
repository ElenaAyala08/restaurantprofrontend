import { z } from 'zod';

export const categoriaZodSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre no puede estar vacío'),

  descripcion: z
    .string({ required_error: 'La descripción es obligatoria' })
    .min(5, 'La descripción debe tener al menos 5 caracteres')
});