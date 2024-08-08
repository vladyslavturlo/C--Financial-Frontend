import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useCallback, useState, useMemo } from 'react'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import { RiEyeCloseLine } from 'react-icons/ri'

export type InputProps = {
  label: string
  type: string
  placeholder: string
  name?: string
  isRequired?: boolean
  error?: string
  isInvalid?: boolean
  value: string
  setValue: (val: string) => void
}

export default function InputField(props: InputProps) {
  const {
    label,
    type,
    name,
    placeholder,
    isRequired,
    isInvalid,
    error,
    value,
    setValue,
  } = props
  const textColor = useColorModeValue('navy.700', 'white')
  const textColorSecondary = 'gray.400'
  const brandStars = useColorModeValue('brand.500', 'brand.400')
  const borderColor = useColorModeValue(
    'secondaryGray.100',
    'rgba(135, 140, 189, 0.3)'
  )
  const [show, setShow] = useState(false)

  const _type = useMemo(() => {
    if (type === 'password') {
      return show ? 'text' : 'password'
    }
    return type
  }, [type, show])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
    },
    [setValue]
  )
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

      <InputGroup size="md">
        <Input
          isRequired={isRequired}
          borderColor={isInvalid ? 'red.300' : borderColor}
          variant="auth"
          fontSize="sm"
          type={_type}
          name={name}
          placeholder={placeholder}
          fontWeight="500"
          size="lg"
          value={value}
          onChange={handleChange}
        />
        {type === 'password' && (
          <InputRightElement display="flex" alignItems="center" mt="4px">
            <Icon
              color={textColorSecondary}
              _hover={{ cursor: 'pointer' }}
              as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
              onClick={() => setShow(!show)}
            />
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage ms="4px" fontWeight="500" fontSize="sm">
        {error}
      </FormErrorMessage>
    </FormControl>
  )
}
