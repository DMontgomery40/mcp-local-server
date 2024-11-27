import { BirdDetection } from './types';

export function generateDailyActivityChart(detections: BirdDetection[]) {
  // Group detections by hour
  const hourlyData = Array(24).fill(0);
  detections.forEach(detection => {
    const hour = new Date(detection.timestamp).getHours();
    hourlyData[hour]++;
  });

  // Generate SVG chart
  const width = 800;
  const height = 400;
  const padding = 50;
  const barWidth = (width - 2 * padding) / 24;

  const maxCount = Math.max(...hourlyData);
  const yScale = (height - 2 * padding) / maxCount;

  let paths = [];
  hourlyData.forEach((count, hour) => {
    const x = padding + hour * barWidth;
    const barHeight = count * yScale;
    const y = height - padding - barHeight;
    
    paths.push(`<rect 
      x="${x}" 
      y="${y}" 
      width="${barWidth - 2}" 
      height="${barHeight}" 
      fill="steelblue" 
      opacity="0.8"
    />`);
  });

  // Add axes and labels
  const xAxis = `<g transform="translate(0,${height - padding})">
    <line x1="${padding}" y1="0" x2="${width - padding}" y2="0" stroke="black" />
    ${Array.from({length: 24}, (_, i) => 
      `<text x="${padding + i * barWidth + barWidth/2}" y="20" 
       text-anchor="middle">${i}:00</text>`
    ).join('')}
  </g>`;

  const yAxis = `<g transform="translate(${padding},0)">
    <line x1="0" y1="${padding}" x2="0" y2="${height - padding}" stroke="black" />
    ${Array.from({length: 5}, (_, i) => {
      const val = Math.round(maxCount * (4-i) / 4);
      return `<text x="-10" y="${padding + i * (height - 2*padding)/4}" 
              text-anchor="end" alignment-baseline="middle">${val}</text>`;
    }).join('')}
  </g>`;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    ${paths.join('\n')}
    ${xAxis}
    ${yAxis}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16">
      Daily Bird Activity
    </text>
  </svg>`;
}

export function generateSpeciesDistributionChart(detections: BirdDetection[]) {
  const speciesCount = new Map<string, number>();
  detections.forEach(detection => {
    speciesCount.set(detection.species, 
      (speciesCount.get(detection.species) || 0) + 1);
  });

  // Sort and take top 10 species
  const topSpecies = [...speciesCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const width = 800;
  const height = 400;
  const padding = 100;
  const barHeight = (height - 2 * padding) / topSpecies.length;

  const maxCount = Math.max(...topSpecies.map(([_, count]) => count));
  const xScale = (width - 2 * padding) / maxCount;

  let paths = [];
  topSpecies.forEach(([species, count], index) => {
    const y = padding + index * barHeight;
    const barWidth = count * xScale;
    
    paths.push(`<rect 
      x="${padding}" 
      y="${y}" 
      width="${barWidth}" 
      height="${barHeight - 2}" 
      fill="steelblue" 
      opacity="0.8"
    />`);
    
    paths.push(`<text 
      x="${padding - 5}" 
      y="${y + barHeight/2}" 
      text-anchor="end" 
      alignment-baseline="middle"
      font-size="12"
    >${species}</text>`);
    
    paths.push(`<text 
      x="${padding + barWidth + 5}" 
      y="${y + barHeight/2}" 
      alignment-baseline="middle"
      font-size="12"
    >${count}</text>`);
  });

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    ${paths.join('\n')}
    <text x="${width/2}" y="30" text-anchor="middle" font-size="16">
      Species Distribution
    </text>
  </svg>`;
}