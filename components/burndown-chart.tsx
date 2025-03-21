'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import {
  Line,
  Bar,
  Area,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import SprintDataTable from './sprint-data-table';
import { DashboardOverview } from './dashboard-overview';
import { AppHeader } from './app-header';
import type { SprintData } from '@/types/sprint';

export default function BurndownChart() {
  const [sprints, setSprints] = useState<SprintData[]>([
    {
      id: 1,
      sprintNumber: 5,
      startDate: '2025-03-03',
      endDate: '2025-03-07',
      startPoint: 68,
      dailyCompleted: {
        monday: 0,
        tuesday: 10,
        wednesday: 22,
        thursday: 23,
        friday: 2,
      },
      dailyAdded: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
      },
      dailyRemaining: {
        monday: 68,
        tuesday: 58,
        wednesday: 36,
        thursday: 13,
        friday: 11,
      },
      totalBurn: 57,
      totalAdded: 0,
      notes: '',
    },
    {
      id: 2,
      sprintNumber: 6,
      startDate: '2025-03-10',
      endDate: '2025-03-14',
      startPoint: 72,
      dailyCompleted: {
        monday: 0,
        tuesday: 7,
        wednesday: 3,
        thursday: 36,
        friday: 10,
      },
      dailyAdded: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
      },
      dailyRemaining: {
        monday: 72,
        tuesday: 65,
        wednesday: 62,
        thursday: 26,
        friday: 16,
      },
      totalBurn: 56,
      totalAdded: 0,
      notes: '',
    },
    {
      id: 3,
      sprintNumber: 7,
      startDate: '2025-03-17',
      endDate: '2025-03-21',
      startPoint: 71,
      dailyCompleted: {
        monday: 0,
        tuesday: 12,
        wednesday: 12,
        thursday: 0,
        friday: 0,
      },
      dailyAdded: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
      },
      dailyRemaining: {
        monday: 71,
        tuesday: 59,
        wednesday: 47,
        thursday: 47,
        friday: 47,
      },
      totalBurn: 24,
      totalAdded: 0,
      notes: '',
    },
  ]);

  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<number | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);

  // Add this useEffect to load data from localStorage after component mounts
  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const savedSprints = localStorage.getItem('sprintData');
      if (savedSprints) {
        try {
          const parsedSprints = JSON.parse(savedSprints);
          setSprints(parsedSprints);
        } catch (e) {
          console.error('Failed to parse saved sprints', e);
        }
      }
    }
  }, []);

  // Calculate chart data whenever sprints change
  useEffect(() => {
    if (selectedSprint === null && sprints.length > 0) {
      setSelectedSprint(sprints[0].id);
    }

    updateChartData();
  }, [sprints, selectedSprint]);

  // Update the updateChartData function to include startPoint for tooltip calculations
  // and ensure ideal line values are integers
  const updateChartData = () => {
    if (selectedSprint === null) return;

    const sprint = sprints.find((s) => s.id === selectedSprint);
    if (!sprint) return;

    // Calculate cumulative added points for each day
    const cumulativeAdded = {
      monday: sprint.dailyAdded.monday,
      tuesday: sprint.dailyAdded.monday + sprint.dailyAdded.tuesday,
      wednesday:
        sprint.dailyAdded.monday +
        sprint.dailyAdded.tuesday +
        sprint.dailyAdded.wednesday,
      thursday:
        sprint.dailyAdded.monday +
        sprint.dailyAdded.tuesday +
        sprint.dailyAdded.wednesday +
        sprint.dailyAdded.thursday,
      friday:
        sprint.dailyAdded.monday +
        sprint.dailyAdded.tuesday +
        sprint.dailyAdded.wednesday +
        sprint.dailyAdded.thursday +
        sprint.dailyAdded.friday,
    };

    // Calculate cumulative completed points for each day
    const cumulativeCompleted = {
      monday: sprint.dailyCompleted.monday,
      tuesday: sprint.dailyCompleted.monday + sprint.dailyCompleted.tuesday,
      wednesday:
        sprint.dailyCompleted.monday +
        sprint.dailyCompleted.tuesday +
        sprint.dailyCompleted.wednesday,
      thursday:
        sprint.dailyCompleted.monday +
        sprint.dailyCompleted.tuesday +
        sprint.dailyCompleted.wednesday +
        sprint.dailyCompleted.thursday,
      friday:
        sprint.dailyCompleted.monday +
        sprint.dailyCompleted.tuesday +
        sprint.dailyCompleted.wednesday +
        sprint.dailyCompleted.thursday +
        sprint.dailyCompleted.friday,
    };

    // Calculate ideal burndown values as integers
    const startPoint = Math.round(sprint.startPoint);
    const idealMonday = Math.round(startPoint * 0.8);
    const idealTuesday = Math.round(startPoint * 0.6);
    const idealWednesday = Math.round(startPoint * 0.4);
    const idealThursday = Math.round(startPoint * 0.2);

    const data = [
      {
        day: 'Start',
        remaining: startPoint,
        ideal: startPoint,
        added: 0,
        completed: 0,
        startPoint: startPoint,
      },
      {
        day: 'Monday',
        remaining: Math.round(sprint.dailyRemaining.monday),
        ideal: idealMonday,
        added: sprint.dailyAdded.monday,
        completed: cumulativeCompleted.monday,
        startPoint: startPoint,
      },
      {
        day: 'Tuesday',
        remaining: Math.round(sprint.dailyRemaining.tuesday),
        ideal: idealTuesday,
        added: sprint.dailyAdded.tuesday,
        completed: cumulativeCompleted.tuesday,
        startPoint: startPoint,
      },
      {
        day: 'Wednesday',
        remaining: Math.round(sprint.dailyRemaining.wednesday),
        ideal: idealWednesday,
        added: sprint.dailyAdded.wednesday,
        completed: cumulativeCompleted.wednesday,
        startPoint: startPoint,
      },
      {
        day: 'Thursday',
        remaining: Math.round(sprint.dailyRemaining.thursday),
        ideal: idealThursday,
        added: sprint.dailyAdded.thursday,
        completed: cumulativeCompleted.thursday,
        startPoint: startPoint,
      },
      {
        day: 'Friday',
        remaining: Math.round(sprint.dailyRemaining.friday),
        ideal: 0,
        added: sprint.dailyAdded.friday,
        completed: cumulativeCompleted.friday,
        startPoint: startPoint,
      },
    ];

    setChartData(data);
  };

  // Update the addNewSprint function to include notes
  const addNewSprint = () => {
    const lastSprint = sprints[sprints.length - 1];
    const newSprintNumber = lastSprint ? lastSprint.sprintNumber + 1 : 1;

    // Calculate dates for the next sprint (1 week after the last sprint)
    let startDate = new Date();
    let endDate = new Date();

    if (lastSprint) {
      startDate = new Date(lastSprint.endDate);
      startDate.setDate(startDate.getDate() + 3); // Next Monday
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 4); // Friday
    }

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const newSprint: SprintData = {
      id: Date.now(),
      sprintNumber: newSprintNumber,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      startPoint: 0,
      dailyCompleted: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
      },
      dailyAdded: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
      },
      dailyRemaining: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
      },
      totalBurn: 0,
      totalAdded: 0,
      notes: '',
    };

    setSprints([...sprints, newSprint]);
    setSelectedSprint(newSprint.id);
    setShowDashboard(false);
  };

  // Update the updateSprintData function to account for added points
  const updateSprintData = (updatedSprint: SprintData) => {
    // Calculate total added points
    const totalAdded =
      updatedSprint.dailyAdded.monday +
      updatedSprint.dailyAdded.tuesday +
      updatedSprint.dailyAdded.wednesday +
      updatedSprint.dailyAdded.thursday +
      updatedSprint.dailyAdded.friday;

    // Calculate remaining points based on completed tasks and added tasks
    const remaining = {
      monday:
        updatedSprint.startPoint +
        updatedSprint.dailyAdded.monday -
        updatedSprint.dailyCompleted.monday,
      tuesday:
        updatedSprint.startPoint +
        updatedSprint.dailyAdded.monday +
        updatedSprint.dailyAdded.tuesday -
        (updatedSprint.dailyCompleted.monday +
          updatedSprint.dailyCompleted.tuesday),
      wednesday:
        updatedSprint.startPoint +
        updatedSprint.dailyAdded.monday +
        updatedSprint.dailyAdded.tuesday +
        updatedSprint.dailyAdded.wednesday -
        (updatedSprint.dailyCompleted.monday +
          updatedSprint.dailyCompleted.tuesday +
          updatedSprint.dailyCompleted.wednesday),
      thursday:
        updatedSprint.startPoint +
        updatedSprint.dailyAdded.monday +
        updatedSprint.dailyAdded.tuesday +
        updatedSprint.dailyAdded.wednesday +
        updatedSprint.dailyAdded.thursday -
        (updatedSprint.dailyCompleted.monday +
          updatedSprint.dailyCompleted.tuesday +
          updatedSprint.dailyCompleted.wednesday +
          updatedSprint.dailyCompleted.thursday),
      friday:
        updatedSprint.startPoint +
        totalAdded -
        (updatedSprint.dailyCompleted.monday +
          updatedSprint.dailyCompleted.tuesday +
          updatedSprint.dailyCompleted.wednesday +
          updatedSprint.dailyCompleted.thursday +
          updatedSprint.dailyCompleted.friday),
    };

    const totalBurn =
      updatedSprint.dailyCompleted.monday +
      updatedSprint.dailyCompleted.tuesday +
      updatedSprint.dailyCompleted.wednesday +
      updatedSprint.dailyCompleted.thursday +
      updatedSprint.dailyCompleted.friday;

    const finalUpdatedSprint = {
      ...updatedSprint,
      dailyRemaining: remaining,
      totalBurn,
      totalAdded,
    };

    setSprints(
      sprints.map((sprint) =>
        sprint.id === finalUpdatedSprint.id ? finalUpdatedSprint : sprint
      )
    );
  };

  // Add a function to update sprint number
  const updateSprintNumber = (id: number, newNumber: number) => {
    setSprints(
      sprints.map((sprint) =>
        sprint.id === id ? { ...sprint, sprintNumber: newNumber } : sprint
      )
    );
  };

  const deleteSprint = (id: number) => {
    setSprints(sprints.filter((sprint) => sprint.id !== id));

    // After deletion, find the latest sprint (highest sprint number) and select it
    if (selectedSprint === id && sprints.length > 1) {
      const remainingSprints = sprints.filter((sprint) => sprint.id !== id);
      if (remainingSprints.length > 0) {
        // Sort by sprint number in descending order and select the first one (latest)
        const latestSprint = [...remainingSprints].sort(
          (a, b) => b.sprintNumber - a.sprintNumber
        )[0];
        setSelectedSprint(latestSprint.id);
      } else {
        setShowDashboard(true); // If no sprints left, show dashboard
      }
    }
  };

  // Update the exportToCSV function to include notes
  const exportToCSV = () => {
    // Create CSV content
    let csvContent =
      'Sprint,Start Date,End Date,Start Point,Monday Completed,Tuesday Completed,Wednesday Completed,Thursday Completed,Friday Completed,Monday Added,Tuesday Added,Wednesday Added,Thursday Added,Friday Added,Total Burn,Total Added,Notes\n';

    sprints.forEach((sprint) => {
      csvContent += `${sprint.sprintNumber},${sprint.startDate},${sprint.endDate},${sprint.startPoint},`;
      csvContent += `${sprint.dailyCompleted.monday},${sprint.dailyCompleted.tuesday},${sprint.dailyCompleted.wednesday},${sprint.dailyCompleted.thursday},${sprint.dailyCompleted.friday},`;
      csvContent += `${sprint.dailyAdded.monday},${sprint.dailyAdded.tuesday},${sprint.dailyAdded.wednesday},${sprint.dailyAdded.thursday},${sprint.dailyAdded.friday},`;
      csvContent += `${sprint.totalBurn},${sprint.totalAdded},`;
      // Escape quotes in notes and wrap in quotes
      csvContent += `"${sprint.notes.replace(/"/g, '""')}"\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sprint_burndown_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add function to handle imported data
  const handleImportData = (importedData: any[]) => {
    try {
      const newSprints = importedData.map((item, index) => {
        // Generate a unique ID for each imported sprint
        const id = Date.now() + index;

        // Parse the sprint data
        const sprintNumber = Number.parseInt(item.Sprint) || 0;
        const startPoint = Number.parseInt(item['Start Point']) || 0;

        // Parse daily completed points
        const dailyCompleted = {
          monday: Number.parseInt(item['Monday Completed']) || 0,
          tuesday: Number.parseInt(item['Tuesday Completed']) || 0,
          wednesday: Number.parseInt(item['Wednesday Completed']) || 0,
          thursday: Number.parseInt(item['Thursday Completed']) || 0,
          friday: Number.parseInt(item['Friday Completed']) || 0,
        };

        // Parse daily added points
        const dailyAdded = {
          monday: Number.parseInt(item['Monday Added']) || 0,
          tuesday: Number.parseInt(item['Tuesday Added']) || 0,
          wednesday: Number.parseInt(item['Wednesday Added']) || 0,
          thursday: Number.parseInt(item['Thursday Added']) || 0,
          friday: Number.parseInt(item['Friday Added']) || 0,
        };

        // Calculate total burn and added
        const totalBurn =
          Number.parseInt(item['Total Burn']) ||
          dailyCompleted.monday +
            dailyCompleted.tuesday +
            dailyCompleted.wednesday +
            dailyCompleted.thursday +
            dailyCompleted.friday;

        const totalAdded =
          Number.parseInt(item['Total Added']) ||
          dailyAdded.monday +
            dailyAdded.tuesday +
            dailyAdded.wednesday +
            dailyAdded.thursday +
            dailyAdded.friday;

        // Calculate remaining points
        const dailyRemaining = {
          monday: startPoint + dailyAdded.monday - dailyCompleted.monday,
          tuesday:
            startPoint +
            dailyAdded.monday +
            dailyAdded.tuesday -
            (dailyCompleted.monday + dailyCompleted.tuesday),
          wednesday:
            startPoint +
            dailyAdded.monday +
            dailyAdded.tuesday +
            dailyAdded.wednesday -
            (dailyCompleted.monday +
              dailyCompleted.tuesday +
              dailyCompleted.wednesday),
          thursday:
            startPoint +
            dailyAdded.monday +
            dailyAdded.tuesday +
            dailyAdded.wednesday +
            dailyAdded.thursday -
            (dailyCompleted.monday +
              dailyCompleted.tuesday +
              dailyCompleted.wednesday +
              dailyCompleted.thursday),
          friday: startPoint + totalAdded - totalBurn,
        };

        return {
          id,
          sprintNumber,
          startDate: item['Start Date'] || '',
          endDate: item['End Date'] || '',
          startPoint,
          dailyCompleted,
          dailyAdded,
          dailyRemaining,
          totalBurn,
          totalAdded,
          notes: item.Notes || '',
        } as SprintData;
      });

      // Merge with existing sprints or replace them
      const confirmed = window.confirm(
        'Do you want to replace existing sprints? Click Cancel to append imported sprints.'
      );
      if (confirmed) {
        setSprints(newSprints);
      } else {
        setSprints([...sprints, ...newSprints]);
      }

      // Select the first imported sprint
      if (newSprints.length > 0) {
        setSelectedSprint(newSprints[0].id);
        setShowDashboard(false);
      }

      alert(`Successfully imported ${newSprints.length} sprints.`);
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Error importing data. Please check the console for details.');
    }
  };

  const handleSelectSprint = (id: number) => {
    setSelectedSprint(id);
    setShowDashboard(false);
  };

  return (
    <div className="space-y-8">
      <AppHeader
        onExportData={exportToCSV}
        onImportData={handleImportData}
        onAddSprint={addNewSprint}
        onDashboardClick={() => setShowDashboard(true)}
        onSprintSelect={handleSelectSprint}
        sprints={sprints}
        selectedSprint={selectedSprint}
        showDashboard={showDashboard}
      />

      {showDashboard ? (
        <div className="dashboard-section">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Dashboard</CardTitle>
              <CardDescription>Overview of all sprints</CardDescription>
            </CardHeader>
            <CardContent>
              {sprints.length > 0 ? (
                <DashboardOverview
                  sprints={sprints}
                  onSelectSprint={handleSelectSprint}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No sprint data available. Add a sprint to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* On mobile, show chart first, then data */}
          <div className="lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Burndown Chart</CardTitle>
                <CardDescription>
                  Visual representation of sprint progress
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ChartContainer
                  config={{
                    remaining: {
                      label: 'Remaining Points',
                      color: '#f43f5e', // Brighter red color
                    },
                    ideal: {
                      label: 'Ideal Burndown',
                      color: '#fbbf24', // Brighter yellow color
                    },
                    added: {
                      label: 'Added Points',
                      color: '#60a5fa', // Lighter blue color
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="remainingGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#f43f5e"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f43f5e"
                            stopOpacity={0.4}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            // Find the data points we need
                            const remaining =
                              payload.find((p) => p.dataKey === 'remaining')
                                ?.value || 0;
                            const added =
                              payload.find((p) => p.dataKey === 'added')
                                ?.value || 0;
                            const completed =
                              payload.find((p) => p.dataKey === 'completed')
                                ?.value || 0;
                            const ideal =
                              payload.find((p) => p.dataKey === 'ideal')
                                ?.value || 0;

                            return (
                              <div className="bg-popover border border-border rounded-md shadow-md p-3 text-popover-foreground">
                                <p className="font-medium">{label}</p>
                                <div className="space-y-1 text-sm">
                                  <div className="grid grid-cols-2 gap-x-4">
                                    <span className="text-muted-foreground">
                                      Remaining:
                                    </span>
                                    <span className="font-medium text-right">
                                      {remaining}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4">
                                    <span className="text-muted-foreground">
                                      Ideal:
                                    </span>
                                    <span className="font-medium text-right">
                                      {ideal}
                                    </span>
                                  </div>
                                  {label !== 'Start' && (
                                    <>
                                      <div className="grid grid-cols-2 gap-x-4">
                                        <span className="text-muted-foreground">
                                          Completed:
                                        </span>
                                        <span className="font-medium text-right">
                                          {completed}
                                        </span>
                                      </div>
                                      {added > 0 && (
                                        <div className="grid grid-cols-2 gap-x-4">
                                          <span className="text-muted-foreground">
                                            Added:
                                          </span>
                                          <span className="font-medium text-right">
                                            {added}
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      {/* Use Area chart for remaining (red) with gradient */}
                      <Area
                        type="natural"
                        dataKey="remaining"
                        stroke="#f43f5e"
                        fill="url(#remainingGradient)"
                        fillOpacity={1}
                      />
                      {/* Use Line chart for ideal (yellow) */}
                      <Line
                        type="monotone"
                        dataKey="ideal"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        dot={{ stroke: '#fbbf24', strokeWidth: 2, r: 4 }}
                      />
                      {/* Use Bar chart for added points (blue) */}
                      <Bar dataKey="added" barSize={20} fill="#60a5fa" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="lg:order-1">
            <Card>
              <CardHeader>
                <CardTitle>Sprint Data</CardTitle>
                <CardDescription>Enter your sprint data below</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSprint !== null && (
                  <SprintDataTable
                    sprint={sprints.find((s) => s.id === selectedSprint)!}
                    updateSprint={updateSprintData}
                    updateSprintNumber={updateSprintNumber}
                    deleteSprint={deleteSprint}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
