declare module 'powershell' {
  class PowerShell {
    constructor(...args: any[])
    on(message: any, fn: (arg?: any) => any): any
  }
  export default PowerShell
}
