"use client"

import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  pagareSocioSchema,
  PagareSocioFormValues,
} from "../types/promissoryMember.type"


export function usePromissoryMemberForm(
  initialValues?: Partial<PagareSocioFormValues>,
) {
  const today = new Date()

  const form = useForm<PagareSocioFormValues>({
    resolver: zodResolver(pagareSocioSchema) as Resolver<
      PagareSocioFormValues,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      PagareSocioFormValues
    >,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      numeroPagare: "",
      nombreSocio: "",
      dpiSocio: "",
      direccionSocio: "",

      montoPrestamo: undefined as unknown as number,
      montoDeudaAnterior: undefined as unknown as number,
      tasaInteresAnual: 12,
      totalIntereses: undefined as unknown as number,

      fechaInicioPeriodo: null,
      fechaFinPeriodo: null,

      cantidadCuotas: undefined as unknown as number,
      montoCuota: undefined as unknown as number,

      mesInicioIntereses: today.getMonth() + 1,
      anioInicioIntereses: today.getFullYear(),

      mesPrimeraCuota: today.getMonth() + 1,
      anioPrimeraCuota: today.getFullYear(),
      diaPagoMensual: 5,

      ciudadFirma: "Ciudad de Guatemala",
      fechaFirma: today,
      fechaAutorizacionJD: today,

      tieneFiadores: false,
      fiadores: [],

      ...initialValues,
    },
  })

  return form
}