import { createKeysPieChart } from './keysPieChart.js'
import { createTop30BarChart } from './top30tracks.js'
import { createTreemap } from './treemap.js'
import { createBubbleChart } from './bubbleChart.js'
import { createParallelCoordinatesPlot } from './pcp.js'
import { drawTimeSeries } from './timeSeries.js'

createKeysPieChart()
createTop30BarChart()
createTreemap()
createBubbleChart()
// getData('playlists')
createParallelCoordinatesPlot('playlist')
drawTimeSeries()