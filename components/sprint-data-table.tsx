"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit2, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { SprintData } from "@/types/sprint"

interface SprintDataTableProps {
  sprint: SprintData
  updateSprint: (sprint: SprintData) => void
  updateSprintNumber: (id: number, newNumber: number) => void
  deleteSprint: (id: number) => void
}

export default function SprintDataTable({
  sprint,
  updateSprint,
  updateSprintNumber,
  deleteSprint,
}: SprintDataTableProps) {
  const [localSprint, setLocalSprint] = useState<SprintData>(sprint)
  const [isEditingNumber, setIsEditingNumber] = useState(false)
  const [newSprintNumber, setNewSprintNumber] = useState(sprint.sprintNumber.toString())
  const [validationError, setValidationError] = useState<string | null>(null)

  // Update local state when sprint prop changes
  useEffect(() => {
    setLocalSprint(sprint)
    setNewSprintNumber(sprint.sprintNumber.toString())
  }, [sprint])

  // Update the handleChange function to add validation for completed points
  const handleChange = (field: string, value: any) => {
    let updatedSprint = { ...localSprint }
    setValidationError(null)

    // Check if this is a completed points field
    const isCompletedField = field.startsWith("dailyCompleted.")

    if (field.includes(".")) {
      const [parent, child] = field.split(".")

      // Convert value to number if applicable
      const numericValue = typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value

      // For completed points, validate against starting points
      if (isCompletedField) {
        // Calculate total completed points if this change is applied
        const updatedCompleted = {
          ...updatedSprint.dailyCompleted,
          [child]: numericValue,
        }

        const totalCompleted =
          updatedCompleted.monday +
          updatedCompleted.tuesday +
          updatedCompleted.wednesday +
          updatedCompleted.thursday +
          updatedCompleted.friday

        // If total would exceed starting points, cap the value
        if (totalCompleted > updatedSprint.startPoint) {
          // Calculate how much we can add without exceeding
          const currentTotal =
            updatedSprint.dailyCompleted.monday +
            updatedSprint.dailyCompleted.tuesday +
            updatedSprint.dailyCompleted.wednesday +
            updatedSprint.dailyCompleted.thursday +
            updatedSprint.dailyCompleted.friday -
            updatedSprint.dailyCompleted[child as keyof typeof updatedSprint.dailyCompleted]

          const maxAllowed = Math.max(0, updatedSprint.startPoint - currentTotal)

          // Update with capped value
          updatedSprint = {
            ...updatedSprint,
            [parent]: {
              ...(updatedSprint[parent as keyof SprintData] as object),
              [child]: maxAllowed,
            },
          }

          // Show validation error
          setValidationError(
            `Completed points cannot exceed starting points (${updatedSprint.startPoint}). Value has been capped.`,
          )
        } else {
          // Update normally
          updatedSprint = {
            ...updatedSprint,
            [parent]: {
              ...(updatedSprint[parent as keyof SprintData] as object),
              [child]: numericValue,
            },
          }
        }
      } else {
        // For non-completed fields, update normally
        updatedSprint = {
          ...updatedSprint,
          [parent]: {
            ...(updatedSprint[parent as keyof SprintData] as object),
            [child]: numericValue,
          },
        }
      }
    } else {
      // For direct fields like startPoint, notes, etc.
      updatedSprint = {
        ...updatedSprint,
        [field]: field === "notes" ? value : typeof value === "string" && !isNaN(Number(value)) ? Number(value) : value,
      }
    }

    setLocalSprint(updatedSprint)
    updateSprint(updatedSprint)
  }

  const handleSprintNumberChange = () => {
    const numberValue = Number.parseInt(newSprintNumber)
    if (!isNaN(numberValue)) {
      updateSprintNumber(sprint.id, numberValue)
      setIsEditingNumber(false)
    }
  }

  // Calculate total remaining points
  const totalRemaining = localSprint.dailyRemaining.friday

  return (
    <div className="space-y-6">
      {validationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Label htmlFor="sprintNumber">Sprint Number</Label>
            {isEditingNumber ? (
              <div className="flex items-center gap-2">
                <Input
                  id="sprintNumber"
                  value={newSprintNumber}
                  onChange={(e) => setNewSprintNumber(e.target.value)}
                  type="number"
                  className="w-24"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSprintNumberChange()
                    }
                    if (e.key === "Escape") {
                      setIsEditingNumber(false)
                      setNewSprintNumber(sprint.sprintNumber.toString())
                    }
                  }}
                />
                <Button size="sm" variant="ghost" onClick={handleSprintNumberChange} className="h-8 w-8 p-0">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">{localSprint.sprintNumber}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsEditingNumber(true)}>
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            value={localSprint.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            type="date"
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            value={localSprint.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            type="date"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="startPoint" className="flex items-center">
          Starting Points
          <span className="text-xs text-muted-foreground ml-2">(Maximum points that can be completed)</span>
        </Label>
        <Input
          id="startPoint"
          value={localSprint.startPoint}
          onChange={(e) => handleChange("startPoint", e.target.value)}
          type="number"
          min="0"
          className="font-medium"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Daily Completed Points</h3>
        <div className="grid grid-cols-5 gap-2">
          <div>
            <Label htmlFor="monday">Monday</Label>
            <Input
              id="monday"
              value={localSprint.dailyCompleted.monday}
              onChange={(e) => handleChange("dailyCompleted.monday", e.target.value)}
              type="number"
              min="0"
              max={localSprint.startPoint}
              className={localSprint.dailyCompleted.monday > 0 ? "border-green-500 dark:border-green-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="tuesday">Tuesday</Label>
            <Input
              id="tuesday"
              value={localSprint.dailyCompleted.tuesday}
              onChange={(e) => handleChange("dailyCompleted.tuesday", e.target.value)}
              type="number"
              min="0"
              max={localSprint.startPoint}
              className={localSprint.dailyCompleted.tuesday > 0 ? "border-green-500 dark:border-green-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="wednesday">Wednesday</Label>
            <Input
              id="wednesday"
              value={localSprint.dailyCompleted.wednesday}
              onChange={(e) => handleChange("dailyCompleted.wednesday", e.target.value)}
              type="number"
              min="0"
              max={localSprint.startPoint}
              className={localSprint.dailyCompleted.wednesday > 0 ? "border-green-500 dark:border-green-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="thursday">Thursday</Label>
            <Input
              id="thursday"
              value={localSprint.dailyCompleted.thursday}
              onChange={(e) => handleChange("dailyCompleted.thursday", e.target.value)}
              type="number"
              min="0"
              max={localSprint.startPoint}
              className={localSprint.dailyCompleted.thursday > 0 ? "border-green-500 dark:border-green-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="friday">Friday</Label>
            <Input
              id="friday"
              value={localSprint.dailyCompleted.friday}
              onChange={(e) => handleChange("dailyCompleted.friday", e.target.value)}
              type="number"
              min="0"
              max={localSprint.startPoint}
              className={localSprint.dailyCompleted.friday > 0 ? "border-green-500 dark:border-green-700" : ""}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Daily Added Points</h3>
        <div className="grid grid-cols-5 gap-2">
          <div>
            <Label htmlFor="mondayAdded">Monday</Label>
            <Input
              id="mondayAdded"
              value={localSprint.dailyAdded.monday}
              onChange={(e) => handleChange("dailyAdded.monday", e.target.value)}
              type="number"
              min="0"
              className={localSprint.dailyAdded.monday > 0 ? "border-blue-500 dark:border-blue-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="tuesdayAdded">Tuesday</Label>
            <Input
              id="tuesdayAdded"
              value={localSprint.dailyAdded.tuesday}
              onChange={(e) => handleChange("dailyAdded.tuesday", e.target.value)}
              type="number"
              min="0"
              className={localSprint.dailyAdded.tuesday > 0 ? "border-blue-500 dark:border-blue-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="wednesdayAdded">Wednesday</Label>
            <Input
              id="wednesdayAdded"
              value={localSprint.dailyAdded.wednesday}
              onChange={(e) => handleChange("dailyAdded.wednesday", e.target.value)}
              type="number"
              min="0"
              className={localSprint.dailyAdded.wednesday > 0 ? "border-blue-500 dark:border-blue-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="thursdayAdded">Thursday</Label>
            <Input
              id="thursdayAdded"
              value={localSprint.dailyAdded.thursday}
              onChange={(e) => handleChange("dailyAdded.thursday", e.target.value)}
              type="number"
              min="0"
              className={localSprint.dailyAdded.thursday > 0 ? "border-blue-500 dark:border-blue-700" : ""}
            />
          </div>
          <div>
            <Label htmlFor="fridayAdded">Friday</Label>
            <Input
              id="fridayAdded"
              value={localSprint.dailyAdded.friday}
              onChange={(e) => handleChange("dailyAdded.friday", e.target.value)}
              type="number"
              min="0"
              className={localSprint.dailyAdded.friday > 0 ? "border-blue-500 dark:border-blue-700" : ""}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Daily Remaining Points (Calculated)</h3>
        <div className="grid grid-cols-5 gap-2">
          <div>
            <Label>Monday</Label>
            <Input value={localSprint.dailyRemaining.monday} disabled />
          </div>
          <div>
            <Label>Tuesday</Label>
            <Input value={localSprint.dailyRemaining.tuesday} disabled />
          </div>
          <div>
            <Label>Wednesday</Label>
            <Input value={localSprint.dailyRemaining.wednesday} disabled />
          </div>
          <div>
            <Label>Thursday</Label>
            <Input value={localSprint.dailyRemaining.thursday} disabled />
          </div>
          <div>
            <Label>Friday</Label>
            <Input value={localSprint.dailyRemaining.friday} disabled />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Sprint Notes</Label>
        <Textarea
          id="notes"
          value={localSprint.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Add any notes or comments about this sprint..."
          className="min-h-[100px]"
        />
      </div>

      {/* Refined Sprint Totals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-card">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Total Start Point:</Label>
            <span className="font-medium">{Math.round(localSprint.startPoint)}</span>
          </div>
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Total Burn Point:</Label>
            <span className="font-medium">{Math.round(localSprint.totalBurn)}</span>
          </div>
          {localSprint.totalAdded > 0 && (
            <div className="flex justify-between items-center">
              <Label className="text-muted-foreground">Total Added Point:</Label>
              <span className="font-medium">{Math.round(localSprint.totalAdded)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <Label className="text-muted-foreground">Total Remaining:</Label>
            <span className="font-medium">{Math.round(totalRemaining)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-muted-foreground">Total Burn</Label>
            <div className="text-2xl font-bold">
              {Math.round(localSprint.totalBurn)} / {Math.round(localSprint.startPoint + localSprint.totalAdded)}
              {localSprint.totalAdded > 0 && (
                <div className="text-xs text-muted-foreground">
                  ({Math.round(localSprint.startPoint)} + {Math.round(localSprint.totalAdded)})
                </div>
              )}
            </div>
          </div>
          <Button variant="destructive" size="icon" onClick={() => deleteSprint(localSprint.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

