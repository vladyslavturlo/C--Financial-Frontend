// Chakra imports
import { Avatar, Box, Text, useColorModeValue } from '@chakra-ui/react'
import { UserContext } from 'App'
import banner from 'assets/img/auth/banner.png'
import avatar from 'assets/img/avatars/avatar1.png'
import Card from 'components/card/Card'
import { useContext } from 'react'

export default function Banner() {
  const { user } = useContext(UserContext)
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white')
  const textColorSecondary = 'gray.400'
  const borderColor = useColorModeValue(
    'white !important',
    '#111C44 !important'
  )
  return (
    <Card alignItems="center">
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h="131px"
        w="100%"
      />
      <Avatar
        mx="auto"
        src={avatar}
        h="87px"
        w="87px"
        mt="-43px"
        border="4px solid"
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {user.name}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        Account type: <b>{user.role}</b>
      </Text>
    </Card>
  )
}
