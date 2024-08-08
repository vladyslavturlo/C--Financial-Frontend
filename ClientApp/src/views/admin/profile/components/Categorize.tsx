// Chakra imports
import {
  Grid,
  Text,
  useColorModeValue,
  useToast,
  Button,
  Spinner,
  useBoolean,
  Icon,
} from '@chakra-ui/react'
// Custom components
import Card from 'components/card/Card'
import { useCallback, useEffect, useState } from 'react'
import { http } from 'utils/http'
import NumberField from 'components/fields/NumberField'
import { MdMerge } from 'react-icons/md'

// Assets
export default function Categorize() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white')
  const textColorSecondary = 'gray.400'
  const toast = useToast()
  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()

  const [amount, setAmount] = useState('0.00')
  const amountInputProps = {
    suffix: '%',
    min: 0,
    max: 1000,
    step: 1,
    precision: 2,
    isRequired: true,
    placeholder: 'Input amount.',
    label: 'Amount percent(±)',
    value: amount,
    setValue: setAmount,
  }
  const [date, setDate] = useState('0')
  const dateInputProps = {
    suffix: ' days',
    min: 0,
    max: 30,
    step: 1,
    precision: 0,
    isRequired: true,
    placeholder: 'Date range.',
    label: 'Date range(±)',
    value: date,
    setValue: setDate,
  }

  useEffect(() => {
    http.get('user/categorize').then((res) => {
      setAmount(res.data.amount)
      setDate(res.data.date)
    })
  }, [])

  const updateSettings = useCallback(() => {
    http.post('user/change-categorize', { amount, date }).then((res) => {
      toast({
        title: 'Success',
        description: 'Categorization settings updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
    })
  }, [amount, date, toast])

  const reconsolidate = useCallback(() => {
    sendRequest()
    http
      .post('schedule/recategorize')
      .then((res) => {
        toast({
          title: 'Success',
          description: 'Your scheduled transactions have been consolidated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(receivedResponse)
  }, [receivedResponse, sendRequest, toast])
  return (
    <Card>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Categorization Settings
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Here you can change categorization rules.
      </Text>
      <Grid templateColumns={{ md: '1fr 1fr', base: '1fr' }} columnGap={6}>
        <NumberField {...amountInputProps} />
        <NumberField {...dateInputProps} />
      </Grid>
      <Button variant="brand" onClick={updateSettings} mb="5">
        {isResponse && <Spinner mr="2" size="sm" />}Save Changes
      </Button>
      <Button variant="brand" onClick={reconsolidate} isDisabled={isResponse}>
        {isResponse ? (
          <Spinner mr="2" size="sm" />
        ) : (
          <Icon as={MdMerge} mr="2" />
        )}
        Recategorize
      </Button>
    </Card>
  )
}
