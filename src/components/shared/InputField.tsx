'use client'

import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'

interface InputFieldProps {
  name: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  placeholder?: string
  multiline?: boolean
  rows?: number
}

export function InputField({ name, label, icon, disabled, placeholder, multiline, rows }: InputFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span>{label}</span>
     </label>

      {multiline ? (
        <textarea
          id={name}
          {...register(name)}
          rows={rows || 3}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full py-2.5 px-3 rounded-md border text-sm font-medium bg-white text-foreground disabled:bg-gray-50 disabled:text-gray-500"
        />
      ) : (
        <input
          id={name}
          {...register(name)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full py-2.5 px-3 rounded-md border text-sm font-medium bg-white text-foreground disabled:bg-gray-50 disabled:text-gray-500"
        />
      )}

      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  )
}