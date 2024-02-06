import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { DependencyList, useEffect, useState } from 'react'
import { ory } from './ory'

export function LogoutLink(deps?: DependencyList) {
  const [logoutToken, setLogoutToken] = useState('')
  const router = useRouter()

  useEffect(() => {
    ory
      .createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            return
        }

        return Promise.reject(err)
      })
  }, deps)

  return () => {
    if (logoutToken) {
      ory.updateLogoutFlow({ token: logoutToken }).then(() => router.push('/login'))
    }
  }
}
