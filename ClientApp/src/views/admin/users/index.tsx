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
import { Box } from '@chakra-ui/react'
import UserTable from './UsersTable'
import { useState, useEffect, useCallback } from 'react'
import { http } from 'utils/http'

const columnsData = [
  {
    Header: 'ID',
    accessor: 'id',
    show: false,
  },
  {
    Header: 'NAME',
    accessor: 'name',
  },
  {
    Header: 'EMAIL',
    accessor: 'email',
  },
  {
    Header: 'USERNAME',
    accessor: 'username',
  },
  {
    Header: 'JOIN DATE',
    accessor: 'join_date',
  },
  {
    Header: 'USER TYPE',
    accessor: 'role',
  },
  {
    Header: 'ACTIONS',
    accessor: 'actions',
  },
]

export default function Settings() {
  const [tableData, setTableData] = useState([])
  // Chakra Color Mode
  const reloadData = useCallback(() => {
    http.get('user/users').then((res) => setTableData(res.data))
  }, [setTableData])
  useEffect(reloadData, [])
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <UserTable
        columnsData={columnsData}
        tableData={tableData}
        reload={reloadData}
      />
    </Box>
  )
}
