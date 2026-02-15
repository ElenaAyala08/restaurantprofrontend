import { z } from 'zod';

export const reporteZodSchema = z.object({
  rango: z
    .string()
    .optional()
    .refine(
      (val) => !val || ['hoy', 'semana', 'mes', 'todo'].includes(val),
      { message: 'El rango debe ser hoy, semana, mes o todo' }
    )
});
