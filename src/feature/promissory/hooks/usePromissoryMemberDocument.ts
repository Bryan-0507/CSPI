// Updated implementation aligned to the latest schema and formatting rules.
"use client"

import { useState, useCallback } from "react"
import type { PagareSocioFormValues } from "../types/promissoryMember.type"
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  PageNumber,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from "docx"

function numeroEnteroEnLetras(n: number): string {
  if (n === 0) return "cero"
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ] as const
  const especiales10a19 = [
    "diez",
    "once",
    "doce",
    "trece",
    "catorce",
    "quince",
    "dieciséis",
    "diecisiete",
    "dieciocho",
    "diecinueve",
  ] as const
  const decenas = [
    "",
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ] as const
  const centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ] as const
  function grupoTresCifras(num: number): string {
    let resultado = ""
    const c = Math.floor(num / 100)
    const resto = num % 100
    if (c === 1 && resto === 0) {
      resultado = "cien"
    } else if (c > 0) {
      resultado = centenas[c]
    }
    if (resto > 0) {
      if (resultado) resultado += " "
      if (resto < 10) {
        resultado += unidades[resto]
      } else if (resto >= 10 && resto < 20) {
        resultado += especiales10a19[resto - 10]
      } else if (resto >= 20 && resto < 30) {
        if (resto === 20) {
          resultado += "veinte"
        } else {
          resultado += "veinti" + unidades[resto - 20]
        }
      } else {
        const d = Math.floor(resto / 10)
        const u = resto % 10
        resultado += decenas[d]
        if (u > 0) {
          resultado += " y " + unidades[u]
        }
      }
    }
    return resultado
  }
  let resultado = ""
  let numero = n
  const millones = Math.floor(numero / 1_000_000)
  if (millones > 0) {
    if (millones === 1) {
      resultado += "un millón"
    } else {
      resultado += grupoTresCifras(millones) + " millones"
    }
    numero = numero % 1_000_000
  }
  const miles = Math.floor(numero / 1_000)
  if (miles > 0) {
    if (resultado) resultado += " "
    if (miles === 1) {
      resultado += "mil"
    } else {
      resultado += grupoTresCifras(miles) + " mil"
    }
    numero = numero % 1_000
  }
  if (numero > 0) {
    if (resultado) resultado += " "
    resultado += grupoTresCifras(numero)
  }
  return resultado
}

function montoEnLetrasGTQ(valor: number): string {
  const entero = Math.floor(valor)
  const centavos = Math.round((valor - entero) * 100)
  const letrasEntero = numeroEnteroEnLetras(entero)
  const centavosTxt = centavos.toString().padStart(2, "0")
  const letrasTitleCase = letrasEntero
    .split(" ")
    .filter((w) => w.length > 0)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
  return `${letrasTitleCase} Quetzales con ${centavosTxt}/100`
}

function formatCurrencyGTQ(value: number): string {
  const formatted = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
  }).format(value)
  // Asegurar formato tipo "Q. 1,234.56"
  return formatted.replace(/^Q/, "Q.")
}

function monthNumberToName(month: number): string {
  const names = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ] as const
  return names[month - 1] ?? ""
}

function formatDpiDisplay(raw: string): string {
  const digits = String(raw).replace(/\D/g, "").slice(0, 13)
  const p1 = digits.slice(0, 4)
  const p2 = digits.slice(4, 9)
  const p3 = digits.slice(9, 13)
  return [p1, p2, p3].filter(Boolean).join(" ")
}

