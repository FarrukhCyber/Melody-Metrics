import { createKeysPieChart } from './keysPieChart.js'
import { createTop30BarChart } from './top30tracks.js'
import {createModesPieChart} from './modesPieChart.js'
import {createRadarChart} from './radarChart.js'
import { createTreemap } from './treemap.js'
import { createBubbleChart } from './bubbleChart.js'
import { createParallelCoordinatesPlot } from './pcp.js'
import { drawPercentage } from './percentage.js'
import { globalState } from "./globalState.js";


let platform = 'playlist'

function renderPlots() {
    createTop30BarChart()
    createModesPieChart()
    createRadarChart()
    createTreemap()
    createBubbleChart()
    createParallelCoordinatesPlot(NaN, NaN, platform )
    drawPercentage()
}


function updatePlots(columnName, filters, wasReset) {
    console.log("INSIDE UPDATE PLOT")
    console.log("PASSED:", filters, columnName)

    // for reset
    if (wasReset) {
        console.log("inside reset check")
        renderPlots()
    }
    else {

        // For interactivity with barplot
        createModesPieChart(columnName, filters)
        createTreemap(columnName, filters)
        createBubbleChart(columnName, filters)
        createParallelCoordinatesPlot(columnName, filters, platform)
        createRadarChart(columnName, filters)
    }


}


globalState.subscribe(updatePlots);
renderPlots()

// export const TEST = {"hello": 12} 
