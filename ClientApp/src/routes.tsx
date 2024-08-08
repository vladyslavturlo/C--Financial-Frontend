import { Icon } from '@chakra-ui/react'
import {
  MdBarChart,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdDashboard,
  MdSupervisorAccount,
  MdSettings,
  MdAlarm,
  MdSchedule,
  MdEditDocument,
  MdFollowTheSigns,
} from 'react-icons/md'

// Admin Imports
import MainDashboard from 'views/admin/default'
import ProfileSettings from 'views/admin/profile'
import Transactions from 'views/admin/transactions'
import Schedule from 'views/admin/schedule'
import Cashflow from 'views/admin/cashflow'
import Users from 'views/admin/users'

// Auth Imports
import SignInCentered from 'views/auth/signIn'
import SignUpCentered from 'views/auth/signUp'
import Reminder from 'views/admin/reminder'

const routes = [
  {
    name: 'Cashflow',
    layout: '/admin',
    path: '/cashflow',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    component: Cashflow,
  },
  // {
  //   name: 'Dashboard',
  //   layout: '/admin',
  //   path: '/default',
  //   icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
  //   component: MainDashboard,
  // },
  // {
  //   name: 'NFT Marketplace',
  //   layout: '/admin',
  //   path: '/nft-marketplace',
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width="20px"
  //       height="20px"
  //       color="inherit"
  //     />
  //   ),
  //   component: NFTMarketplace,
  //   secondary: true,
  // },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
  //   path: '/data-tables',
  //   component: DataTables,
  //   role: 'Admin',
  // },
  {
    name: 'Users',
    layout: '/admin',
    icon: (
      <Icon
        as={MdSupervisorAccount}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: '/users',
    component: Users,
    role: 'Admin',
  },
  // {
  //   name: 'Profile',
  //   layout: '/admin',
  //   path: '/profile',
  //   icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  //   component: Profile,
  //   role: 'Admin',
  // },
  {
    name: 'Schedule',
    layout: '/admin',
    path: '/schedule',
    icon: <Icon as={MdSchedule} width="20px" height="20px" color="inherit" />,
    component: Schedule,
  },
  {
    name: 'Transactions',
    layout: '/admin',
    path: '/transactions',
    icon: (
      <Icon as={MdEditDocument} width="20px" height="20px" color="inherit" />
    ),
    component: Transactions,
  },
  {
    name: 'Reminder',
    layout: '/admin',
    path: '/reminder',
    icon: <Icon as={MdAlarm} width="20px" height="20px" color="inherit" />,
    component: Reminder,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/settings',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    component: ProfileSettings,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: SignUpCentered,
  },
]

export default routes
