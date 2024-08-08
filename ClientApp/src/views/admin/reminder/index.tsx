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
  Box,
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
import OverdueTable from './OverdueTable'
import Card from 'components/card/Card'
import { useState, useEffect, useCallback } from 'react'
import { http } from 'utils/http'

const columnsData = [
  { accessor: 'currency', show: false },
  { accessor: 'transfer_acc_id', show: false },
  {
    Header: 'ACCOUNT',
    accessor: 'account',
  },
  {
    Header: 'DATE',
    accessor: 'date',
  },
  {
    Header: 'DESCRIPTION',
    accessor: 'description',
  },
  {
    Header: 'PAYEE',
    accessor: 'payee',
  },
  {
    Header: 'AMOUNT',
    accessor: 'amount',
  },
  {
    Header: 'TYPE',
    accessor: 'type',
  },
  {
    Header: 'MODE',
    accessor: 'mode',
  },
]

export default function Reminder() {
  const [tableData, setTableData] = useState({ overdues: [], upcoming: [] })
  // Chakra Color Mode
  const [items, setItems] = useState([])
  const [itemId, setItemId] = useState('all')
  const [item, setItem] = useState({
    item_id: 'all',
    institution: 'All',
    accounts: [],
    acc_ids: [],
    acc_currency: [],
  })
  const [isResponse, { on: sendRequest, off: receivedResponse }] = useBoolean()
  const bgHover = useColorModeValue(
    { bg: 'secondaryGray.400' },
    { bg: 'whiteAlpha.50' }
  )
  const bgFocus = useColorModeValue('secondaryGray.300', 'whiteAlpha.100')

  useEffect(() => {
    http.get('user/items').then((res) => {
      let accounts: Array<string> = [],
        acc_ids: Array<string> = [],
        acc_currency: Array<string> = []
      for (const it of res.data.items) {
        accounts = [...accounts, ...it.accounts]
        acc_ids = [...acc_ids, ...it.acc_ids]
        acc_currency = [...acc_currency, ...it.acc_currency]
      }
      const _item = {
        item_id: 'all',
        institution: 'All',
        accounts,
        acc_ids,
        acc_currency,
      }
      setItems([...res.data.items, _item])
      setItem(_item)
    })
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTransactions = useCallback(
    (id: string | null = null) => {
      sendRequest()
      http
        .post('reminder/all', { item_id: id == null ? itemId : id })
        .then((res) => {
          setTableData(
            res.data as unknown as {
              overdues: Array<object>
              upcoming: Array<object>
            }
          )
          receivedResponse()
        })
    },
    [itemId, receivedResponse, sendRequest]
  )

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
      <Box w="100%" overflowX="auto">
        <OverdueTable
          title="Overdue transactions"
          columnsData={columnsData}
          tableData={tableData.overdues}
          isResponse={isResponse}
          item={item}
        />
        <OverdueTable
          title="Upcoming transactions"
          columnsData={columnsData}
          tableData={tableData.upcoming}
          isResponse={isResponse}
          item={item}
        />
      </Box>
    </Flex>
  )
}
