/**
 * Utility Functions
 */

import { AxiosResponse } from 'axios'
import { ROLES } from '../types'
import { APIResult } from '../api'

export async function sha256(message: string): Promise<string> {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message)

  // hash the message
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export function getResult<T>(res: AxiosResponse | void): APIResult<T> {
  if (res) {
    return res.data as APIResult<T>
  } else {
    return { success: false, data: undefined, message: 'No response.' }
  }
}

export function formatDate(
  date: string | number | Date | null | undefined,
): string {
  return new Date(date || new Date()).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatNameValue(str: string | undefined): string {
  if (!str?.length) return ''

  let formattedName = str.replace(/[^a-zA-Z0-9]/g, '')
  formattedName =
    formattedName[0].toLocaleLowerCase() +
    formattedName.slice(1, formattedName.length)

  return formattedName
}

export function isSuperAdmin(roleId: number | undefined): boolean {
  return !!roleId && roleId <= ROLES.SUPER_ADMIN
}

export function isAdmin(roleId: number | undefined): boolean {
  return !!roleId && roleId <= ROLES.ADMIN
}

export function isManager(roleId: number | undefined): boolean {
  return !!roleId && roleId <= ROLES.MANAGER
}

export function wait(ms = 100): Promise<void> {
  return new Promise((res) => setTimeout(() => res(), ms))
}

export function split(str: string | undefined, delim = ' '): string[] {
  if (!str) return []
  return str.split(delim).map((s) => s.trim())
}

export function log(msg: unknown): void {
  console.log(msg)
}

export function err(e: Error): void {
  console.error(e.message)
}

export const isValidEmail = (email: string): boolean => {
  const validEmail = email
    ? email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) !== null
    : true
  return validEmail
}

export const isValidPassword = (pw: string): boolean => {
  const MIN_PASSWORD_LENGTH = 8
  const validPassword = pw
    ? /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^A-Za-z0-9]/.test(pw) &&
      pw.length > MIN_PASSWORD_LENGTH
    : true
  return validPassword
}

export const passwordsMatch = (pw: string, checkPw: string): boolean => {
  return pw === checkPw
}

export const stringColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

export function range(range: number): number[] {
  return Array(range)
    .fill(0)
    .map((zero, i) => i)
}
