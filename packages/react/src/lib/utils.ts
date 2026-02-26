import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

const RELATIVE_TIME_FORMAT = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

export function formatRelativeTime(dateStr: string | number | Date): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / 60000)
  const diffHrs = Math.round(diffMs / 3600000)
  const diffDays = Math.round(diffMs / 86400000)
  if (Math.abs(diffMins) < 60) return RELATIVE_TIME_FORMAT.format(diffMins, "minute")
  if (Math.abs(diffHrs) < 24) return RELATIVE_TIME_FORMAT.format(diffHrs, "hour")
  return RELATIVE_TIME_FORMAT.format(diffDays, "day")
}
