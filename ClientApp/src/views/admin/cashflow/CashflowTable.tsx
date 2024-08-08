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
  Spinner,
  Select,
  Icon,
  Spacer,
  Box,
} from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import XLSX from 'sheetjs-style'
import FileSaver from 'file-saver'

// Custom components
import Card from 'components/card/Card'
import {
  MdArrowLeft,
  MdArrowRight,
  MdClose,
  MdImportExport,
  MdReport,
} from 'react-icons/md'
import { scheduleModes, scheduleTypes } from 'variables/schedule'
import Chart from 'react-apexcharts'
import {
  barChartDataConsumption,
  barChartOptionsConsumption,
} from 'variables/charts'
const pageSizeOptions = [5, 10, 20, 50]

export default function ColumnsTable(props: {
  columnsData: any
  tableData: any
  isResponse: boolean
  item: any
  title: string
  balance: number
  future: number
  currency: string
  days: number
  file: string
}) {
  const {
    columnsData,
    tableData,
    isResponse,
    title,
    balance,
    future,
    currency,
    days,
    file,
    item: { accounts, acc_ids },
  } = props

  const columns = useMemo(() => columnsData, [columnsData])
  const data = useMemo(() => tableData, [tableData])

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useFilters,
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
    setAllFilters,
    state: { filters },
  } = tableInstance
  initialState.pageSize = 5
  initialState.hiddenColumns = columns
    .filter((col: any) => col.show === false)
    .map((col: any) => col.accessor)

  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const process = useCallback(() => {
    let _data: any[] = []
    for (const d of data) {
      let transferTo = ''
      if (d.type === 2) {
        const idx = acc_ids.indexOf(d.transfer_acc_id)
        if (idx >= 0) transferTo = '(to ' + accounts[idx] + ')'
      }
      _data = [
        ..._data,
        {
          ACCOUNT: d.account,
          DESCRIPTION: d.description,
          PAYEE: d.payee,
          AMOUNT: d.amount,
          CURRENCY: d.currency,
          TYPE: scheduleTypes[d.type] + transferTo,
          MODE: scheduleModes[d.mode],
          DATE: d.date.split('T')[0],
          BALANCE: d.balance,
        },
      ]
    }
    return _data
  }, [acc_ids, accounts, data])

  const [chartOptions, chartData] = useMemo(() => {
    const category: any = {}
    for (const d of data) {
      const date = d.date.split('T')[0]
      category[date] = d.balance
    }
    const options = barChartOptionsConsumption
    return [
      {
        ...options,
        chart: {
          ...options.chart,
          events: {
            click: function (_: any, __: any, { dataPointIndex }: any) {
              setAllFilters([
                { id: 'date', value: Object.keys(category)[dataPointIndex] },
              ])
            },
          },
        },
        xaxis: { ...options.xaxis, categories: Object.keys(category) },
      },
      [
        { name: 'Balance', data: Object.values(category) },
      ] as ApexAxisChartSeries,
    ]
  }, [data])
  const exportToExcel = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(process())
    const ws1 = XLSX.utils.json_to_sheet([
      { TYPE: 'Current balance', VALUE: balance },
      { TYPE: 'Future balance', VALUE: future },
      { TYPE: 'Currency', VALUE: currency },
      { TYPE: 'Accounts', VALUE: file },
      { TYPE: 'Date range', VALUE: days + ' days' },
      { TYPE: 'Export date', VALUE: new Date().toLocaleString('default') },
    ])
    const wb = {
      Sheets: { Total: ws1, Cashflow: ws },
      SheetNames: ['Total', 'Cashflow'],
    }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, file + fileExtension)
  }, [balance, currency, days, file, future, process])

  return (
    <Flex flexDir="column" width="100%" overflowX="auto">
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
        mb="4"
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
            {title}
          </Text>
          <Flex>
            <Text fontWeight="700" textAlign="right">
              Current: {balance} {currency}
              <br />
              Future: {future} {currency}
            </Text>
            <Button
              ms="5"
              variant="brand"
              onClick={(e) => exportToExcel()}
              isDisabled={isResponse}
            >
              {isResponse ? (
                <Spinner mr="2" size="sm" />
              ) : (
                <Icon as={MdImportExport} mr="2" />
              )}
              Export
            </Button>
          </Flex>
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
              {filters.length > 0 && (
                <Button
                  onClick={() => setAllFilters([])}
                  w="40px"
                  h="40px"
                  borderRadius="50%"
                >
                  <Icon
                    as={MdClose}
                    width="30px"
                    height="30px"
                    color="inherit"
                  />
                </Button>
              )}
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
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
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
                  ))}
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
                      } else if (cell.column.Header === 'DATE') {
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
                      } else if (cell.column.Header === 'TYPE') {
                        let transferTo = ''
                        if (cell.value === 2) {
                          const idx = acc_ids.indexOf(
                            row.values.transfer_acc_id
                          )
                          if (idx >= 0)
                            transferTo = '(to ' + accounts[idx] + ')'
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
                      } else if (cell.column.Header === 'BALANCE') {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value} {currency}
                          </Text>
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
      </Card>
      <Card height="500px">
        <Chart
          options={chartOptions}
          series={chartData}
          type="line"
          width="100%"
          height="100%"
        />
      </Card>
    </Flex>
  )
}
