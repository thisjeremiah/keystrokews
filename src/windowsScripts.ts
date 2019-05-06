import * as path from 'path'
import * as os from 'os'
import { promisify } from 'util'
import { writeFile } from 'fs'
import { execFile } from 'child_process'
// @ts-ignore
import PowerShell from 'powershell'

const writeFileAsync = promisify(writeFile)
const execFileAsync = promisify(execFile)

const raw = String.raw

const ELEVATE = raw`
  @echo off
  if _%1_==_payload_  goto :payload

  :getadmin
      echo %~nx0: elevating self
      set vbs=%temp%\getadmin.vbs
      echo Set UAC = CreateObject^("Shell.Application"^)                >> "%vbs%"
      echo UAC.ShellExecute "%~s0", "payload %~sdp0 %*", "", "runas", 1 >> "%vbs%"
      "%temp%\getadmin.vbs"
      del "%temp%\getadmin.vbs"
  goto :eof

  :payload
`

const execDir = path.dirname(process.execPath)

export function sendKeyScript(key: string) {
  return raw`
    $wsh = New-Object -ComObject WScript.Shell;
    $wsh.SendKeys('{${key}}')`
}

export async function windowsSendKey_old(key: string) {
  try {
    const scriptPath = `${os.tmpdir()}/sendkey.cmd`
    console.log('send key', key)
    const script = sendKeyScript(key)
    const elevatedScript = script // `${ELEVATE}\r\n${script}`
    await writeFileAsync(scriptPath, elevatedScript)
    await execFileAsync(scriptPath)
  } catch (e) {
    console.error(e)
  }
}

export async function windowsSendKey(key: string) {
  // Start the process
  let ps = new PowerShell(sendKeyScript(key))

  // Handle process errors (e.g. powershell not found)
  // @ts-ignore
  ps.on('error', err => {
    console.error(err)
  })

  // Stdout
  // @ts-ignore
  ps.on('output', data => {
    console.log(data)
  })

  // Stderr
  // @ts-ignore
  ps.on('error-output', data => {
    console.error(data)
  })

  // End
  // @ts-ignore
  ps.on('end', code => {
    // Do Something on end
  })
}
