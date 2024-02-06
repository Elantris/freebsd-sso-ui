// Kratos middleware for NextJS + AppDir
// https://github.com/ory/integrations/pull/52

import { NextRequest } from 'next/server'

function filterRequestHeaders(headers: Headers, forwardAdditionalHeaders?: string[]): Headers {
  const defaultForwardedHeaders = [
    'accept',
    'accept-charset',
    'accept-encoding',
    'accept-language',
    'authorization',
    'cache-control',
    'content-type',
    'cookie',
    'host',
    'user-agent',
    'referer',
  ]

  const filteredHeaders = new Headers()
  headers.forEach((value, key) => {
    const isValid = defaultForwardedHeaders.includes(key) || (forwardAdditionalHeaders ?? []).includes(key)
    if (isValid) filteredHeaders.set(key, value)
  })

  return filteredHeaders
}

const handler = async (request: NextRequest, { params }: { params: { paths: string[] } }) => {
  const path = request.nextUrl.pathname.replace('/api/.ory', '')
  const flowUrl = new URL(path, process.env.KRATOS_API_ENDPOINT)
  flowUrl.search = request.nextUrl.search

  const getBody = async () => {
    if (request.method === 'GET') {
      return undefined
    }
    const body = await request.json()
    return body
  }

  const body = await getBody()

  const headers = filterRequestHeaders(request.headers)
  headers.set('X-Ory-Base-URL-Rewrite', 'false')
  headers.set('Ory-Base-URL-Rewrite', 'false')
  headers.set('Ory-No-Custom-Domain-Redirect', 'true')

  const payload = {
    method: request.method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  }

  const resp = await fetch(flowUrl.toString(), payload)
  return resp
}

export { handler as GET, handler as POST }

export const runtime = 'edge'
