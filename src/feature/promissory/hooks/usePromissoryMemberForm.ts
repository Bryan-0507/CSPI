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
      montoDeudaAnterior: null,
      tasaInteresAnual: 12,
      totalIntereses: null,
      totalAPagar: null,

      fechaInicioPeriodo: null,
      fechaFinPeriodo: null,

      cantidadCuotas: undefined as unknown as number,
      montoCuota: undefined as unknown as number,

      mesInicioIntereses: today.getMonth() + 1,
      anioInicioIntereses: today.getFullYear(),

      mesPrimeraCuota: today.getMonth() + 1,
      anioPrimeraCuota: today.getFullYear(),
      diaPagoMensual: 5,

      ciudadFirma: "Guatemala",
      diaFirma: today.getDate(),
      mesFirma: today.getMonth() + 1,
      anioFirma: today.getFullYear(),

      diaAutorizacionJD: today.getDate(),
      mesAutorizacionJD: today.getMonth() + 1,
      anioAutorizacionJD: today.getFullYear(),

      tieneFiadores: false,
      fiadores: [],

      ...initialValues,
    },
  })

  return form
}