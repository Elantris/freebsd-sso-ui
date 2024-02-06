'use client'

import { handleFlowError, ory } from '@/utils/ory'
import { LoginFlow, UpdateLoginFlowBody } from '@ory/client'
import { UserAuthCard } from '@ory/elements'
import { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flowId = searchParams.get('flow')
  const returnTo = searchParams.get('return_to')
  const refresh = searchParams.get('refresh')
  const aal = searchParams.get('aal')

  const [flow, setFlow] = useState<LoginFlow>()

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      ory
        .getLoginFlow({ id: flowId })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'login', setFlow))
      return
    }

    ory
      .createBrowserLoginFlow({
        refresh: Boolean(refresh),
        aal: aal ?? undefined,
        returnTo: returnTo ?? undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'login', setFlow))
  }, [aal, flow, flowId, refresh, returnTo, router])

  const onSubmit = (values: UpdateLoginFlowBody) => {
    if (!flow?.id) {
      return
    }
    window.history.pushState(null, '', `?flow=${flow.id}`)

    ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: values,
      })
      .then(() => {
        if (flow.return_to) {
          router.push(flow.return_to)
          return
        }
        router.push('/')
      })
      .then(() => {})
      .catch(handleFlowError(router, 'login', setFlow))
      .catch((err: AxiosError<any>) => {
        if (err.response?.status === 400) {
          setFlow(err.response?.data)
          return
        }
        return Promise.reject(err)
      })
  }

  return (
    <div className="page">
      {flow ? (
        <div className="container">
          <UserAuthCard
            flowType={'login'}
            flow={flow}
            additionalProps={{
              forgotPasswordURL: {
                handler: () => {
                  router.push(`/recovery?return_to=${flow.return_to}`)
                },
              },
              signupURL: {
                handler: () => {
                  router.push(`/registration?return_to=${flow.return_to}`)
                },
              },
            }}
            includeScripts={true}
            onSubmit={({ body }) => onSubmit(body as UpdateLoginFlowBody)}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}
