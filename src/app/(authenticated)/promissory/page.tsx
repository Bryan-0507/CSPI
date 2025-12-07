"use client"

import { useEffect } from "react"
import { FormProvider, useFieldArray } from "react-hook-form"
import { usePromissoryMemberForm } from "@/feature/promissory/hooks/usePromissoryMemberForm"
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
                  />
                  <InputField
                    name="montoDeudaAnterior"
                    label="Deuda anterior (opcional)"
                    placeholder="Ej. 5,000.00"
                    icon={<AlertTriangle className="w-4 h-4" />}
                  />
                  <InputField
                    name="tasaInteresAnual"
                    label="Tasa de interés anual (%)"
                    placeholder="Ej. 12"
                    icon={<Activity className="w-4 h-4" />}
                  />
                  <InputField
                    name="totalIntereses"
                    label="Total intereses (opcional)"
                    placeholder="Ej. 3,000.00"
                  />
                  <InputField
                    name="totalAPagar"
                    label="Total a pagar (opcional)"
                    placeholder="Ej. 28,000.00"
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

              <div className="flex justify-end pt-4">
                <Button type="submit" className="min-w-[160px]">
                  Generar pagaré
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </main>
  )
}