declare module 'node-powershell' {
  class Shell {
    constructor(options: any)
    addCommand(command: string): any
    invoke(): Promise<any>
  }
  export default Shell
}
