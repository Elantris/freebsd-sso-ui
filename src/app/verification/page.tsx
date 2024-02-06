'use client'

import { ory } from '@/utils/ory'
import { UpdateVerificationFlowBody, VerificationFlow } from '@ory/client'
import { UserAuthCard } from '@ory/elements'
import { AxiosError } from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const [flow, setFlow] = useState<VerificationFlow>()

  const router = useRouter()
  const searchParams = useSearchParams()
  const flowId = searchParams.get('flow')
  const returnTo = searchParams.get('return_to')

  useEffect(() => {
    if (flow) {
      return
    }

    if (flowId) {
      ory
        .getVerificationFlow({ id: flowId })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:

            case 403:
              return router.push('/verification')
          }

          throw err
        })
      return
    }

    ory
      .createBrowserVerificationFlow({
        returnTo: returnTo ?? undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
            return router.push('/')
        }

        throw err
      })
  }, [flow, flowId, returnTo, router])

  const onSubmit = async (values: UpdateVerificationFlowBody) => {
    if (!flow?.id) {
      return
    }

    window.history.pushState(null, '', `?flow=${flow.id}`)

    ory
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: values,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch((err: AxiosError<any>) => {
        switch (err.response?.status) {
          case 400:
            setFlow(err.response?.data)
            return
          case 410:
            const newFlowID = err.response.data.use_flow_id
            window.history.pushState(null, '', `?flow=${newFlowID}`)
            ory.getVerificationFlow({ id: newFlowID }).then(({ data }) => setFlow(data))
            return
        }

        throw err
      })
  }

  return (
    <div className="page">
      <div className="container">
        {flow ? (
          <UserAuthCard
            flowType={'verification'}
            flow={flow}
            additionalProps={{
              signupURL: {
                handler: () => router.push('/registration'),
              },
            }}
            onSubmit={({ body }) => onSubmit(body as UpdateVerificationFlowBody)}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  )
}
