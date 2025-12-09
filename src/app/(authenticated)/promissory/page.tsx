"use client"

import { useEffect } from "react"
import { FormProvider, useFieldArray } from "react-hook-form"
import { usePromissoryMemberForm } from "@/feature/promissory/hooks/usePromissoryMemberForm"
import { usePromissoryMemberDocument } from "@/feature/promissory/hooks/usePromissoryMemberDocument"
import type { PagareSocioFormValues } from "@/feature/promissory/types/promissoryMember.type"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/shared/InputField"
import { DateField } from "@/components/shared/DateField"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Hash,
  User2,
  FileText,
  MapPin,
  CalendarClock,
  AlertTriangle,
  Activity,
  Clock,
  UserCircle,
  Shield,
  UserPlus,
  Trash2,
} from "lucide-react"

export default function PromissoryPage() {
  const form = usePromissoryMemberForm()
  const { handleSubmit, watch, setValue, control, formState } = form

  const { downloadWord, isGenerating } = usePromissoryMemberDocument()

  const handleDownloadWord = handleSubmit((values) =>
    downloadWord(values as unknown as PagareSocioFormValues)
  )

  const tieneFiadores = watch("tieneFiadores")

  const {
    fields: fiadorFields,
    append: appendFiador,
    remove: removeFiador,
  } = useFieldArray({
    control,
    name: "fiadores",
  })

  useEffect(() => {
    if (tieneFiadores && fiadorFields.length === 0) {
      appendFiador({ nombreCompleto: "", dpi: "", direccion: "" })
    }

    if (!tieneFiadores && fiadorFields.length > 0) {
      setValue("fiadores", [], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })
    }
  }, [tieneFiadores, fiadorFields.length, appendFiador, setValue])

  const onSubmit = handleSubmit((values) => {
    console.log("Pagaré socio:", values)
  })

  return (
    <main className="flex flex-col w-full mt-8 px-2 md:px-4 lg:px-12">
      <h1 className="text-4xl font-bold mb-8">Información de Pagaré Miembro</h1>

      <Card className="px-4">
        <CardHeader className="px-0">
          <CardTitle className="text-xl font-semibold">
            Datos para generar el pagaré
          </CardTitle>
          <CardDescription className="text-sm text-black font-medium">
            Completa la siguiente información para generar el pagaré del miembro.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-6">
          <FormProvider {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
              {/* Sección: Datos del socio */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Datos del socio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <InputField
                    name="numeroPagare"
                    label="Número de pagaré"
                    placeholder="Ej. 01-2024"
                    icon={<Hash className="w-4 h-4" />}
                  />
                  <InputField
                    name="nombreSocio"
                    label="Nombre completo del socio"
                    placeholder="Nombre del miembro"
                    icon={<User2 className="w-4 h-4" />}
                  />
                  <InputField
                    name="dpiSocio"
                    label="DPI del socio"
                    placeholder="Número de DPI"
                    icon={<FileText className="w-4 h-4" />}
                    visualType="dpi"
                  />
                  <InputField
                    name="direccionSocio"
                    label="Dirección del socio"
                    multiline
                    rows={3}
                    placeholder="Dirección para notificaciones"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                </div>
              </section>

              {/* Sección: Datos del préstamo */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Datos del préstamo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <InputField
                    name="montoPrestamo"
                    label="Monto del préstamo (capital)"
                    placeholder="Ej. 25,000.00"
                    icon={<Activity className="w-4 h-4" />}
                    visualType="money"
                  />
                  <InputField
                    name="montoDeudaAnterior"
                    label="Deuda anterior (opcional)"
                    placeholder="Ej. 5,000.00"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    visualType="money"
                  />
                  <InputField
                    name="tasaInteresAnual"
                    label="Tasa de interés anual (%)"
                    placeholder="Ej. 12"
                    icon={<Activity className="w-4 h-4" />}
                  />
                  <InputField
                    name="totalIntereses"
                    label="Total intereses"
                    placeholder="Ej. 3,000.00"
                    visualType="money"
                  />
                </div>
              </section>

              {/* Sección: Período del préstamo (opcional) */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Período del préstamo (opcional)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <DateField
                    name="fechaInicioPeriodo"
                    label="Fecha de inicio del período"
                    placeholder="Selecciona fecha de inicio"
                    icon={<CalendarClock className="w-4 h-4" />}
                  />
                  <DateField
                    name="fechaFinPeriodo"
                    label="Fecha de fin del período"
                    placeholder="Selecciona fecha de fin"
                    icon={<CalendarClock className="w-4 h-4" />}
                  />
                </div>
              </section>

              {/* Sección: Plan de pagos */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Plan de pagos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <InputField
                    name="cantidadCuotas"
                    label="Cantidad de cuotas"
                    placeholder="Ej. 60"
                    icon={<Clock className="w-4 h-4" />}
                  />
                  <InputField
                    name="montoCuota"
                    label="Monto de cada cuota"
                    placeholder="Ej. 500.00"
                    visualType="money"
                  />
                  <InputField
                    name="mesInicioIntereses"
                    label="Mes inicio intereses (1-12)"
                    placeholder="Ej. 1"
                  />
                  <InputField
                    name="anioInicioIntereses"
                    label="Año inicio intereses"
                    placeholder="Ej. 2024"
                  />
                  <InputField
                    name="mesPrimeraCuota"
                    label="Mes primera cuota (1-12)"
                    placeholder="Ej. 2"
                  />
                  <InputField
                    name="anioPrimeraCuota"
                    label="Año primera cuota"
                    placeholder="Ej. 2024"
                  />
                  <InputField
                    name="diaPagoMensual"
                    label="Día límite de pago mensual"
                    placeholder="Ej. 5"
                  />
                </div>
              </section>

              {/* Sección: Datos de firma */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Datos de firma y autorización</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <InputField
                    name="ciudadFirma"
                    label="Ciudad de firma"
                    placeholder="Ej. Guatemala"
                    icon={<MapPin className="w-4 h-4" />}
                  />
                  <DateField
                    name="fechaFirma"
                    label="Fecha de firma"
                    placeholder="Selecciona la fecha de firma"
                    icon={<CalendarClock className="w-4 h-4" />}
                  />
                  <DateField
                    name="fechaAutorizacionJD"
                    label="Fecha de autorización Junta Directiva"
                    placeholder="Selecciona la fecha de autorización"
                    icon={<CalendarClock className="w-4 h-4" />}
                  />
                </div>
              </section>

              {/* Sección: Fiadores */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Fiadores (opcional)</h2>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="tieneFiadores"
                    checked={!!tieneFiadores}
                    onCheckedChange={(val) => setValue("tieneFiadores", Boolean(val), { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                  />
                  <label htmlFor="tieneFiadores" className="text-sm font-medium cursor-pointer">
                    Este pagaré tiene fiadores
                  </label>
                </div>

                {tieneFiadores && (
                  <div className="space-y-4">
                    {/* Error a nivel de array por el refine de Zod */}
                    {formState.errors.fiadores?.message && (
                      <p className="text-red-600 text-xs">
                        {formState.errors.fiadores?.message as string}
                      </p>
                    )}

                    {fiadorFields.map((fiador, index) => (
                      <div key={fiador.id} className="space-y-3">
                        {index > 0 && (
                          <div className="h-px w-full bg-gray-200" />
                        )}

                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">
                            Fiador {index + 1}
                          </p>

                          {fiadorFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFiador(index)}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:scale-105 transition-all cursor-pointer p-0 h-8"
                            >
                              <Trash2 className="w-3 h-3" />
                              Eliminar
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          <InputField
                            name={`fiadores.${index}.nombreCompleto`}
                            label="Nombre completo del fiador"
                            placeholder="Nombre del fiador"
                            icon={<UserCircle className="w-4 h-4" />}
                          />
                          <InputField
                            name={`fiadores.${index}.dpi`}
                            label="DPI del fiador"
                            placeholder="Número de DPI"
                            icon={<Shield className="w-4 h-4" />}
                            visualType="dpi"
                          />
                          <InputField
                            name={`fiadores.${index}.direccion`}
                            label="Dirección del fiador"
                            multiline
                            rows={3}
                            placeholder="Dirección del fiador"
                            icon={<MapPin className="w-4 h-4" />}
                          />
                        </div>
                      </div>
                    ))}

                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center gap-2 cursor-pointer hover:bg-slate-200"
                        onClick={() =>
                          appendFiador({
                            nombreCompleto: "",
                            dpi: "",
                            direccion: "",
                          })
                        }
                      >
                        <UserPlus className="w-4 h-4" />
                        Agregar fiador
                      </Button>
                    </div>
                  </div>
                )}
              </section>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isGenerating}
                  onClick={handleDownloadWord}
                  className="flex items-center gap-2 border-1 border-[#2f7998] text-[#2f7998] font-semibold cursor-pointer transition-transform duration-150 hover:scale-102 hover:bg-[#e3f3fa] hover:text-[#2f7998]"
                >
                  <span className="w-5 h-5" dangerouslySetInnerHTML={{ __html: `
    <svg fill="#2f7998" version="1.1" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 470.586 470.586" stroke="#2f7998">
      <g><g>
        <path d="M327.081,0H90.234c-15.9,0-28.854,12.959-28.854,28.859v412.863c0,15.924,12.953,28.863,28.854,28.863H380.35
          c15.917,0,28.855-12.939,28.855-28.863V89.234L327.081,0z M333.891,43.184l35.996,39.121h-35.996V43.184z M384.972,441.723
          c0,2.542-2.081,4.629-4.634,4.629H90.234c-2.551,0-4.62-2.087-4.62-4.629V28.859c0-2.548,2.069-4.613,4.62-4.613h219.41v70.181
          c0,6.682,5.444,12.099,12.129,12.099h63.198V441.723z M131.858,161.048l-25.29-99.674h18.371l11.688,49.795
          c1.646,6.954,3.23,14.005,4.592,20.516c1.555-6.682,3.425-13.774,5.272-20.723l13.122-49.583h16.863l11.969,49.929
          c1.552,6.517,3.094,13.243,4.395,19.742c1.339-5.784,2.823-11.718,4.348-17.83l0.562-2.217l12.989-49.618h17.996l-28.248,99.673
          h-16.834l-12.395-51.173c-1.531-6.289-2.87-12.052-3.975-17.693c-1.292,5.618-2.799,11.366-4.643,17.794l-13.964,51.072h-16.819
          V161.048z M242.607,139.863h108.448c5.013,0,9.079,4.069,9.079,9.079c0,5.012-4.066,9.079-9.079,9.079H242.607
          c-5.012,0-9.079-4.067-9.079-9.079C233.529,143.933,237.596,139.863,242.607,139.863z M360.135,209.566
          c0,5.012-4.066,9.079-9.079,9.079H125.338c-5.012,0-9.079-4.067-9.079-9.079c0-5.013,4.066-9.079,9.079-9.079h225.718
          C356.068,200.487,360.135,204.554,360.135,209.566z M360.135,263.283c0,5.012-4.066,9.079-9.079,9.079H125.338
          c-5.012,0-9.079-4.067-9.079-9.079c0-5.013,4.066-9.079,9.079-9.079h225.718C356.068,254.204,360.135,258.271,360.135,263.283z
          M360.135,317c0,5.013-4.066,9.079-9.079,9.079H125.338c-5.012,0-9.079-4.066-9.079-9.079c0-5.012,4.066-9.079,9.079-9.079h225.718
          C356.068,307.921,360.135,311.988,360.135,317z M360.135,371.474c0,5.013-4.066,9.079-9.079,9.079H125.338
          c-5.012,0-9.079-4.066-9.079-9.079s4.066-9.079,9.079-9.079h225.718C356.068,362.395,360.135,366.461,360.135,371.474z"/>
      </g></g>
    </svg>
  ` }} />
                  Descargar Word
                </Button>
                </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </main>
  )
}