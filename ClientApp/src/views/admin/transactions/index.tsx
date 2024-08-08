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

// Chakra imports
import {
  Flex,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text,
  useBoolean,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import TransactionsTable from './TransactionsTable'
import Card from 'components/card/Card'
import { useState, useEffect, useCallback } from 'react'
import { http } from 'utils/http'

const columnsData = [
  {
    Header: 'ACCOUNT',
    accessor: 'account',
  },
  {
    Header: 'DATE',
    accessor: 'date',
  },
  {
    Header: 'NAME',
    accessor: 'name',
  },
  {
    Header: 'AMOUNT',
    accessor: 'amount',
  },
  {
    Header: 'STATUS',
    accessor: 'consolidated',
  },
]

export default function Settings() {
  const [tableData, setTableData] = useState([])
  // Chakra Color Mode
  const [items, setItems] = useState([])
  const [itemId, setItemId] = useState('all')
  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()
  const bgHover = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.50' }
  )
  const bgFocus = useColorModeValue('secondaryGray.300', 'whiteAlpha.100')

  useEffect(() => {
    http.get('user/items').then((res) => {
      setItems([
        ...res.data.items,
        { item_id: 'all', institution: 'All', accounts: [] },
      ])
    })
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTransactions = useCallback(
    (id: string | null = null) => {
      sendRequest()
      http
        .post('plaid/transactions', { item_id: id == null ? itemId : id })
        .then((res) => {
          setTableData(res.data as unknown as Array<object>)
          receivedResponse()
        })
    },
    [itemId, receivedResponse, sendRequest]
  )

  const toast = useToast()
  const handleSync = useCallback(() => {
    sendRequest()
    http
      .post('plaid/sync-transaction', { item_id: itemId })
      .then(() => {
        toast({
          title: 'Success',
          description: 'Transactions are synced now.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        loadTransactions()
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'An error occured while syncing.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(receivedResponse)
  }, [itemId, loadTransactions, receivedResponse, sendRequest, toast])
  const onChange = useCallback(
    (item_id: string) => {
      setItemId(item_id)
      loadTransactions(item_id)
    },
    [setItemId, loadTransactions]
  )
  return (
    <Flex
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      alignItems="flex-start"
      flexDir={{ base: 'column', md: 'row' }}
    >
      <Card w={{ base: '100%', md: '400px' }} mr="5" mb="5" p="0" pb="5">
        <Heading size="md" mb="5" p="5">
          My accounts
        </Heading>
        <Stack divider={<StackDivider />}>
          {items.map((item, i) => (
            <Link
              key={i}
              onClick={() => onChange(item.item_id)}
              _hover={bgHover}
              bg={item.item_id === itemId ? bgFocus : 'inherit'}
              p="4"
            >
              <Heading size="xs" textTransform="uppercase">
                {item.institution}
              </Heading>
              <Text pt="2" fontSize="sm">
                {item.accounts.join(', ')}
              </Text>
            </Link>
          ))}
        </Stack>
      </Card>
      <TransactionsTable
        columnsData={columnsData}
        tableData={tableData}
        sync={handleSync}
        isResponse={isResponse}
      />
    </Flex>
  )
}
