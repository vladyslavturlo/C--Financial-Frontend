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

import { useMemo, useCallback, useContext } from 'react'
import { NavLink } from 'react-router-dom'
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Spinner,
  Text,
  useBoolean,
  useColorModeValue,
  useToast,
  VisuallyHidden,
} from '@chakra-ui/react'
// Custom components
import DefaultAuth from 'layouts/auth/Default'
// Assets
import illustration from 'assets/img/auth/auth.png'
import InputField from 'components/fields/InputField'
import useInput from 'hooks/useInput'
import { http } from 'utils/http'
import { UserContext } from 'App'
import { emailProps, passwordProps } from 'variables/inputProps'

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white')
  const textColorSecondary = 'gray.400'
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600')
  const textColorBrand = useColorModeValue('brand.500', 'white')

  const [setEmailError, emailInputProps] = useInput(emailProps)
  const email = emailInputProps.value
  const [setPasswordError, passwordInputProps] = useInput(passwordProps)
  const password = passwordInputProps.value
  const [rememberMe, { toggle: rememberMeToggle }] = useBoolean()
  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()

  const toast = useToast()
  const { getUser } = useContext(UserContext)
  const signIn = useCallback(() => {
    sendRequest()
    http
      .post('auth/sign-in', { email, password, rememberMe })
      .then((res) => {
        toast({
          title: 'Success',
          description: 'Now you are logged in.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        localStorage.setItem(
          'jwt_token',
          (res.data as unknown as { token: string }).token
        )
        getUser()
      })
      .catch((res) => {
        switch (res.data.field) {
          case 'email':
            setEmailError(res.data.message)
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
  }, [email, password, rememberMe])

  const submitStatus = useMemo(
    () =>
      isResponse ||
      emailInputProps.isInvalid ||
      !emailInputProps.value ||
      passwordInputProps.isInvalid ||
      !passwordInputProps.value,
    [
      isResponse,
      emailInputProps.isInvalid,
      emailInputProps.value,
      passwordInputProps.value,
      passwordInputProps.isInvalid,
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
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <InputField {...emailInputProps} />
          <InputField {...passwordInputProps} />
          <Flex justifyContent="space-between" align="center" mb="24px">
            <FormControl display="flex" alignItems="center">
              <Checkbox
                id="remember-login"
                colorScheme="brandScheme"
                me="10px"
                isChecked={rememberMe}
                onChange={rememberMeToggle}
              />
              <FormLabel
                htmlFor="remember-login"
                mb="0"
                fontWeight="normal"
                color={textColor}
                fontSize="sm"
              >
                Keep me logged in
              </FormLabel>
            </FormControl>
            <VisuallyHidden>
              <NavLink to="/auth/forgot-password">
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  w="124px"
                  fontWeight="500"
                >
                  Forgot password?
                </Text>
              </NavLink>
            </VisuallyHidden>
          </Flex>
          <Button
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            onClick={signIn}
            disabled={submitStatus}
          >
            {isResponse && <Spinner mr="2" size="sm" />}
            Sign In
          </Button>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Not registered yet?
              <NavLink to="/auth/sign-up">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  )
}

export default SignIn
