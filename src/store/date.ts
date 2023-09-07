import { create } from 'zustand'
import { type DateType } from '../types'

interface State {
  day: number
  month: number
  year: number
  age: DateType
  isValidDay: boolean
  isValidMonth: boolean
  isValidYear: boolean
  isValidDate: boolean
  isEmpty: boolean
  getDay: (day: number) => void
  getMonth: (month: number) => void
  getYear: (year: number) => void
  calculateAge: (e: React.FormEvent<HTMLButtonElement>) => void
}

const differenceInDays = (currentDate: Date, oldDate: Date): number => {
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const currentDay = currentDate.getDate()
  const oldDay = oldDate.getDate()
  // 2023 - 8+1: 9 - 0 = 30 days in this month
  const numberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate()
  if (currentDay === oldDay) return 0
  if (currentDay > oldDay) return Math.abs(currentDay - oldDay)
  // 07 + 30 - 23 = 14 days
  return Math.abs(currentDay + numberOfDays - oldDay)
}

const differenceInMonths = (currentDate: Date, oldMonth: number): number => {
  const currentMonth = currentDate.getMonth() + 1
  if (currentMonth === oldMonth) return 0
  if (currentMonth > oldMonth) return Math.abs(oldMonth - currentMonth)

  return 12 - Math.abs(oldMonth - currentMonth)
}

const differenceInYears = (
  currentDate: Date,
  oldYear: number,
  oldMonth: number
): number => {
  const currentMonth = currentDate.getMonth()
  const yearDiff = currentDate.getFullYear() - oldYear
  if (currentDate.getFullYear() === oldYear) return 0
  if (currentDate.getMonth() + 1 === 12 || currentMonth > oldMonth)
    return yearDiff
  return yearDiff - 1
}

// Remember that the month is 0-based so February is actually 1...
const validateDate = (year: number, month: number, day: number): boolean => {
  const accurateMonth = month - 1
  const date = new Date(year, accurateMonth, day)

  if (
    date.getFullYear() == year &&
    date.getMonth() == accurateMonth &&
    date.getDate() == day
  ) {
    return true
  }
  return false
}

export const useDate = create<State>((set, get) => ({
  day: 0,
  month: 0,
  year: 0,
  age: {
    day: 0,
    month: 0,
    year: 0
  },
  isValidDay: true,
  isValidMonth: true,
  isValidYear: true,
  isEmpty: false,
  isValidDate: true,
  getDay: (day: number) => {
    if (day > 31) return set({ isValidDay: false })
    set({ day, isValidDay: true, isEmpty: false })
  },
  getMonth: (month: number) => {
    if (month > 12) return set({ isValidMonth: false })
    set({ month, isValidMonth: true, isEmpty: false })
  },
  getYear: (year: number) => {
    const currentYear = new Date().getFullYear()
    if (year > currentYear) return set({ isValidYear: false })
    set({ year, isValidYear: true, isEmpty: false })
  },
  calculateAge: (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const { day, month, year } = get()
    const validateFields = day && month && year ? true : false

    if (!validateFields) return set({ isEmpty: true })

    const pastDate = new Date(`${year}-${month}-${day}`)
    const currentDate = new Date()

    const daysDiff = differenceInDays(currentDate, pastDate)
    const monthsDiff = differenceInMonths(currentDate, month)
    const yearsDiff = differenceInYears(currentDate, year, monthsDiff)

    const isValidDate: boolean = validateDate(year, month, day)
    if (!isValidDate) return set({ isValidDate })

    set({
      age: { day: daysDiff, month: monthsDiff, year: yearsDiff },
      isValidDate
    })
  }
}))
