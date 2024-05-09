import { createKeysPieChart } from './keysPieChart.js'
import { createTop30BarChart } from './top30tracks.js'
import {createModesPieChart} from './modesPieChart.js'
import {createRadarChart} from './radarChart.js'
import { createTreemap } from './treemap.js'
import { createBubbleChart } from './bubbleChart.js'
import { createParallelCoordinatesPlot } from './pcp.js'
import { drawPercentage } from './percentage.js'
import { globalState } from "./globalState.js";

function renderPlots() {
    createTop30BarChart()
    createModesPieChart()
    createRadarChart()
    createTreemap()
    createBubbleChart()
    createParallelCoordinatesPlot('playlist')
    drawPercentage()
}


function updatePlots(columnName, filters) {
    console.log("PASSED:", filters, columnName)
}


globalState.subscribe(updatePlots);
renderPlots()

// export const TEST = {"hello": 12} 
