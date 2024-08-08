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
  Select,
  Stack,
  StackDivider,
  Text,
  useBoolean,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import CashflowTable from './CashflowTable'
import Card from 'components/card/Card'
import { useState, useEffect, useCallback, ChangeEvent } from 'react'
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
  {
    Header: 'BALANCE',
    accessor: 'balance',
  },
]

export default function Reminder() {
  const [tableData, setTableData] = useState({
    balance: 0,
    future: 0,
    currency: '',
    upcoming: [],
  })
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
  const [days, setDays] = useState(30)
  const [file, setFile] = useState('')
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
    (id: string | null = null, day: number | null = null) => {
      sendRequest()
      http
        .post('cashflow/all', {
          item_id: id == null ? itemId : id,
          days: day == null ? days : day,
        })
        .then((res) => {
          setTableData(
            res.data as unknown as {
              upcoming: Array<object>
              balance: number
              future: number
              currency: string
            }
          )
          receivedResponse()
        })
    },
    [days, itemId, receivedResponse, sendRequest]
  )

  return (
    <Flex
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      alignItems="flex-start"
      flexDir={{ base: 'column', md: 'row' }}
    >
      <Flex w={{ base: '100%', md: '400px' }} mr="5" mb="5" flexDir="column">
        <Card mb="5">
          <Heading size="md" mb="5">
            Date range from now
          </Heading>
          <Select
            onChange={(e) => {
              setDays(Number(e.target.value))
              loadTransactions(null, Number(e.target.value))
            }}
            value={days}
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </Select>
        </Card>
        <Card p="0" pb="5">
          <Heading size="md" mb="5" p="5">
            My accounts
          </Heading>
          <Stack divider={<StackDivider />}>
            {items.map((item, i) => (
              <Link
                key={i}
                onClick={() => {
                  setFile(item.accounts.join(', '))
                  setItemId(item.item_id)
                  loadTransactions(item.item_id)
                }}
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
      </Flex>
      <CashflowTable
        title="Cashflow Report"
        columnsData={columnsData}
        days={days}
        file={file}
        balance={tableData.balance}
        future={tableData.future}
        currency={tableData.currency}
        tableData={tableData.upcoming}
        isResponse={isResponse}
        item={item}
      />
    </Flex>
  )
}
