# FreeBSD SSO UI
The frontend pages of FreeBSD SSO using Ory SDK.


## Requirement
- [Node.js v20](https://nodejs.org/)
  - NPM v10
- [Next.js](https://nextjs.org/)
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
- [Ory Custom UI](https://www.ory.sh/docs/kratos/bring-your-own-ui/custom-ui-overview)
  - [@ory/client](https://github.com/ory/sdk)
  - [@ory/elements](https://github.com/ory/elements)
  - [@ory/integrations](https://github.com/ory/integrations)

## Development

### Configuration
Copy and rename `.env.example` to `.env`.

```yml
# .env
KRATOS_API_ENDPOINT="http://localhost:4433"
```

### Script
Install dependencies:
```
npm install
```

Run in development mode:
```
npm run dev
```

Export static pages:
```
npm run build
```

> The middleware `src/app/api/.ory/route.ts` can be omitted during the static page build process.
