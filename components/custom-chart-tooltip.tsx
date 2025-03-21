import { Card, CardContent } from "@/components/ui/card"

interface CustomChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

export function CustomChartTooltip({ active, payload, label }: CustomChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  // Find the data points we need
  const remaining = payload.find((p) => p.dataKey === "remaining")?.value || 0
  const added = payload.find((p) => p.dataKey === "added")?.value || 0

  // Calculate completed points based on the day
  // For this we need to know what day we're looking at and the starting point
  let completed = 0
  const startPoint = payload.find((p) => p.dataKey === "startPoint")?.value || 0

  if (label !== "Start") {
    completed = startPoint + added - remaining
  }

  return (
    <Card className="border shadow-md">
      <CardContent className="p-3">
        <div className="text-sm font-medium mb-1">{label}</div>
        <div className="space-y-1 text-sm">
          <div className="grid grid-cols-2 gap-x-4">
            <span className="text-muted-foreground">Remaining:</span>
            <span className="font-medium text-right">{remaining}</span>
          </div>
          {label !== "Start" && (
            <>
              <div className="grid grid-cols-2 gap-x-4">
                <span className="text-muted-foreground">Completed:</span>
                <span className="font-medium text-right">{completed}</span>
              </div>
              {added > 0 && (
                <div className="grid grid-cols-2 gap-x-4">
                  <span className="text-muted-foreground">Added:</span>
                  <span className="font-medium text-right">{added}</span>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