function formatLongDate(date: Date): string {
  // Por ahora usamos un formato estándar en español.
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

function buildPromissoryDocument(values: PagareSocioFormValues): Document {
  const {
    numeroPagare,
    nombreSocio,
    dpiSocio,
    direccionSocio,
    montoPrestamo,
    montoDeudaAnterior,
    tasaInteresAnual,
    totalIntereses,
    cantidadCuotas,
    montoCuota,
    mesInicioIntereses,
    anioInicioIntereses,
    mesPrimeraCuota,
    anioPrimeraCuota,
    diaPagoMensual,
    ciudadFirma,
    fechaFirma,
    fechaAutorizacionJD,
    tieneFiadores,
    fiadores,
  } = values

  const montoPrestamoFmt = formatCurrencyGTQ(montoPrestamo)
  const tieneDeudaAnterior =
    typeof montoDeudaAnterior === "number" && montoDeudaAnterior > 0
  const montoDeudaAnteriorFmt = tieneDeudaAnterior
    ? formatCurrencyGTQ(montoDeudaAnterior)
    : null
  // Total intereses es requerido
  const totalInteresesFmt = formatCurrencyGTQ(totalIntereses)
  const totalInteresesLetras = montoEnLetrasGTQ(totalIntereses)
  // Total a pagar = monto del préstamo + total de intereses
  const totalAPagarValor = montoPrestamo + totalIntereses
  const totalAPagarFmt = formatCurrencyGTQ(totalAPagarValor)
  const totalAPagarLetras = montoEnLetrasGTQ(totalAPagarValor)
  const montoCuotaFmt = formatCurrencyGTQ(montoCuota)
  // Montos en letras
  const montoPrestamoLetras = montoEnLetrasGTQ(montoPrestamo)
  const montoDeudaAnteriorLetras = tieneDeudaAnterior
    ? montoEnLetrasGTQ(montoDeudaAnterior!)
    : null
  // Capital total (préstamo + deuda anterior si existe)
  const capitalTotal = tieneDeudaAnterior
    ? montoPrestamo + montoDeudaAnterior!
    : null
  const capitalTotalFmt =
    capitalTotal != null ? formatCurrencyGTQ(capitalTotal) : null
  const capitalTotalLetras =
    capitalTotal != null ? montoEnLetrasGTQ(capitalTotal) : null
  const fechaFirmaTexto = fechaFirma ? formatLongDate(fechaFirma) : ""
  const fechaAutorizacionTexto = fechaAutorizacionJD
    ? formatLongDate(fechaAutorizacionJD)
    : ""
  const tasaInteresStr = `${tasaInteresAnual.toFixed(2)}%`
  const dpiSocioFormatted = formatDpiDisplay(dpiSocio)

  // Página tamaño carta: 21.59 x 27.94 cm (8.5 x 11 pulgadas)
  // Márgenes: superior 1.6 cm, inferior 2.2 cm, izquierdo/derecho 2.9 cm
  // Convertido a twips (1 pulgada = 1440 twips)
  const pageWidth = 12240 // 8.5 * 1440
  const pageHeight = 15840 // 11 * 1440
  const marginTop = 907 // ~0.63" -> 1.6 cm
  const marginBottom = 1247 // ~0.87" -> 2.2 cm
  const marginLeft = 1644 // ~1.14" -> 2.9 cm
  const marginRight = 1644
  const children: Paragraph[] = []
  // Helper para runs en Calibri
  const run = (
    text: string,
    opts?: { bold?: boolean; italics?: boolean; size?: number; underline?: boolean }
  ) =>
    new TextRun({
      text,
      font: "Calibri",
      size: opts?.size ?? 20,
      bold: opts?.bold,
      italics: opts?.italics,
      underline: opts?.underline
        ? { type: UnderlineType.SINGLE }
        : undefined,
    })
  const blankLine = () =>
    new Paragraph({
      children: [run("")],
    })
  // 1) Encabezado: COOPERATIVA FAMILIAR (centrado, bold, Calibri 12)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [run("COOPERATIVA FAMILIAR", { bold: true, size: 24 })], // 12 pt
    })
  )
  // 2) Línea horizontal negra
  children.push(
    new Paragraph({
      border: {
        bottom: {
          color: "000000",
          size: 6,
          space: 1,
          style: BorderStyle.SINGLE,
        },
      },
    })
  )
  // 3) Línea de autorización (centrado, Calibri 12)
  const espaciosAutorizacion = " ".repeat(40)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        run(
          `Autorización de préstamos fiduciarios${espaciosAutorizacion}Por. ${montoPrestamoFmt}`,
          { size: 24 }
        ),
      ],
    })
  )
  // Línea en blanco
  children.push(blankLine())
  // 4) Título PAGARÉ + número (centrado, bold, Calibri 18)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        run(`PAGARÉ ${numeroPagare}`, { bold: true, size: 36 }), // 18 pt
      ],
    })
  )
  // Línea en blanco
  children.push(blankLine())
  // 5) Párrafo principal completo (deudor, fiadores si aplica, deuda, intereses y cuotas)
  const parrafoPrincipalRuns: TextRun[] = []

  // Descripción de fiadores (si existen)
  let descripcionFiadores = ""
  if (tieneFiadores && fiadores && fiadores.length > 0) {
    const partes: string[] = fiadores.map((fiador, index) => {
      const dpiFiadorFormatted = formatDpiDisplay(fiador.dpi)
      const base = `${fiador.nombreCompleto}, con domicilio en ${fiador.direccion}, que se identifica con Documento Personal de Identificación (DPI) número ${dpiFiadorFormatted}`
      if (index === 0) {
        return base
      } else if (index === fiadores.length - 1) {
        return `y de ${base}`
      } else {
        return base
      }
    })

    const sufijoFiador = fiadores.length > 1 ? "es" : ""
    descripcionFiadores =
      `, de forma de deudor y con el respaldo como fiador${sufijoFiador} de ` +
      partes.join(", ")
  }

  // Deudor + fiadores (si aplica) + monto recibido
  parrafoPrincipalRuns.push(
    run(
      `Yo, ${nombreSocio}, que me identifico con Documento Personal de Identificación (DPI) número ${dpiSocioFormatted}, con dirección para recibir notificaciones en ${direccionSocio}`,
      { size: 20 }
    )
  )

  if (descripcionFiadores) {
    parrafoPrincipalRuns.push(run(descripcionFiadores, { size: 20 }))
  }

  parrafoPrincipalRuns.push(
    run(
      ", por este medio hago constar que recibí la cantidad de ",
      { size: 20 }
    )
  )
  parrafoPrincipalRuns.push(run(montoPrestamoLetras, { bold: true, size: 20 }))
  parrafoPrincipalRuns.push(run(" (", { size: 20 }))
  parrafoPrincipalRuns.push(run(montoPrestamoFmt, { bold: true, size: 20 }))
  parrafoPrincipalRuns.push(run(")", { size: 20 }))
  parrafoPrincipalRuns.push(run(" en calidad de préstamo fiduciario", { size: 20 }))
  // Deuda anterior (si existe y es mayor a 0)
  if (
    tieneDeudaAnterior &&
    montoDeudaAnteriorFmt &&
    montoDeudaAnteriorLetras &&
    capitalTotal != null &&
    capitalTotalFmt &&
    capitalTotalLetras
  ) {
    parrafoPrincipalRuns.push(
      run(", que sumados a la deuda actual equivalente a ", { size: 20 })
    )
    parrafoPrincipalRuns.push(
      run(montoDeudaAnteriorLetras, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(" (", { size: 20 }))
    parrafoPrincipalRuns.push(
      run(montoDeudaAnteriorFmt, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(")", { size: 20 }))
    parrafoPrincipalRuns.push(
      run(", que sumados al presente préstamo suman una cantidad de ", {
        size: 20,
      })
    )
    parrafoPrincipalRuns.push(
      run(capitalTotalLetras, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(" (", { size: 20 }))
    parrafoPrincipalRuns.push(
      run(capitalTotalFmt, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(")", { size: 20 }))
  }
  // Intereses y total a pagar
  parrafoPrincipalRuns.push(
    run(
      ", por los cuales debo pagar los intereses al ",
      { size: 20 }
    )
  )
  // Porcentaje sin negrita, con 2 decimales
  parrafoPrincipalRuns.push(
    run(tasaInteresStr, { size: 20 })
  )
  parrafoPrincipalRuns.push(
    run(
      " anual, en forma mensual, a partir del mes de ",
      { size: 20 }
    )
  )
  parrafoPrincipalRuns.push(
    run(
      `${monthNumberToName(mesInicioIntereses)} de ${anioInicioIntereses}`,
      { size: 20 }
    )
  )
  if (totalInteresesFmt && totalInteresesLetras && totalAPagarFmt && totalAPagarLetras) {
    parrafoPrincipalRuns.push(run(", equivalentes a ", { size: 20 }))
    parrafoPrincipalRuns.push(
      run(totalInteresesLetras, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(" (", { size: 20 }))
    parrafoPrincipalRuns.push(
      run(totalInteresesFmt, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(")", { size: 20 }))
    parrafoPrincipalRuns.push(run(" haciendo un total de ", { size: 20 }))
    parrafoPrincipalRuns.push(
      run(totalAPagarLetras, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(" (", { size: 20 }))
    parrafoPrincipalRuns.push(
      run(totalAPagarFmt, { bold: true, size: 20 })
    )
    parrafoPrincipalRuns.push(run(")", { size: 20 }))
  }
  // Cuotas
  const montoCuotaLetras = montoEnLetrasGTQ(montoCuota)
  parrafoPrincipalRuns.push(
    run(
      " los cuales, junto a las amortizaciones del capital, me comprometo a cancelar sin requerimiento de cobro, en ",
      { size: 20 }
    )
  )
  parrafoPrincipalRuns.push(
    run(`${cantidadCuotas}`, { size: 20 })
  )
  parrafoPrincipalRuns.push(run(" cuota(s) de ", { size: 20 }))
  parrafoPrincipalRuns.push(
    run(montoCuotaLetras, { bold: true, size: 20 })
  )
  parrafoPrincipalRuns.push(run(" (", { size: 20 }))
  parrafoPrincipalRuns.push(
    run(montoCuotaFmt, { bold: true, size: 20 })
  )
  parrafoPrincipalRuns.push(run(")", { size: 20 }))
  parrafoPrincipalRuns.push(
    run(
      `, que se inician a pagar en el mes de ${monthNumberToName(
        mesPrimeraCuota
      )} de ${anioPrimeraCuota}, a más tardar el día ${diaPagoMensual} de cada mes siguiente de cada vencimiento, y deben ser depositadas en la cuenta bancaria que para el efecto se indique y convenga.`,
      { size: 20 }
    )
  )
  children.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: parrafoPrincipalRuns,
    })
  )
  children.push(blankLine())
  // Párrafo de mora
  children.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [
        run(
          "Hago constar que estoy enterado de la forma del cálculo de los intereses y que si en algún momento, por alguna razón tuviera atraso en los pagos a los cuales me comprometo, se me cargarán los intereses por mora o multas que la Junta Directiva determine, los cuales no podrán exceder del 5% sobre la cuota atrasada y en casos extremos autorizo para que la deuda se descuente de mi capital aportado.",
          { size: 20 }
        ),
      ],
    })
  )
  // Tres líneas en blanco
  children.push(blankLine())
  children.push(blankLine())
  children.push(blankLine())
  // Línea de ciudad y fecha
  if (ciudadFirma && fechaFirmaTexto) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          run(`En la ciudad de ${ciudadFirma}, a ${fechaFirmaTexto}.`, {
            size: 20,
          }),
        ],
      })
    )
  }
  // Dos líneas en blanco
  children.push(blankLine())
  children.push(blankLine())
  children.push(blankLine())
  // Firma de aceptado y, si aplica, firma quien avale (misma línea)
  const espaciosFirma = " ".repeat(50)
  const firmaChildren: TextRun[] = [run("Firma de aceptado", { size: 20 })]
  if (tieneFiadores && fiadores && fiadores.length > 0) {
    firmaChildren.push(run(espaciosFirma, { size: 20 }))
    firmaChildren.push(run("Firma quien avale este crédito", { size: 20 }))
  }
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: firmaChildren,
    })
  )
  children.push(blankLine())
  // AUTORIZACIÓN DE JUNTA DIRECTIVA (bold, italic, subrayado)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        run("AUTORIZACIÓN DE JUNTA DIRECTIVA", {
          bold: true,
          italics: true,
          underline: true,
          size: 20,
        }),
      ],
    })
  )
  // Una línea en blanco
  children.push(blankLine())
  children.push(blankLine())
  // Texto de autorización JD
  const autorizacionBody =
    fechaAutorizacionTexto.length > 0
      ? `Con fecha ${fechaAutorizacionTexto}, la Junta Directiva, representada por el Presidente y Tesorero de la Cooperativa Familiar, autoriza conceder el préstamo indicado.`
      : "La Junta Directiva, representada por el Presidente y Tesorero de la Cooperativa Familiar, autoriza conceder el préstamo indicado."
  children.push(
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      children: [run(autorizacionBody, { size: 20 })],
    })
  )
  // Dos líneas en blanco
  children.push(blankLine())
  children.push(blankLine())
  children.push(blankLine())
  // Presidente y Tesorero en la misma línea
  const espaciosPresidente = " ".repeat(62)
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        run("Presidente", { size: 20 }),
        run(espaciosPresidente, { size: 20 }),
        run("Tesorero", { size: 20 }),
      ],
    })
  )
  children.push(blankLine())
  children.push(blankLine())
  // Línea final: CONSTA DE UN (1) FOLIO (centrado)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        run("Consta de un (1) folio", { size: 20 }),
      ],
    })
  )
  return new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageWidth,
              height: pageHeight,
            },
            margin: {
              top: marginTop,
              bottom: marginBottom,
              left: marginLeft,
              right: marginRight,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    font: "Calibri",
                    size: 18,
                    children: [PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  })
}

export function usePromissoryMemberDocument() {
  const [isGenerating, setIsGenerating] = useState(false)
  const downloadWord = useCallback(
    async (values: PagareSocioFormValues) => {
      try {
        setIsGenerating(true)
        const doc = buildPromissoryDocument(values)
        const blob = await Packer.toBlob(doc)
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `PAGARE-${values.numeroPagare}.docx`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      } finally {
        setIsGenerating(false)
      }
    },
    []
  )
  return {
    downloadWord,
    isGenerating,
  }
}