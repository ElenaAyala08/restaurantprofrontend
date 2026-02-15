import { z } from 'zod';

const pedidoItemSchema = z.object({
  nombre: z.string(),
  precio: z.number(),
  cantidad: z.number(),
  categoria: z.string().optional(),
  descripcion: z.string().optional()
});

export const pedidoZodSchema = z.object({
  mesa: z
    .string({ required_error: 'La mesa es obligatoria' }),

  items: z
    .array(pedidoItemSchema, { required_error: 'Debe agregar al menos un item' })
    .min(1, 'Debe agregar al menos un item')
});
