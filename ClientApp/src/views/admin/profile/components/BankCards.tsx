// Chakra imports
import {
  Button,
  Icon,
  Spinner,
  Text,
  useBoolean,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'

// Custom components
import Card from 'components/card/Card'
import { MdAddCard } from 'react-icons/md'
import BankCard from 'views/admin/profile/components/BankCard'
import { useState, useEffect, useCallback } from 'react'
import { http } from 'utils/http'
import { usePlaidLink } from 'react-plaid-link'

export default function BankCards() {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white')
  const textColorSecondary = 'gray.400'
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [items, setItems] = useState([])
  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()

  const getItems = useCallback(() => {
    http.get('user/items').then((res) => setItems(res.data.items))
  }, [setItems])

  useEffect(() => {
    http
      .post('plaid/create_link_token')
      .then((res) => setLinkToken(res.data.link_token))

    getItems()
  }, [getItems])

  // const handleDelete = (id: string) => {
  //   setItems(items.filter((i) => i.item_id !== id))
  // }

  const toast = useToast()
  const onSuccess = async (public_token: string) => {
    sendRequest()
    const res = await http.post('plaid/set_access_token', { public_token })
    if (res.status === 200) {
      // setItems([...items, res.data])
      getItems()
      toast({
        title: 'Success',
        description: 'Now you account has been linked.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
    }
    receivedResponse()
  }

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken,
    onSuccess,
  }

  const { open, ready } = usePlaidLink(config)

  return (
    <Card>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Bank Accounts
      </Text>
      <Text color={textColorSecondary} fontSize="md" me="26px" mb="40px">
        Here you can find your linked bank accounts. You can link more accounts
        or unlink them.
      </Text>
      <Button
        mb="5"
        variant="brand"
        disabled={!ready || isResponse}
        onClick={() => {
          open()
        }}
      >
        {isResponse ? (
          <Spinner mr="2" size="sm" />
        ) : (
          <Icon as={MdAddCard} color="inherit" mr="2" />
        )}
        Link your account
      </Button>
      {items.map((item, i) => (
        <BankCard
          onDelete={getItems}
          key={i}
          id={item.item_id}
          accounts={item.accounts}
          institution={item.institution}
        />
      ))}
    </Card>
  )
}
