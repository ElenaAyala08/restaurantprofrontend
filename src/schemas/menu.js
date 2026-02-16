import { z } from 'zod';

export const menuZodSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),

  descripcion: z
    .string({ required_error: 'La descripción es obligatoria' })
    .min(1, 'La descripción es obligatoria'),

    precio: z.coerce.number({
    required_error: 'El precio es obligatorio'
  }).min(0, 'El precio no puede ser negativo'),

 categoria: z
    .string({ required_error: 'La categoría es obligatoria' })
    .min(1, 'La categoría es obligatoria')

});
