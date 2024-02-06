'use client'

import { LogoutLink } from '@/utils/hooks'
import { handleFlowError, ory } from '@/utils/ory'
import { SettingsFlow, UpdateSettingsFlowBody } from '@ory/client'
import { Button, NodeMessages, UserSettingsCard, UserSettingsFlowType } from '@ory/elements'
import { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flowId = searchParams.get('flow')
  const returnTo = searchParams.get('return_to')

  const onLogout = LogoutLink()
  const [flow, setFlow] = useState<SettingsFlow>()

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      ory
        .getSettingsFlow({ id: flowId })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'settings', setFlow))
      return
    }

    ory
      .createBrowserSettingsFlow({
        returnTo: returnTo ?? undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'settings', setFlow))
  }, [flow, flowId, returnTo, router])

  const onSubmit = (values: UpdateSettingsFlowBody) => {
    if (!flow?.id) {
      return
    }
    window.history.pushState(null, '', `?flow=${flow.id}`)

    ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: values,
      })
      .then(({ data }) => {
        setFlow(data)

        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case 'show_verification_ui':
                router.push('/verification?flow=' + item.flow.id)
                return
            }
          }
        }

        if (data.return_to) {
          window.location.href = data.return_to
          return
        }
      })
      .catch(handleFlowError(router, 'settings', setFlow))
      .catch(async (err: AxiosError<any>) => {
        if (err.response?.status === 400) {
          setFlow(err.response?.data)
          return
        }

        return Promise.reject(err)
      })
  }

  return (
    <div className="page">
      <div className="container">
        {flow ? (
          <div>
            <NodeMessages uiMessages={flow.ui.messages} />

            {(['profile', 'password', 'totp', 'webauthn', 'lookup_secret', 'oidc'] as UserSettingsFlowType[]).map(
              (flowType, index) => (
                <UserSettingsCard
                  key={index}
                  flow={flow}
                  method={flowType}
                  includeScripts={true}
                  onSubmit={({ body }) => onSubmit(body as UpdateSettingsFlowBody)}
                />
              ),
            )}

            <div className="logout">
              <Button header="Logout" onClick={() => onLogout()} />
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}
