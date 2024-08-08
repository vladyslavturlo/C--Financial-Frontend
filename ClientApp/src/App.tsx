import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import AuthLayout from './layouts/auth'
import AdminLayout from './layouts/admin'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { http } from 'utils/http'
import { Flex, Spinner } from '@chakra-ui/react'
import { createContext } from 'react'

type User = {
  username: string
  email: string
  name: string
  role: string
}

export const UserContext = createContext(null)

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setLoading] = useState(true)
  const location = useLocation()

  const getUser = useCallback(() => {
    http
      .get('user/profile')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('jwt_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.getItem('jwt_token') ? getUser() : setLoading(false)
  }, [getUser])

  const redirectUrl = useMemo(() => (!user ? '/auth' : '/admin'), [user])
  const hasToRedirect = useMemo(
    () => !isLoading && !location.pathname.startsWith(redirectUrl),
    [isLoading, location.pathname, redirectUrl]
  )

  const logout = useCallback(() => {
    http.get('auth/logout').finally(() => {
      setUser(null)
      localStorage.removeItem('jwt_token')
    })
  }, [])

  return isLoading ? (
    <Flex w="100%" h="100vh" alignItems="center" justifyContent="center">
      <Spinner
        thickness="4px"
        speed="1s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  ) : (
    <UserContext.Provider value={{ user, getUser, logout }}>
      <Switch>
        {!user && <Route path={`/auth`} component={AuthLayout} />}
        {!!user && <Route path={`/admin`} component={AdminLayout} />}
        {hasToRedirect && <Redirect from="/" to={redirectUrl} />}
      </Switch>
    </UserContext.Provider>
  )
}
