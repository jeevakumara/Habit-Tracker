/**
 * Get color class based on completion percentage
 */
export function getCellColorClass(completionPercentage: number): string {
    if (completionPercentage === 0) {
        return 'grid-cell-gray';
    } else if (completionPercentage < 100) {
        return 'grid-cell-yellow';
    } else {
        return 'grid-cell-green';
    }
}

/**
 * Get background color based on completion percentage
 */
export function getCellBackgroundColor(completionPercentage: number): string {
    if (completionPercentage === 0) {
        return '#e5e7eb'; // gray
    } else if (completionPercentage < 100) {
        return '#fde047'; // yellow
    } else {
        return '#10b981'; // green
    }
}

/**
 * Get heatmap intensity color
 */
export function getHeatmapColor(intensity: number): string {
    if (intensity === 0) return '#e5e7eb';
    if (intensity < 25) return '#dcfce7';
    if (intensity < 50) return '#86efac';
    if (intensity < 75) return '#4ade80';
    if (intensity < 100) return '#22c55e';
    return '#10b981';
}
