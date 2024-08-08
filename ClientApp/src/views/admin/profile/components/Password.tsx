// Chakra imports
import {
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
import { useCallback, useMemo } from 'react'
import { http } from 'utils/http'
import { z } from 'zod'

// Assets
export default function Account() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white')
  const textColorSecondary = 'gray.400'

  const oldPasswordProps = {
    type: 'password',
    label: 'Old Password',
    name: 'old-password',
    isRequired: true,
    placeholder: 'Min. 8 characters',
    schema: z.string().min(8, { message: 'Password must be more than 8.' }),
  }
  const newPasswordProps = {
    type: 'password',
    label: 'New Password',
    name: 'new-password',
    isRequired: true,
    placeholder: 'Min. 8 characters',
    schema: z.string().min(8, { message: 'Password must be more than 8.' }),
  }
  const newPasswordConfirmProps = {
    type: 'password',
    label: 'New Password Confirm',
    isRequired: true,
    placeholder: 'Min. 8 characters',
    schema: z.string(),
  }
  // Setup Input fields
  const [setOldPasswordError, oldPasswordInputProps] =
    useInput(oldPasswordProps)
  const oldPassword = oldPasswordInputProps.value
  const [setNewPasswordError, newPasswordInputProps] =
    useInput(newPasswordProps)
  const newPassword = newPasswordInputProps.value
  const [, newPasswordConfirmInputProps] = useInput(newPasswordConfirmProps)
  const newPasswordConfirm = newPasswordConfirmInputProps.value

  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()

  const submitStatus = useMemo(
    () =>
      isResponse ||
      oldPasswordInputProps.isInvalid ||
      newPasswordInputProps.isInvalid ||
      !newPassword ||
      !oldPassword ||
      newPassword !== newPasswordConfirm,
    [
      isResponse,
      newPassword,
      newPasswordConfirm,
      newPasswordInputProps.isInvalid,
      oldPassword,
      oldPasswordInputProps.isInvalid,
    ]
  )

  const toast = useToast()
  const updateProfile = useCallback(() => {
    sendRequest()
    http
      .post('user/change-password', {
        update: newPassword,
        current: oldPassword,
      })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Password Changed.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .catch((res) => {
        switch (res.data.field) {
          case 'old-password':
            setOldPasswordError(res.data.message)
            break
          case 'new-password':
            setNewPasswordError(res.data.message)
            break
          default:
            toast({
              title: 'An Error Occured',
              description: res.data,
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            })
        }
      })
      .finally(receivedResponse)
  }, [
    newPassword,
    oldPassword,
    receivedResponse,
    sendRequest,
    setNewPasswordError,
    setOldPasswordError,
    toast,
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
        Change password
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Here you can set your new password
      </Text>
      <InputField {...oldPasswordInputProps} />
      <InputField {...newPasswordInputProps} />
      <InputField {...newPasswordConfirmInputProps} />
      <Button variant="brand" onClick={updateProfile} disabled={submitStatus}>
        {isResponse && <Spinner mr="2" size="sm" />}Save Changes
      </Button>
    </Card>
  )
}
