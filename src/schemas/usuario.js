import { z } from 'zod';

const usuarioBaseSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),

  email: z
    .string({ required_error: 'El email es obligatorio' })
    .email('El formato del email no es válido'),

  telefono: z
    .string()
    .optional(),

  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),

  confirmPassword: z
    .string({ required_error: 'Debe confirmar la contraseña' })
    .min(6, 'La confirmación debe tener al menos 6 caracteres'),

  rol: z
    .enum(['Administrador', 'Mesero', 'Cocinero'])
    .default('Mesero'),

  status: z
    .enum(['active', 'inactive'])
    .default('active'),
});


export const usuarioZodSchema = usuarioBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  }
);


export const loginSchema = usuarioBaseSchema.pick({
  email: true,
  password: true,
});

/* =====================================================
   CAMBIAR CONTRASEÑA
===================================================== */

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'La contraseña actual es obligatoria' })
    .min(6, 'Debe tener al menos 6 caracteres'),

  newPassword: z
    .string({ required_error: 'La nueva contraseña es obligatoria' })
    .min(6, 'Debe tener al menos 6 caracteres'),
});


export const usuarioWithoutPasswordSchema = usuarioBaseSchema.omit({
  password: true,
  confirmPassword: true,
});
