'use client'

import { handleFlowError, ory } from '@/utils/ory'
import { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/client'
import { UserAuthCard } from '@ory/elements'
import { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const flowId = searchParams.get('flow')
  const returnTo = searchParams.get('return_to')

  const [flow, setFlow] = useState<RegistrationFlow>()

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      ory
        .getRegistrationFlow({ id: flowId })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleFlowError(router, 'registration', setFlow))
      return
    }

    ory
      .createBrowserRegistrationFlow({
        returnTo: returnTo ?? undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(handleFlowError(router, 'registration', setFlow))
  }, [flow, flowId, returnTo, router])

  const onSubmit = async (values: UpdateRegistrationFlowBody) => {
    if (!flow?.id) {
      return
    }

    window.history.pushState(null, '', `?flow=${flow.id}`)

    ory
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: values,
      })
      .then(async ({ data }) => {
        if (data.continue_with) {
          for (const item of data.continue_with) {
            switch (item.action) {
              case 'show_verification_ui':
                router.push('/verification?flow=' + item.flow.id)
                return
            }
          }
        }

        router.push(flow.return_to ?? '/')
      })
      .catch(handleFlowError(router, 'registration', setFlow))
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
      <div className="container">
        {flow ? (
          <UserAuthCard
            flowType={'registration'}
            flow={flow}
            additionalProps={{
              loginURL: {
                handler: () => {
                  router.push('/login')
                },
              },
            }}
            includeScripts={true}
            onSubmit={({ body }) => onSubmit(body as UpdateRegistrationFlowBody)}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}
