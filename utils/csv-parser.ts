import type { SprintData } from "@/types/sprint"

export async function fetchAndParseCSV(url: string): Promise<SprintData[]> {
  try {
    const response = await fetch(url)
    const csvText = await response.text()

    // Parse CSV
    const rows = csvText.split("\n")
    const headers = rows[0].split(",")

    const data: SprintData[] = rows
      .slice(1)
      .filter((row) => row.trim())
      .map((row, index) => {
        const values = row.split(",")

        // Extract values from CSV
        const sprintNumber = Number.parseInt(values[0]) || 0
        const startDate = values[1] || ""
        const endDate = values[2] || ""
        const startPoint = Number.parseInt(values[3]) || 0

        // Parse daily completed points
        const dailyCompleted = {
          monday: Number.parseInt(values[4]) || 0,
          tuesday: Number.parseInt(values[5]) || 0,
          wednesday: Number.parseInt(values[6]) || 0,
          thursday: Number.parseInt(values[7]) || 0,
          friday: Number.parseInt(values[8]) || 0,
        }

        // Parse daily added points
        const dailyAdded = {
          monday: Number.parseInt(values[9]) || 0,
          tuesday: Number.parseInt(values[10]) || 0,
          wednesday: Number.parseInt(values[11]) || 0,
          thursday: Number.parseInt(values[12]) || 0,
          friday: Number.parseInt(values[13]) || 0,
        }

        // Parse total burn and added
        const totalBurn = Number.parseInt(values[14]) || 0
        const totalAdded = Number.parseInt(values[15]) || 0

        // Handle notes (may contain commas)
        let notes = ""
        if (values.length > 16) {
          // If the notes field contains commas, it might be split across multiple array elements
          notes = values.slice(16).join(",")
          // Remove any surrounding quotes
          notes = notes.replace(/^"|"$/g, "")
        }

        // Calculate remaining points
        const dailyRemaining = {
          monday: startPoint + dailyAdded.monday - dailyCompleted.monday,
          tuesday:
            startPoint + dailyAdded.monday + dailyAdded.tuesday - (dailyCompleted.monday + dailyCompleted.tuesday),
          wednesday:
            startPoint +
            dailyAdded.monday +
            dailyAdded.tuesday +
            dailyAdded.wednesday -
            (dailyCompleted.monday + dailyCompleted.tuesday + dailyCompleted.wednesday),
          thursday:
            startPoint +
            dailyAdded.monday +
            dailyAdded.tuesday +
            dailyAdded.wednesday +
            dailyAdded.thursday -
            (dailyCompleted.monday + dailyCompleted.tuesday + dailyCompleted.wednesday + dailyCompleted.thursday),
          friday: startPoint + totalAdded - totalBurn,
        }

        return {
          id: Date.now() + index, // Generate a unique ID
          sprintNumber,
          startDate,
          endDate,
          startPoint,
          dailyCompleted,
          dailyAdded,
          dailyRemaining,
          totalBurn,
          totalAdded,
          notes,
        } as SprintData
      })

    return data
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    return []
  }
}

