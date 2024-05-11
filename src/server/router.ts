import { z } from 'zod'
import * as vscode from 'vscode'
import { initTRPC } from '@trpc/server'
import { createTRPCClient as createTRPCProxyClient, httpLink } from '@trpc/client'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { addTraceDiagnostic, clearTaceDiagnostics, getDurationWarning, gotoPosition, serverPort } from '../traceDiagnostics'

export function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res }
}
export type Context = Awaited<ReturnType<typeof createContext>>

export type AddWarningArgs = z.infer<typeof addWarningArgs>
export const addWarningArgs = z.object({
  fileName: z.string(),
  pos: z.number(),
  end: z.number(),
  duration: z.number(),
})

export function mkAppRouter() {
  const t = initTRPC.create()

  const appRouter = t.router({
    durationWarning: t.procedure.query(() => {
      return getDurationWarning()
    }),
    clearWarnings: t.procedure.query(() => {
      clearTaceDiagnostics()
      return 'cleared'
    }),
    addWarning: t.procedure.input(addWarningArgs).query((opts) => {
      const { fileName, pos, end, duration } = opts.input
      addTraceDiagnostic(fileName, pos, end, duration)
      return 'added'
    }),
    gotoPosition: t.procedure
      .input(z.object({ fileName: z.string(), pos: z.number() }))
      .query((opts) => {
        const { fileName, pos } = opts.input
        gotoPosition(fileName, pos)
        return 'went'
      }),
    ping: t.procedure.query(() => {
      vscode.window.showInformationMessage('pinged from front end')
      return 'pinged'
    }),
    projectPath: t.procedure.query(() => {
      return vscode.workspace.workspaceFolders?.[0]?.name
    }),
    openFile: t.procedure.input(z.string()).query((opts) => {
      const fileName = opts.input
      vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(fileName))

      return 'opened'
    }),
  })

  return appRouter
}

export type AppRouter = ReturnType<typeof mkAppRouter>

export function mkTrpc() {
  return createTRPCProxyClient<AppRouter>({
    links: [
      // httpBatchLink({
      httpLink({
        url: `http://localhost:${serverPort}/trpc`,
        // maxURLLength: 2083,
      }),
    ],
  })
}
