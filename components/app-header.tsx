"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Upload, Search, Home, Plus, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface AppHeaderProps {
  onExportData: () => void
  onImportData: (data: any) => void
  onAddSprint: () => void
  onDashboardClick: () => void
  onSprintSelect: (id: number) => void
  sprints: Array<{ id: number; sprintNumber: number }>
  selectedSprint: number | null
  showDashboard: boolean
}

export function AppHeader({
  onExportData,
  onImportData,
  onAddSprint,
  onDashboardClick,
  onSprintSelect,
  sprints,
  selectedSprint,
  showDashboard,
}: AppHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllSprints, setShowAllSprints] = useState(false)

  // Filter sprints based on search query
  const filteredSprints = sprints.filter((sprint) => sprint.sprintNumber.toString().includes(searchQuery))

  // Sort sprints by sprint number in descending order (newest first)
  const sortedSprints = [...sprints].sort((a, b) => b.sprintNumber - a.sprintNumber)

  // Get the last 5 sprints
  const recentSprints = sortedSprints.slice(0, 5)

  // Determine which sprints to display based on toggle state
  const displayedSprints = showAllSprints ? sortedSprints : recentSprints

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const rows = content.split("\n")
        const headers = rows[0].split(",")

        // Parse CSV data
        const data = rows
          .slice(1)
          .filter((row) => row.trim())
          .map((row) => {
            const values = row.split(",")
            const item: any = {}

            headers.forEach((header, index) => {
              // Handle quoted values (for notes field)
              if (values[index]?.startsWith('"') && !values[index]?.endsWith('"')) {
                let quotedValue = values[index]
                let j = index + 1
                while (j < values.length && !values[j]?.endsWith('"')) {
                  quotedValue += "," + values[j]
                  j++
                }
                if (j < values.length) {
                  quotedValue += "," + values[j]
                }
                item[header.trim()] = quotedValue.replace(/^"|"$/g, "").replace(/""/g, '"')
              } else {
                item[header.trim()] = values[index]?.replace(/^"|"$/g, "").replace(/""/g, '"') || ""
              }
            })

            return item
          })

        onImportData(data)
      } catch (error) {
        console.error("Error parsing CSV:", error)
        alert("Error importing data. Please check the file format.")
      }
    }
    reader.readAsText(file)

    // Reset the input value so the same file can be selected again
    event.target.value = ""
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sprint Burndown Tracker</h1>
        {/* Theme toggle button removed */}
      </div>

      {/* Main Navigation */}
      <div className="flex justify-between items-center border-b pb-4">
        <Button variant={showDashboard ? "default" : "outline"} onClick={onDashboardClick} className="gap-2">
          <Home className="h-4 w-4" />
          Dashboard
        </Button>

        {/* Data Import/Export */}
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onExportData} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Sprint Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload CSV File</Label>
                  <Input id="file-upload" type="file" accept=".csv" onChange={handleFileImport} />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>The CSV file should have the following headers:</p>
                  <p className="mt-1">
                    Sprint, Start Date, End Date, Start Point, Monday Completed, Tuesday Completed, Wednesday Completed,
                    Thursday Completed, Friday Completed, Monday Added, Tuesday Added, Wednesday Added, Thursday Added,
                    Friday Added, Total Burn, Total Added, Notes
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sprint Navigation - Always show this section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onAddSprint} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Sprint
          </Button>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search sprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>

          <Button variant="outline" onClick={() => setShowAllSprints(!showAllSprints)} className="gap-2">
            {showAllSprints ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Recent
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show All ({sprints.length})
              </>
            )}
          </Button>
        </div>

        {searchQuery && filteredSprints.length > 0 ? (
          <div className="bg-popover border border-border rounded-md shadow-md p-1">
            <div className="max-h-60 overflow-auto">
              {filteredSprints.map((sprint) => (
                <Button
                  key={sprint.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onSprintSelect(sprint.id)
                    setSearchQuery("")
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Sprint {sprint.sprintNumber}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {displayedSprints.map((sprint) => (
              <Button
                key={sprint.id}
                variant={!showDashboard && selectedSprint === sprint.id ? "default" : "outline"}
                onClick={() => onSprintSelect(sprint.id)}
              >
                Sprint {sprint.sprintNumber}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

