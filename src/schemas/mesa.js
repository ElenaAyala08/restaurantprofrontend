import { z } from 'zod';

export const mesaZodSchema = z.object({
  numero: z
    .number({ required_error: 'El número de mesa es obligatorio' }),

  capacidad: z
    .number({ required_error: 'La capacidad es obligatoria' }),

  estado: z
    .string()
    .optional()
});
