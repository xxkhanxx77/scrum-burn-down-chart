export interface SprintData {
  id: number
  sprintNumber: number
  startDate: string
  endDate: string
  startPoint: number
  dailyCompleted: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
  }
  dailyAdded: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
  }
  dailyRemaining: {
    monday: number
    tuesday: number
    wednesday: number
    thursday: number
    friday: number
  }
  totalBurn: number
  totalAdded: number
  notes: string
  [key: string]: any
}

