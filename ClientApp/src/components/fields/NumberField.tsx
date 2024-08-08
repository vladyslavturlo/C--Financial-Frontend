import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

export type NumberInputProps = {
  label: string
  placeholder: string
  name?: string
  isRequired?: boolean
  error?: string
  isInvalid?: boolean
  value: string
  setValue: (val: string) => void
  suffix?: string
  min: number
  max: number
  step: number
  precision?: number
}

export default function NumberField(props: NumberInputProps) {
  const {
    label,
    name,
    placeholder,
    isRequired,
    isInvalid,
    error,
    value,
    setValue,
    suffix: _suffix,
    min,
    max,
    step,
    precision,
  } = props
  const textColor = useColorModeValue('navy.700', 'white')
  const brandStars = useColorModeValue('brand.500', 'brand.400')
  const borderColor = useColorModeValue(
    'secondaryGray.100',
    'rgba(135, 140, 189, 0.3)'
  )
  const suffix = _suffix ? _suffix : ''

  const format = (val: string) => `${val}${suffix}`
  const parse = (val: string) => val.replace(new RegExp(`${suffix}$`), '')
  const handleChange = (val: string) => setValue(parse(val))

  return (
    <FormControl isInvalid={isInvalid} mb={isInvalid ? '10px' : '36px'}>
      <FormLabel
        display="flex"
        ms="4px"
        fontSize="sm"
        fontWeight="500"
        color={textColor}
        mb="8px"
      >
        {label}
        {isRequired && <Text color={brandStars}>*</Text>}
      </FormLabel>

      <NumberInput
        onChange={handleChange}
        value={format(value)}
        precision={precision > 0 ? precision : 0}
        step={step}
        size="lg"
        min={min}
        max={max}
        fontWeight="500"
      >
        <NumberInputField
          textAlign="right"
          borderColor={isInvalid ? 'red.300' : borderColor}
          fontSize="sm"
          fontWeight="500"
          name={name}
          placeholder={placeholder}
          textColor={textColor}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <FormErrorMessage ms="4px" fontWeight="500" fontSize="sm">
        {error}
      </FormErrorMessage>
    </FormControl>
  )
}
