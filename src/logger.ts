import * as vscode from 'vscode'

const outputChannel = vscode.window.createOutputChannel('Type Complexity Tracer')

let shown = false
export function log(...args: unknown[]) {
  outputChannel.appendLine(args.map(a => typeof a === 'object' ? JSON.stringify(a || {}, null, 2) : a).join(' '))
  if (!shown) {
    // outputChannel.show()
    shown = true
  }
}
