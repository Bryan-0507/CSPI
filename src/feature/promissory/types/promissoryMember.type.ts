import { z } from "zod";

export const fiadorSchema = z.object({
  nombreCompleto: z
    .string()
    .min(1, "El nombre del fiador es obligatorio"),
  dpi: z
    .string()
    .min(8, "El DPI del fiador es obligatorio"),
  direccion: z
    .string()
    .min(1, "La dirección del fiador es obligatoria"),
});

export const pagareSocioSchema = z
  .object({
    // Identificación del pagaré
    numeroPagare: z
      .string()
      .min(1, "El número de pagaré es obligatorio"), // ej. "01-2024"

    // Datos del socio (deudor)
    nombreSocio: z
      .string()
      .min(1, "El nombre del socio es obligatorio"),
    dpiSocio: z
      .string()
      .min(1, "El DPI del socio es obligatorio"),
    direccionSocio: z
      .string()
      .min(1, "La dirección del socio es obligatoria"),

    // Datos del préstamo
    montoPrestamo: z.coerce
      .number()
      .positive("El monto debe ser mayor que cero"),

    montoDeudaAnterior: z
      .coerce
      .number()
      .nonnegative("El monto no puede ser negativo")
      .optional()
      .nullable(),

    tasaInteresAnual: z.coerce
      .number()
      .min(0, "La tasa no puede ser negativa")
      .max(100, "La tasa no puede ser mayor a 100"),

    totalIntereses: z
      .coerce
      .number()
      .nonnegative("El valor no puede ser negativo")
      .optional()
      .nullable(),

    totalAPagar: z
      .coerce
      .number()
      .nonnegative("El valor no puede ser negativo")
      .optional()
      .nullable(),

    // Opcional: período del préstamo (para los pagarés viejos tipo 2018, 2020)
    fechaInicioPeriodo: z
        .date()
        .optional()
        .nullable(),

    fechaFinPeriodo: z
        .date()
        .optional()
        .nullable(),

    // Plan de pagos
    cantidadCuotas: z.coerce
      .number()
      .int("Debe ser un número entero")
      .positive("Debe ser mayor que cero"),

    montoCuota: z.coerce
      .number()
      .positive("Debe ser mayor que cero"),

    mesInicioIntereses: z.coerce
      .number()
      .int()
      .min(1, "Mes inválido")
      .max(12, "Mes inválido"),

    anioInicioIntereses: z.coerce
      .number()
      .int()
      .min(2000, "Año inválido"),

    mesPrimeraCuota: z.coerce
      .number()
      .int()
      .min(1, "Mes inválido")
      .max(12, "Mes inválido"),

    anioPrimeraCuota: z.coerce
      .number()
      .int()
      .min(2000, "Año inválido"),

    diaPagoMensual: z.coerce
      .number()
      .int()
      .min(1, "Día inválido")
      .max(31, "Día inválido"),

    // Datos formales
    ciudadFirma: z
      .string()
      .min(1, "La ciudad es obligatoria"),

    diaFirma: z.coerce
      .number()
      .int()
      .min(1)
      .max(31),

    mesFirma: z.coerce
      .number()
      .int()
      .min(1)
      .max(12),

    anioFirma: z.coerce
      .number()
      .int()
      .min(2000),

    diaAutorizacionJD: z.coerce
      .number()
      .int()
      .min(1)
      .max(31),

    mesAutorizacionJD: z.coerce
      .number()
      .int()
      .min(1)
      .max(12),

    anioAutorizacionJD: z.coerce
      .number()
      .int()
      .min(2000),

    // Fiadores / avales
    tieneFiadores: z.boolean().default(false),
    fiadores: z.array(fiadorSchema).default([]),
  })
  .refine(
    (data) => !data.tieneFiadores || data.fiadores.length > 0,
    {
      message: "Debes ingresar al menos un fiador",
      path: ["fiadores"],
    },
  )

export type Fiador = z.infer<typeof fiadorSchema>
export type PagareSocioFormValues = z.infer<typeof pagareSocioSchema>