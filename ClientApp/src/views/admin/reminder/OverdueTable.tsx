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
import { useMemo } from 'react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

// Custom components
import Card from 'components/card/Card'
import { MdArrowLeft, MdArrowRight } from 'react-icons/md'
import { scheduleModes, scheduleTypes } from 'variables/schedule'
const pageSizeOptions = [5, 10, 20, 50]

export default function ColumnsTable(props: {
  columnsData: any
  tableData: any
  isResponse: boolean
  item: any
  title: string
}) {
  const {
    columnsData,
    tableData,
    isResponse,
    title,
    item: { accounts, acc_ids },
  } = props

  const columns = useMemo(() => columnsData, [columnsData])
  const data = useMemo(() => tableData, [tableData])

  const tableInstance = useTable(
    {
      columns,
      data,
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

  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')

  return (
    <>
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
    </>
  )
}
