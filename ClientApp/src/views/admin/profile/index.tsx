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
import { Box, Flex, Grid } from '@chakra-ui/react'

import Banner from './components/Banner'
import Account from './components/Account'
import Password from './components/Password'
import BankCards from './components/BankCards'
import Categorize from './components/Categorize'

export default function Profile() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '1fr 1fr',
        }}
        gap="20px"
      >
        <Flex gap="20px" direction="column">
          <Banner />
          <BankCards />
          <Categorize />
        </Flex>
        <Flex gap="20px" direction="column">
          <Account />
          <Password />
        </Flex>
      </Grid>
    </Box>
  )
}
