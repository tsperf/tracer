import * as path from 'node:path'
import Fastify from 'fastify'
import ws from '@fastify/websocket'

import type {
  FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import {
  fastifyTRPCPlugin,
} from '@trpc/server/adapters/fastify'
import fastifyStatic from '@fastify/static'
import { serverPort } from '../traceDiagnostics'
import type { AppRouter } from './router'
import { createContext, mkAppRouter } from './router'

export async function startServer() {
  const fastify = Fastify({
    logger: true,
    maxParamLength: 5000,
  })

  const appRouter = mkAppRouter()

  fastify.register(ws)

  fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error)
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  })

  // eslint-disable-next-line no-console
  console.log('dirname', __dirname)
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'static'),
    prefix: '/app/', // optional: default '/'
    //   constraints: { host: 'localhost' }, // optional: default {}
  })

  // // Declare a route
  // fastify.get('/', async function handler(request, reply) {
  //    return { hello: 'world' };
  // });

  try {
    await fastify.listen({ port: serverPort, host: 'localhost' })
  }
  catch (err) {
    fastify.log.error(err)
  }
}
