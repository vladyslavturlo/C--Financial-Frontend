import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  useDisclosure,
  Select,
  Icon,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Link,
  Grid,
  FormLabel,
  FormControl,
  Spinner,
  Box,
  useToast,
} from '@chakra-ui/react'
import React, { useMemo, useCallback, useState, useEffect } from 'react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

// Custom components
import Card from 'components/card/Card'

// Assets
import {
  MdEdit,
  MdDelete,
  MdArrowLeft,
  MdArrowRight,
  MdAddCard,
  MdMerge,
} from 'react-icons/md'
import InputField from 'components/fields/InputField'
import useInput from 'hooks/useInput'
import { z } from 'zod'
import NumberField from 'components/fields/NumberField'
import { scheduleModes, scheduleTypes } from 'variables/schedule'
import { http } from 'utils/http'

const pageSizeOptions = [5, 10, 20, 50]

export default function ColumnsTable(props: {
  columnsData: any
  tableData: any
  isResponse: boolean
  sendRequest: any
  receivedResponse: any
  load: any
  itemId: string
  items: any
}) {
  const {
    columnsData,
    tableData,
    itemId: item_id,
    items,
    isResponse,
    sendRequest,
    receivedResponse,
    load,
  } = props

  const item =
    items.length > 0
      ? items[items.length - 1]
      : {
          item_id: 'all',
          institution: 'All',
          accounts: [],
          acc_ids: [],
          acc_currency: [],
        }
  const myAccs = items.filter((i: any) => i.item_id === item_id)
  const { accounts, acc_ids, acc_currency } =
    myAccs.length > 0
      ? myAccs[0]
      : { accounts: [], acc_ids: [], acc_currency: [] }

  const columns = useMemo(() => columnsData, [columnsData])
  const data = useMemo(() => tableData, [tableData])

  const tableInstance = useTable(
    {
      columns,
      data: data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    initialState,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
    // gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = tableInstance
  initialState.pageSize = 5
  initialState.hiddenColumns = columns
    .filter((col: any) => col.show === false)
    .map((col: any) => col.accessor)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')
  const brandStars = useColorModeValue('brand.500', 'brand.400')
  const [edit, setEdit] = useState(false)

  const inputBorderColor = useColorModeValue(
    'secondaryGray.100',
    'rgba(135, 140, 189, 0.3)'
  )
  const descriptionProps = {
    type: 'text',
    label: 'Description',
    name: 'description',
    isRequired: true,
    placeholder: 'Describe your transaction.',
    schema: z.string().min(1, { message: 'Description is required.' }),
  }
  const payeeProps = {
    type: 'text',
    label: 'Payee',
    name: 'payee',
    isRequired: true,
    placeholder: 'Input your payee.',
    schema: z.string().min(1, { message: 'Payee is required.' }),
  }

  const [amount, setAmount] = useState('0.00')
  const [account, setAccount] = useState(0)
  const amountInputProps = {
    suffix: ' ' + acc_currency[account],
    min: 0,
    max: 1000000,
    step: 1,
    precision: 2,
    isRequired: true,
    placeholder: 'Input amount.',
    label: 'Amount',
    value: amount,
    setValue: setAmount,
  }

  const dateProps = {
    type: 'date',
    label: 'Start Date',
    name: 'date',
    isRequired: true,
    placeholder: '01/01/2023',
    schema: z.string(),
  }

  const [setDescriptionError, descriptionInputProps] =
    useInput(descriptionProps)
  const description = descriptionInputProps.value
  const [setPayeeError, payeeInputProps] = useInput(payeeProps)
  const payee = payeeInputProps.value
  const [setDateError, dateInputProps] = useInput(dateProps)
  const date = dateInputProps.value
  const [type, setType] = useState(0)
  const [mode, setMode] = useState(0)
  const [del, setDel] = useState(false)
  const [scheduleId, setScheduleId] = useState(0)
  const [transferAccs, setTransferAccs] = useState({ names: [], ids: [] })
  const [transferAcc, setTransferAcc] = useState(0)

  const handleClick = useCallback(
    (values: any | null = null) => {
      if (typeof values === 'number') {
        setDel(true)
        setScheduleId(values)
      } else {
        setDel(false)
        setEdit(values != null)
        if (values != null) {
          descriptionInputProps.setValue(values.description)
          payeeInputProps.setValue(values.payee)
          dateInputProps.setValue(values.start_date.split('T')[0])
          setAmount(values.amount)
          setType(values.type)
          setMode(values.mode)
          setAccount(acc_ids.indexOf(values.account_id))
          setScheduleId(values.id)
          const idx = transferAccs.ids.indexOf(values.transfer_acc_id)
          setTransferAcc(idx > 0 ? idx : 0)
        } else {
          descriptionInputProps.setValue('')
          setDescriptionError(null)
          payeeInputProps.setValue('')
          setPayeeError(null)
          dateInputProps.setValue('')
          setDateError(null)
          setAmount('0.00')
          setType(0)
          setMode(0)
          setAccount(0)
          setScheduleId(0)
          setTransferAcc(0)
        }
      }
      onOpen()
    },
    [
      acc_ids,
      dateInputProps,
      descriptionInputProps,
      onOpen,
      payeeInputProps,
      setDateError,
      setDescriptionError,
      setPayeeError,
      transferAccs.ids,
    ]
  )

  const submitStatus = useMemo(
    () =>
      isResponse ||
      descriptionInputProps.isInvalid ||
      !descriptionInputProps.value ||
      !Date.parse(dateInputProps.value) ||
      payeeInputProps.isInvalid ||
      !payeeInputProps.value,
    [
      isResponse,
      descriptionInputProps.isInvalid,
      descriptionInputProps.value,
      payeeInputProps.isInvalid,
      payeeInputProps.value,
      dateInputProps.value,
    ]
  )

  const toast = useToast()

  const reconsolidate = useCallback(() => {
    sendRequest()
    http
      .post('schedule/recategorize')
      .then((res) => {
        toast({
          title: 'Success',
          description: 'Your scheduled transactions have been consolidated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
      })
      .finally(receivedResponse)
  }, [receivedResponse, sendRequest, toast])

  const handleSchedule = useCallback(() => {
    onClose()
    sendRequest()
    if (del) {
      http
        .post('schedule/delete', { schedule_id: scheduleId })
        .then((res) => {
          load()
          toast({
            title: 'Success',
            description: 'Your schedule has deleted.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
        })
        .finally(receivedResponse)
    } else {
      const req = {
        schedule_id: scheduleId,
        description,
        payee,
        amount,
        type,
        mode,
        start_date: date,
        account_id: acc_ids[account],
        transfer_acc_id: transferAccs.ids[transferAcc],
      }
      if (edit) {
        http
          .post('schedule/update', req)
          .then((res) => {
            load()
            toast({
              title: 'Success',
              description: 'Your schedule has updated.',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            })
          })
          .finally(receivedResponse)
      } else {
        http
          .post('schedule/add', req)
          .then((res) => {
            load()
            toast({
              title: 'Success',
              description: 'Your transaction has scheduled.',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            })
          })
          .finally(receivedResponse)
      }
    }
  }, [
    acc_ids,
    account,
    amount,
    date,
    del,
    description,
    edit,
    load,
    mode,
    onClose,
    payee,
    receivedResponse,
    scheduleId,
    sendRequest,
    toast,
    transferAcc,
    transferAccs.ids,
    type,
  ])

  const loadTransferAccs = useCallback(
    (acc: number) => {
      if (!acc_ids[acc]) return
      const idx = item.acc_ids.indexOf(acc_ids[acc])
      if (idx >= 0) {
        setTransferAccs({
          names: item.accounts.filter((_: any, i: number) => idx !== i),
          ids: item.acc_ids.filter((_: any, i: number) => idx !== i),
        })
      }
    },
    [acc_ids, item.acc_ids, item.accounts]
  )
  useEffect(() => loadTransferAccs(account), [account, loadTransferAccs])
  const onAccountChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const _account = Number(e.target.value)
      setAccount(_account)
      loadTransferAccs(_account)
    },
    [loadTransferAccs]
  )

  return (
    <>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex
          px="25px"
          justify="space-between"
          align="center"
          flexDir={{ base: 'column', md: 'row' }}
        >
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
            mb="20px"
          >
            Schedule your transactions
          </Text>
          {item_id === 'all' ? (
            <Button
              variant="brand"
              onClick={(e) => reconsolidate()}
              isDisabled={isResponse}
            >
              {isResponse ? (
                <Spinner mr="2" size="sm" />
              ) : (
                <Icon as={MdMerge} mr="2" />
              )}
              Recategorize
            </Button>
          ) : (
            <Button
              variant="brand"
              onClick={(e) => handleClick()}
              isDisabled={isResponse}
            >
              {isResponse ? (
                <Spinner mr="2" size="sm" />
              ) : (
                <Icon as={MdAddCard} mr="2" />
              )}
              Add Schedule
            </Button>
          )}
        </Flex>
        <Flex alignItems="center" p="5" flexDir={{ base: 'column', md: 'row' }}>
          {pageOptions.length > 0 && (
            <Flex alignItems="center" my="2">
              <Button
                onClick={() => previousPage()}
                visibility={canPreviousPage ? 'visible' : 'hidden'}
                w="40px"
                h="40px"
                borderRadius="50%"
              >
                <Icon
                  as={MdArrowLeft}
                  width="30px"
                  height="30px"
                  color="inherit"
                />
              </Button>
              <Text mx="5">
                Page{' '}
                <em>
                  {pageIndex + 1} of {pageOptions.length}
                </em>
              </Text>
              <Button
                onClick={() => nextPage()}
                visibility={canNextPage ? 'visible' : 'hidden'}
                w="40px"
                h="40px"
                borderRadius="50%"
              >
                <Icon
                  as={MdArrowRight}
                  width="30px"
                  height="30px"
                  color="inherit"
                />
              </Button>
              {/* <Text mx="5">Go to page:</Text>
          <Input
            width="50px"
            type="number"
            defaultValue={pageIndex + 1 || 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
          /> */}
            </Flex>
          )}
          <Spacer />
          <Flex alignItems="center" my="2">
            <Text mr="5">Show:</Text>
            <Select
              width="100px"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
              }}
            >
              {pageSizeOptions.map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>

        <Box overflowX="auto">
          <Table
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
          >
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map(
                    (column, index) =>
                      (column.render('Header') !== 'ACTIONS' ||
                        item_id !== 'all') && (
                        <Th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          pe="10px"
                          key={index}
                          borderColor={borderColor}
                        >
                          <Flex
                            justify="space-between"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                          >
                            {column.render('Header')}
                          </Flex>
                        </Th>
                      )
                  )}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row, index) => {
                prepareRow(row)
                return (
                  <Tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell, index) => {
                      let data
                      if (
                        cell.column.Header === 'NAME' ||
                        cell.column.Header === 'ACCOUNT' ||
                        cell.column.Header === 'DESCRIPTION' ||
                        cell.column.Header === 'PAYEE'
                      ) {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        )
                      } else if (cell.column.Header === 'START DATE') {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {
                              new Date(cell.value)
                                .toLocaleString('default')
                                .split(',')[0]
                            }
                          </Text>
                        )
                      } else if (cell.column.Header === 'AMOUNT') {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value} {row.values.currency}
                          </Text>
                        )
                      } else if (cell.column.Header === 'TYPE') {
                        let transferTo = ''
                        if (cell.value === 2) {
                          if (item_id === 'all') {
                            const idx = acc_ids.indexOf(
                              row.values.transfer_acc_id
                            )
                            if (idx >= 0)
                              transferTo = '(to ' + accounts[idx] + ')'
                          } else {
                            const idx = transferAccs.ids.indexOf(
                              row.values.transfer_acc_id
                            )
                            if (idx >= 0)
                              transferTo =
                                '(to ' + transferAccs.names[idx] + ')'
                          }
                        }
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {scheduleTypes[cell.value]} {transferTo}
                          </Text>
                        )
                      } else if (cell.column.Header === 'MODE') {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {scheduleModes[cell.value]}
                          </Text>
                        )
                      } else if (cell.column.Header === 'ACTIONS') {
                        data = item_id !== 'all' &&
                          acc_ids.includes(row.values.account_id) && (
                            <Flex align="center">
                              <Link
                                onClick={() => handleClick(row.values)}
                                mr="2"
                              >
                                <Icon
                                  as={MdEdit}
                                  color="secondaryGray.500"
                                  h="18px"
                                  w="18px"
                                />
                              </Link>
                              <Link onClick={() => handleClick(row.values.id)}>
                                <Icon
                                  as={MdDelete}
                                  color="secondaryGray.500"
                                  h="18px"
                                  w="18px"
                                />
                              </Link>
                            </Flex>
                          )
                      }
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: '14px' }}
                          minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                          borderColor="transparent"
                        >
                          {data}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
        <Modal
          onClose={onClose}
          isOpen={isOpen}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {del ? 'Confirm' : edit ? 'Update schedule' : 'Add new schedule'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {del ? (
                'Are you sure to delete the scheduled transaction?'
              ) : (
                <>
                  <FormControl mb="36px">
                    <FormLabel
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      color={textColor}
                      mb="8px"
                    >
                      Account<Text color={brandStars}>*</Text>
                    </FormLabel>
                    <Select
                      borderColor={inputBorderColor}
                      variant="auth"
                      fontSize="sm"
                      fontWeight="500"
                      size="lg"
                      value={account}
                      onChange={onAccountChange}
                    >
                      {accounts.map((acc: string, i: number) => (
                        <option key={i} value={i}>
                          {acc}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <Grid
                    templateColumns={{ md: '1fr 1fr', base: '1fr' }}
                    columnGap={6}
                  >
                    <InputField {...descriptionInputProps} />
                    <InputField {...payeeInputProps} />
                    <NumberField {...amountInputProps} />
                    <FormControl mb="36px">
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        mb="8px"
                      >
                        Type<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Select
                        borderColor={inputBorderColor}
                        variant="auth"
                        fontSize="sm"
                        ms={{ base: '0px', md: '0px' }}
                        fontWeight="500"
                        size="lg"
                        value={type}
                        onChange={(e) => setType(Number(e.target.value))}
                      >
                        {scheduleTypes.map((t, i) => (
                          <option
                            key={i}
                            value={i}
                            disabled={
                              i === 2 && transferAccs.names.length === 0
                            }
                          >
                            {t}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl mb="36px">
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        mb="8px"
                      >
                        Recurrency<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Select
                        borderColor={inputBorderColor}
                        variant="auth"
                        fontSize="sm"
                        ms={{ base: '0px', md: '0px' }}
                        fontWeight="500"
                        size="lg"
                        value={mode}
                        onChange={(e) => setMode(Number(e.target.value))}
                      >
                        {scheduleModes.map((t, i) => (
                          <option key={i} value={i}>
                            {t}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <InputField {...dateInputProps} />
                  </Grid>
                  {type === 2 && (
                    <FormControl mb="36px">
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        mb="8px"
                      >
                        Transfer to<Text color={brandStars}>*</Text>
                      </FormLabel>
                      <Select
                        borderColor={inputBorderColor}
                        variant="auth"
                        fontSize="sm"
                        fontWeight="500"
                        size="lg"
                        value={transferAcc}
                        onChange={(e) => setTransferAcc(Number(e.target.value))}
                      >
                        {transferAccs.names.map((acc: string, i: number) => (
                          <option key={i} value={i}>
                            {acc}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </>
              )}{' '}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} colorScheme="blue" mr={3}>
                Cancel
              </Button>
              <Button onClick={handleSchedule} disabled={submitStatus}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </>
  )
}
function ids(names: any, arg1: any, ids: any, arg3: any) {
  throw new Error('Function not implemented.')
}
