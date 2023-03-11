import { AxiosResponse } from 'axios'
import crypto from 'crypto'
import fs from 'fs'

/**
 * Logs error with console.error. Does not throw error.
 */
export function err(e: Error): void {
  console.error(e.message)
}
export function errLog(msg: string): void {
  err(new Error(msg))
}

export function error(e: Error): void {
  err(e)
  throw e
}

export function log(msg: string): void {
  console.log(msg)
}

export function isDefined<T>(input: T | undefined): input is T {
  return input !== undefined && input !== null
}

export function handleResponse(
  res: AxiosResponse<unknown>,
  onError?: () => void,
  onSuccess?: () => void,
): boolean {
  if (res.status > 399) {
    onError?.()
    return false
  } else {
    onSuccess?.()
    return true
  }
}

export function isValidResponse(
  res: void | AxiosResponse<unknown>,
): res is AxiosResponse<unknown> {
  return !!res
}

export function range(range: number): number[] {
  return Array(range)
    .fill(0)
    .map((zero, i) => i)
}

export function toCamelCase(
  str: string,
  casing: 'space' | 'snake' = 'space',
): string {
  const cap = (str: string) => str.charAt(0).toLocaleUpperCase() + str.slice(1)
  const low = (str: string) => str.charAt(0).toLocaleLowerCase() + str.slice(1)

  let stringArray: string[] = []
  if (casing === 'space') {
    stringArray = str.split(' ')
  } else if (casing === 'snake') {
    stringArray = str.split('_')
  } else {
    return str
  }

  return stringArray.map((word, i) => (i ? cap(word) : low(word))).join('')
}

export function wait(ms = 100): Promise<void> {
  return new Promise((res) => setTimeout(() => res(), ms))
}

export async function sha256(message: string): Promise<string> {
  return crypto.createHash('sha256').update(message).digest('base64')
}

export function createSalt(): string {
  return crypto.randomBytes(16).toString('base64')
}

export function validEmail(email: string): boolean {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null
}

export function passwordsMatch(
  password: string,
  checkPassword: string,
): boolean {
  return password === checkPassword
}

export function regexExtract(str: string, regex: RegExp): string[] {
  const matches: string[] = []
  for (const match of str.matchAll(regex)) {
    const group: string | undefined =
      match && match.length > 0 ? match[1] : undefined
    if (group) matches.push(group)
  }
  return matches
}

export function capitalize(str: string, delim = ' '): string {
  return str
    .split(delim)
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join(delim)
}

export function round(
  num: number,
  digits = 2,
  options: { method: 'round' | 'ceil' | 'floor' } = { method: 'round' },
): number {
  const mult = Math.pow(10, digits)

  switch (options.method) {
    case 'round':
      return Math.round(num * mult) / mult
    case 'ceil':
      return Math.ceil(num * mult) / mult
    case 'floor':
      return Math.floor(num * mult) / mult
    default:
      return Math.round(num * mult) / mult
  }
}

export function random(range: number, min = 0): number {
  return Math.floor(Math.random() * range) + min
}

export async function retry<T>(
  func: () => Promise<T>,
  tries = 3,
  ms = 5000,
): Promise<T | undefined> {
  let currentTry = 0
  while (currentTry < tries) {
    currentTry && (await wait(ms)) // skip first
    currentTry++
    const result = await func()

    if (result) {
      return result
    }
  }

  return undefined
}

export async function retryError<T>(
  func: () => Promise<T>,
  tries = 3,
  ms = 5000,
): Promise<T | undefined> {
  let currentTry = 0
  while (currentTry < tries) {
    try {
      currentTry && (await wait(ms)) // skip first
      currentTry++
      const result = await func()

      if (result) {
        return result
      }
    } catch (e) {
      if (currentTry >= tries) {
        throw e as Error
      }
    }
  }

  return undefined
}

export function isLike(
  str1: string | undefined,
  str2: string | undefined,
): boolean {
  if (str1 === undefined || str2 === undefined) return false
  const string1 = str1.toLowerCase().trim()
  const string2 = str2.toLowerCase().trim()
  return string1 === string2
}

export function isLikeAny(
  compare: string | undefined,
  strings: string[],
): boolean {
  return strings
    .map((str) => isLike(str, compare))
    .some((alike) => alike === true)
}

export function norm(str: string | undefined): string {
  return str?.toLowerCase()?.trim() || ''
}

export function single(rawStr = ''): string {
  const str = rawStr.trim()
  const length = str.length
  const lastChar = str.slice(-1).toLocaleLowerCase()
  const lastChars = str.slice(-3)

  if (lastChars === 'ies') {
    return str.slice(0, length - 3) + 'y'
  } else if (lastChar === 's') {
    return str.slice(0, length - 1)
  }

  return str
}

export function split(str: string | undefined, delim = ' '): string[] {
  return str?.split(delim).map((s) => s.trim()) || []
}

/**
 * Epoch time in ms.
 */
export function time(unit?: 'S' | 'MS'): number {
  const epoch = new Date().getTime()
  if (unit === 'MS') {
    return epoch
  }
  if (unit === 'S') {
    return epoch / 1000
  }
  return epoch
}

export function read<T>(file: string): T | undefined {
  try {
    const data = fs.readFileSync(file, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    return undefined
  }
}

export function write(file: string, data: string | unknown): void {
  if (typeof data === 'string') {
    fs.writeFileSync(file, data)
  } else {
    fs.writeFileSync(file, JSON.stringify(data))
  }
}
