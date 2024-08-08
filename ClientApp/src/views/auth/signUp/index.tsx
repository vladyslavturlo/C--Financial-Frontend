/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useMemo, useCallback } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
// Chakra imports
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
  useBoolean,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
// Custom components
import DefaultAuth from 'layouts/auth/Default'
// Assets
import illustration from 'assets/img/auth/auth.png'
import InputField from 'components/fields/InputField'
import useInput from 'hooks/useInput'
import { http } from 'utils/http'

import {
  emailProps,
  firstNameProps,
  lastNameProps,
  passwordConfirmProps,
  passwordProps,
  usernameProps,
} from 'variables/inputProps'

function SignUp() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white')
  const textColorSecondary = 'gray.400'
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600')
  const textColorBrand = useColorModeValue('brand.500', 'white')

  const [setEmailError, emailInputProps] = useInput(emailProps)
  const email = emailInputProps.value
  const [setUsernameError, usernameInputProps] = useInput(usernameProps)
  const username = usernameInputProps.value
  const [setPasswordError, passwordInputProps] = useInput(passwordProps)
  const password = passwordInputProps.value
  const [, passwordConfirmInputProps] = useInput(passwordConfirmProps)
  const passwordConfirm = passwordConfirmInputProps.value
  const [, firstNameInputProps] = useInput(firstNameProps)
  const firstName = firstNameInputProps.value
  const [, lastNameInputProps] = useInput(lastNameProps)
  const lastName = lastNameInputProps.value
  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()

  const toast = useToast()
  const history = useHistory()
  const signUp = useCallback(() => {
    const name = firstName + ' ' + lastName
    sendRequest()
    http
      .post('auth/sign-up', { email, username, password, name })
      .then(() => {
        toast({
          title: 'Account created.',
          description: 'Now you can sign in.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        history.push('/sign-in')
      })
      .catch((res) => {
        switch (res.data.field) {
          case 'email':
            setEmailError(res.data.message)
            break
          case 'username':
            setUsernameError(res.data.message)
            break
          case 'password':
            setPasswordError(res.data.message)
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
  }, [email, username, password])

  const submitStatus = useMemo(
    () =>
      isResponse ||
      !email ||
      emailInputProps.isInvalid ||
      usernameInputProps.isInvalid ||
      passwordInputProps.isInvalid ||
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      passwordConfirm !== password,
    [
      isResponse,
      emailInputProps.isInvalid,
      usernameInputProps.isInvalid,
      passwordInputProps.isInvalid,
      email,
      username,
      password,
      passwordConfirm,
      firstName,
      lastName,
    ]
  )

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign Up
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email, username and password to sign up!
          </Text>
        </Box>
        <Box
          zIndex="2"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <Grid templateColumns={{ md: '1fr 1fr', base: '1fr' }} columnGap={6}>
            <InputField {...usernameInputProps} />
            <InputField {...emailInputProps} />
            <InputField {...firstNameInputProps} />
            <InputField {...lastNameInputProps} />
          </Grid>
          <InputField {...passwordInputProps} />
          <InputField {...passwordConfirmInputProps} />
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            onClick={signUp}
            disabled={submitStatus}
          >
            {isResponse && <Spinner mr="2" size="sm" />}
            Sign Up
          </Button>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Already have an account?
              <NavLink to="/auth/sign-in">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Go to Sign in
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Box>
      </Flex>
    </DefaultAuth>
  )
}

export default SignUp
