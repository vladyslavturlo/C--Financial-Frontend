import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Avatar,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
  Stack,
  useToast,
} from '@chakra-ui/react'
import React, { useMemo, useCallback, useState } from 'react'
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'

// Custom components
import Card from 'components/card/Card'
import Menu from 'components/menu/MainMenu'

// Assets
import { MdEdit, MdDelete } from 'react-icons/md'
import { http } from 'utils/http'
import { useHistory } from 'react-router-dom'
export default function ColumnsTable(props: {
  columnsData: any
  tableData: any
  reload: any
}) {
  const { columnsData, tableData, reload } = props

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
    page,
    prepareRow,
    initialState,
  } = tableInstance
  initialState.pageSize = 5
  initialState.hiddenColumns = columns
    .filter((col: any) => col.show === false)
    .map((col: any) => col.accessor)

  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [edit, setEdit] = useState<string | null>(null)
  const [userId, setUserId] = useState('')
  const [rowIndex, setRowIndex] = useState(0)

  const handleClick = useCallback(
    (row: number, id: string, role: string | null = null) => {
      setEdit(role)
      setUserId(id)
      setRowIndex(row)
      onOpen()
    },
    [onOpen, setEdit, setUserId]
  )

  const toast = useToast()
  const history = useHistory()
  const handleAction = useCallback(() => {
    if (edit == null) {
      http.post('user/delete-user', { user_id: userId }).then(() => {
        toast({
          title: 'Success',
          description: 'User Deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        // const t = data;
        // t.splice(rowIndex, 1)
        // setData(t)
        reload()
      })
    } else {
      http
        .post('user/change-role', { user_id: userId, role: edit })
        .then(() => {
          toast({
            title: 'Success',
            description: 'User role changed.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          })
          // const t = data;
          // t[rowIndex]['role'] = edit
          // setData(t)
          reload()
        })
    }
    onClose()
  }, [edit, userId, onClose])

  return (
    <>
      <Card
        flexDirection="column"
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
      >
        <Flex px="25px" justify="space-between" mb="20px" align="center">
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            Users
          </Text>
        </Flex>
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
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
              const rowIndex = index
              prepareRow(row)
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data
                    if (cell.column.Header === 'NAME') {
                      data = (
                        <Flex alignItems="center">
                          <Avatar name={cell.value} mr="2" />
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      )
                    } else if (cell.column.Header === 'EMAIL') {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      )
                    } else if (cell.column.Header === 'USERNAME') {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          @{cell.value}
                        </Text>
                      )
                    } else if (cell.column.Header === 'JOIN DATE') {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {new Date(cell.value).toLocaleString('default')}
                        </Text>
                      )
                    } else if (cell.column.Header === 'USER TYPE') {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      )
                    } else if (cell.column.Header === 'ACTIONS') {
                      data = (
                        <Flex align="center">
                          <Link
                            onClick={() =>
                              handleClick(
                                rowIndex,
                                row.values.id,
                                row.values.role
                              )
                            }
                            mr="2"
                          >
                            <Icon
                              as={MdEdit}
                              color="secondaryGray.500"
                              h="18px"
                              w="18px"
                            />
                          </Link>
                          <Link
                            onClick={() => handleClick(rowIndex, row.values.id)}
                          >
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
      </Card>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{!edit ? 'Confirm' : 'Change role'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!edit ? (
              'Are you sure to delete?'
            ) : (
              <RadioGroup defaultValue={edit}>
                <Stack>
                  <Radio value="Admin" onChange={() => setEdit('Admin')}>
                    Admin
                  </Radio>
                  <Radio value="User" onChange={() => setEdit('User')}>
                    User
                  </Radio>
                </Stack>
              </RadioGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="blue" mr={3}>
              Cancel
            </Button>
            <Button onClick={handleAction}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
