"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import {
  Line,
  Area,
  Bar,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import type { SprintData } from "@/types/sprint"

interface DashboardOverviewProps {
  sprints: SprintData[]
  onSelectSprint: (id: number) => void
}

export function DashboardOverview({ sprints, onSelectSprint }: DashboardOverviewProps) {
  // Calculate total points across all sprints
  const totalStartingPoints = sprints.reduce((sum, sprint) => sum + sprint.startPoint, 0)
  const totalCompletedPoints = sprints.reduce((sum, sprint) => sum + sprint.totalBurn, 0)
  const totalAddedPoints = sprints.reduce((sum, sprint) => sum + sprint.totalAdded, 0)

  // Calculate average velocity (completed points per sprint)
  const averageVelocity = sprints.length > 0 ? Math.round(totalCompletedPoints / sprints.length) : 0

  // Prepare data for the velocity chart
  const velocityData = sprints.map((sprint) => ({
    sprint: `Sprint ${sprint.sprintNumber}`,
    completed: sprint.totalBurn,
    added: sprint.totalAdded,
    remaining: sprint.dailyRemaining.friday,
    id: sprint.id,
  }))

  // Prepare data for the burndown trend chart
  const burndownTrendData = sprints.map((sprint) => {
    const efficiency = sprint.startPoint > 0 ? Math.round((sprint.totalBurn / sprint.startPoint) * 100) : 0
    return {
      sprint: `Sprint ${sprint.sprintNumber}`,
      efficiency: efficiency,
      startPoint: sprint.startPoint,
      id: sprint.id,
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Completed Points</CardTitle>
            <CardDescription>Across all sprints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCompletedPoints} of {totalStartingPoints} points completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Velocity</CardTitle>
            <CardDescription>Points per sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageVelocity}</div>
            <p className="text-xs text-muted-foreground mt-1">{sprints.length} sprints analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scope Changes</CardTitle>
            <CardDescription>Points added during sprints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAddedPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalStartingPoints > 0 ? Math.round((totalAddedPoints / totalStartingPoints) * 100) : 0}% of initial
              scope
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sprint Velocity</CardTitle>
            <CardDescription>Completed vs Added Points per Sprint</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                completed: {
                  label: "Completed Points",
                  color: "#22c55e", // Brighter green color
                },
                added: {
                  label: "Added Points",
                  color: "#60a5fa", // Lighter blue color
                },
                remaining: {
                  label: "Remaining Points",
                  color: "#f43f5e", // Brighter red color
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={velocityData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  onClick={(data) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      const clickedSprint = data.activePayload[0].payload
                      if (clickedSprint && clickedSprint.id) {
                        onSelectSprint(clickedSprint.id)
                      }
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-md shadow-md p-3 text-popover-foreground">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Completed: </span>
                              <span className="font-medium">{payload[0].value}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Added: </span>
                              <span className="font-medium">{payload[1].value}</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Remaining: </span>
                              <span className="font-medium">{payload[2].value}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Click to view details</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Area
                    type="natural"
                    dataKey="completed"
                    stroke="#22c55e"
                    fill="url(#completedGradient)"
                    fillOpacity={1}
                  />
                  <Bar dataKey="added" barSize={20} fill="#60a5fa" />
                  <Line
                    type="monotone"
                    dataKey="remaining"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={{ stroke: "#f43f5e", strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sprint Efficiency</CardTitle>
            <CardDescription>Percentage of planned work completed</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                efficiency: {
                  label: "Efficiency (%)",
                  color: "#fbbf24", // Brighter yellow color
                },
                startPoint: {
                  label: "Starting Points",
                  color: "#a78bfa", // Lighter purple color
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={burndownTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  onClick={(data) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      const clickedSprint = data.activePayload[0].payload
                      if (clickedSprint && clickedSprint.id) {
                        onSelectSprint(clickedSprint.id)
                      }
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sprint" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-border rounded-md shadow-md p-3 text-popover-foreground">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Efficiency: </span>
                              <span className="font-medium">{payload[0].value}%</span>
                            </p>
                            <p className="text-sm">
                              <span className="text-muted-foreground">Starting Points: </span>
                              <span className="font-medium">{payload[1].value}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Click to view details</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    yAxisId="left"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={{ stroke: "#fbbf24", strokeWidth: 2, r: 4 }}
                  />
                  <Bar dataKey="startPoint" yAxisId="right" barSize={20} fill="#a78bfa" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

