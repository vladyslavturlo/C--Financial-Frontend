// Chakra imports
import {
  Grid,
  Text,
  useColorModeValue,
  useBoolean,
  useToast,
  Button,
  Spinner,
} from '@chakra-ui/react'
// Custom components
import Card from 'components/card/Card'
import InputField from 'components/fields/InputField'
import useInput from 'hooks/useInput'
import {
  emailProps,
  firstNameProps,
  lastNameProps,
  usernameProps,
} from 'variables/inputProps'
import { useCallback, useMemo, useEffect, useContext } from 'react'
import { http } from 'utils/http'
import { UserContext } from 'App'

// Assets
export default function Account() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white')
  const textColorSecondary = 'gray.400'
  const [setEmailError, emailInputProps] = useInput(emailProps)
  const email = emailInputProps.value
  const [setUsernameError, usernameInputProps] = useInput(usernameProps)
  const username = usernameInputProps.value
  const [, firstNameInputProps] = useInput(firstNameProps)
  const firstName = firstNameInputProps.value
  const [, lastNameInputProps] = useInput(lastNameProps)
  const lastName = lastNameInputProps.value
  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()

  const submitStatus = useMemo(
    () =>
      isResponse ||
      !email ||
      emailInputProps.isInvalid ||
      usernameInputProps.isInvalid ||
      !username ||
      !firstName ||
      !lastName,
    [
      isResponse,
      emailInputProps.isInvalid,
      usernameInputProps.isInvalid,
      email,
      username,
      firstName,
      lastName,
    ]
  )

  const toast = useToast()
  const { user, getUser } = useContext(UserContext)

  useEffect(() => {
    const [first, ...last] = user.name.split(' ')
    emailInputProps.setValue(user.email)
    usernameInputProps.setValue(user.username)
    firstNameInputProps.setValue(first)
    lastNameInputProps.setValue(last.join(' '))
  }, [])

  const updateProfile = useCallback(() => {
    const name = firstName + ' ' + lastName
    sendRequest()
    http
      .post('user/update', { email, username, name })
      .then(() => {
        getUser()
        toast({
          title: 'Success',
          description: 'Profile Updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .catch((res) => {
        switch (res.data.field) {
          case 'email':
            setEmailError(res.data.message)
            break
          case 'username':
            setUsernameError(res.data.message)
            break
          default:
            toast({
              title: 'An Error Occured',
              description: res.data.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            })
        }
      })
      .finally(receivedResponse)
  }, [
    email,
    firstName,
    getUser,
    lastName,
    receivedResponse,
    sendRequest,
    setEmailError,
    setUsernameError,
    toast,
    username,
  ])
  return (
    <Card>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Account Settings
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Here you can change user account information
      </Text>
      <Grid templateColumns={{ md: '1fr 1fr', base: '1fr' }} columnGap={6}>
        <InputField {...usernameInputProps} />
        <InputField {...emailInputProps} />
        <InputField {...firstNameInputProps} />
        <InputField {...lastNameInputProps} />
      </Grid>
      <Button variant="brand" onClick={updateProfile} disabled={submitStatus}>
        {isResponse && <Spinner mr="2" size="sm" />}Save Changes
      </Button>
    </Card>
  )
}
