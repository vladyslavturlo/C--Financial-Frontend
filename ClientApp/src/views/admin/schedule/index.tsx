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
  useConst,
} from '@chakra-ui/react'
import ScheduleTable from './ScheduleTable'
import Card from 'components/card/Card'
import { useState, useEffect, useCallback } from 'react'
import { http } from 'utils/http'

const columnsData = [
  { accessor: 'account_id', show: false },
  { accessor: 'id', show: false },
  { accessor: 'currency', show: false },
  { accessor: 'transfer_acc_id', show: false },
  {
    Header: 'ACCOUNT',
    accessor: 'account',
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
  {
    Header: 'START DATE',
    accessor: 'start_date',
  },
  {
    Header: 'ACTIONS',
    accessor: 'actions',
  },
]

export default function Settings() {
  const [tableData, setTableData] = useState([])
  // Chakra Color Mode
  /*const reloadData = useCallback(() => {
    http.get('user/users')
      .then(res => setTableData(res.data))
  }, [setTableData])
  useEffect(reloadData, [])*/
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
    })
    loadTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTransactions = useCallback(
    (id: string | null = null) => {
      sendRequest()
      http
        .post('schedule/all', { item_id: id == null ? itemId : id })
        .then((res) => {
          setTableData(res.data as unknown as Array<object>)
        })
        .finally(receivedResponse)
    },
    [itemId, receivedResponse, sendRequest]
  )

  const onChange = useCallback(
    (idx: number) => {
      setItemId(items[idx].item_id)
      loadTransactions(items[idx].item_id)
    },
    [items, loadTransactions]
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
          {items.map((it, i) => (
            <Link
              key={i}
              onClick={() => onChange(i)}
              _hover={bgHover}
              bg={itemId === it.item_id ? bgFocus : 'inherit'}
              p="4"
            >
              <Heading size="xs" textTransform="uppercase">
                {it.institution}
              </Heading>
              <Text pt="2" fontSize="sm">
                {it.accounts.join(', ')}
              </Text>
            </Link>
          ))}
        </Stack>
      </Card>
      <ScheduleTable
        columnsData={columnsData}
        tableData={tableData}
        items={items}
        itemId={itemId}
        isResponse={isResponse}
        sendRequest={sendRequest}
        receivedResponse={receivedResponse}
        load={() => loadTransactions(itemId)}
      />
    </Flex>
  )
}
