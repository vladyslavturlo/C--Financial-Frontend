import { InputProps } from 'components/fields/InputField'
import React from 'react'
import z from 'zod'

export default function useInput(props: {
  label: string
  type: string
  name?: string
  placeholder: string
  isRequired?: boolean
  schema: z.ZodString
}): [(msg: string | null) => void, InputProps] {
  const { label, type, name, placeholder, isRequired, schema } = props
  const [value, setValue] = React.useState('')
  const [isInvalid, setInvalid] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const setErrorMessage = React.useCallback((msg: string | null) => {
    setError(msg)
    setInvalid(msg !== null)
  }, [])

  const setInputValue = React.useCallback(
    (val: string) => {
      setValue(val)
      const result = schema.safeParse(val)
      setErrorMessage(
        result.success === true ? null : result.error.issues[0].message
      )
    },
    [schema, setErrorMessage]
  )

  const inputProps = React.useMemo((): InputProps => {
    return {
      type,
      label,
      name,
      placeholder,
      isRequired,
      error,
      isInvalid,
      value,
      setValue: setInputValue,
    }
  }, [
    error,
    isInvalid,
    isRequired,
    label,
    placeholder,
    setInputValue,
    name,
    type,
    value,
  ])

  return [setErrorMessage, inputProps]
}
