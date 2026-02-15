import { z } from 'zod';

export const facturaZodSchema = z.object({
  pedidoId: z
    .string({ required_error: 'El pedido es obligatorio' })
    .min(1, 'El pedido es obligatorio'),

  metodoPago: z
    .string({ required_error: 'El método de pago es obligatorio' })
    .min(1, 'El método de pago es obligatorio')
});
