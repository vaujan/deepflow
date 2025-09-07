"use client";

import React from "react";

/**
 * Chart Customization Tutorial
 * 
 * This file demonstrates how to customize your existing charts step by step.
 * Each example builds upon the previous one to show different customization options.
 */

// Step 1: Basic customization of your existing TagFocusChart
export const Step1_BasicCustomization = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 1: Basic Customization</h3>
      <div className="bg-base-200 p-4 rounded-lg">
        <pre className="text-sm">
{`// In your tag-focus-chart.tsx, you can customize:

// 1. Colors - Change the slicePalette array
const slicePalette = [
  radixColorScales.blue.blue9,      // Instead of blue.blue9
  radixColorScales.purple.purple9,  // Add purple
  radixColorScales.pink.pink9,      // Add pink
  // ... more colors
];

// 2. Donut size - Modify innerRadius and outerRadius
<Pie
  innerRadius={40}    // Smaller hole = thicker ring
  outerRadius={120}   // Larger outer = bigger chart
  // ... other props
/>

// 3. Spacing - Adjust paddingAngle
<Pie
  paddingAngle={5}    // More space between slices
  // ... other props
/>`}
        </pre>
      </div>
    </div>
  );
};

// Step 2: Advanced styling
export const Step2_AdvancedStyling = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 2: Advanced Styling</h3>
      <div className="bg-base-200 p-4 rounded-lg">
        <pre className="text-sm">
{`// Add custom labels, tooltips, and effects

// 1. Custom labels
label={({ name, percentage }) => (
  <text
    x={0} y={0}
    textAnchor="middle"
    dominantBaseline="central"
    className="fill-base-content text-xs font-medium"
  >
    {name} {percentage}%
  </text>
)}

// 2. Custom tooltip
<Tooltip
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-base-200 p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{data.tag}</p>
          <p className="text-sm">
            {data.totalMinutes} min ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  }}
/>

// 3. Add stroke to slices
<Cell
  key={index}
  fill={slicePalette[index]}
  stroke={radixColorScales.slate.slate12}
  strokeWidth={2}
/>`}
        </pre>
      </div>
    </div>
  );
};

// Step 3: Responsive design
export const Step3_ResponsiveDesign = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 3: Responsive Design</h3>
      <div className="bg-base-200 p-4 rounded-lg">
        <pre className="text-sm">
{`// Make your chart responsive to screen size

const [chartSize, setChartSize] = useState({ width: 400, height: 300 });

useEffect(() => {
  const updateSize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setChartSize({ width: 300, height: 250 });
    } else if (width < 1024) {
      setChartSize({ width: 400, height: 300 });
    } else {
      setChartSize({ width: 500, height: 350 });
    }
  };
  
  window.addEventListener('resize', updateSize);
  updateSize(); // Initial call
  
  return () => window.removeEventListener('resize', updateSize);
}, []);

// Use in your chart
<ResponsiveContainer width="100%" height={chartSize.height}>
  <PieChart>
    {/* Your chart content */}
  </PieChart>
</ResponsiveContainer>`}
        </pre>
      </div>
    </div>
  );
};

// Step 4: Animation and interactions
export const Step4_AnimationAndInteractions = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 4: Animation and Interactions</h3>
      <div className="bg-base-200 p-4 rounded-lg">
        <pre className="text-sm">
{`// Add smooth animations and hover effects

// 1. Animation settings
<Pie
  animationDuration={1000}        // Slower animation
  animationEasing="ease-in-out"   // Smooth easing
  isAnimationActive={true}        // Enable animation
/>

// 2. Hover effects
<Cell
  key={index}
  fill={slicePalette[index]}
  onMouseEnter={(data, index, event) => {
    // Add hover effect
    event.target.style.filter = 'brightness(1.1)';
  }}
  onMouseLeave={(data, index, event) => {
    // Remove hover effect
    event.target.style.filter = 'brightness(1)';
  }}
/>

// 3. Click interactions
<Pie
  onClick={(data, index, event) => {
    console.log('Clicked slice:', data);
    // Handle click - maybe navigate or show details
  }}
/>`}
        </pre>
      </div>
    </div>
  );
};

// Step 5: Data formatting and calculations
export const Step5_DataFormatting = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 5: Data Formatting and Calculations</h3>
      <div className="bg-base-200 p-4 rounded-lg">
        <pre className="text-sm">
{
`// Format your data for better display

const data = useMemo(() => {
  const range = getDateRangeSessions(mockSessions, period);
  const tags = computeTagFocus(range).slice(0, maxTags);
  const total = tags.reduce((acc, t) => acc + t.totalMinutes, 0) || 1;
  
  return tags.map((t) => ({
    ...t,
    // Format percentage
    percentage: parseFloat(((t.totalMinutes / total) * 100).toFixed(1)),
    
    // Format time display
    timeDisplay: formatTime(t.totalMinutes),
    
    // Add color based on performance
    performance: t.avgQuality > 7 ? 'high' : t.avgQuality > 5 ? 'medium' : 'low',
    
    // Add trend data
    trend: calculateTrend(t),
  }));
}, [period, maxTags]);

// Helper function to format time
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? \`${'${'}hours}h ${'${'}mins}m\` : \`${'${'}mins}m\`;
};`}
        </pre>
      </div>
    </div>
  );
};

// Complete example showing all customizations
export const CompleteExample = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Complete Customization Example</h3>
      <div className="bg-base-200 p-4 rounded-lg">
        <pre className="text-sm overflow-x-auto">
{
`// Here's how to apply all customizations to your existing chart:

"use client";
import React, { useMemo, useState, useEffect } from "react";
// ... other imports

const CustomizedTagFocusChart = ({ className = "", period = "30d", maxTags = 7 }) => {
  const [chartSize, setChartSize] = useState({ height: 300 });
  
  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      setChartSize({ 
        height: window.innerWidth < 768 ? 250 : 300 
      });
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Enhanced data processing
  const data = useMemo(() => {
    const range = getDateRangeSessions(mockSessions, period);
    const tags = computeTagFocus(range).slice(0, maxTags);
    const total = tags.reduce((acc, t) => acc + t.totalMinutes, 0) || 1;
    
    return tags.map((t) => ({
      ...t,
      percentage: parseFloat(((t.totalMinutes / total) * 100).toFixed(1)),
      timeDisplay: formatTime(t.totalMinutes),
    }));
  }, [period, maxTags]);

  // Enhanced color palette
  const slicePalette = [
    radixColorScales.blue.blue9,
    radixColorScales.purple.purple9,
    radixColorScales.pink.pink9,
    radixColorScales.cyan.cyan9,
    radixColorScales.green.green9,
  ];

  return (
    <div className={`card bg-base-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Focus by Tag</h3>
        <span className="text-xs text-base-content/60">
          Top {Math.min(maxTags, data.length)}
        </span>
      </div>
      
      <div className="w-full" style={{ height: chartSize.height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalMinutes"
              nameKey="tag"
              innerRadius={50}
              outerRadius={100}
              paddingAngle={3}
              cornerRadius={6}
              animationDuration={800}
              animationEasing="ease-in-out"
              label={({ name, percentage }) => 
                percentage > 5 ? `${name} ${percentage}%` : ''
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`slice-${entry.tag}-${index}`}
                  fill={slicePalette[index % slicePalette.length]}
                  stroke={radixColorScales.slate.slate12}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-base-200 p-3 rounded-lg shadow-lg border">
                      <p className="font-semibold">{data.tag}</p>
                      <p className="text-sm">
                        {data.timeDisplay} ({data.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                color: radixColorScales.slate.slate12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};`}
        </pre>
      </div>
    </div>
  );
};

export default function ChartCustomizationTutorial() {
  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Chart Customization Tutorial</h2>
      <p className="text-base-content/80">
        Learn how to customize your charts step by step. Each example builds upon the previous one.
      </p>
      
      <Step1_BasicCustomization />
      <Step2_AdvancedStyling />
      <Step3_ResponsiveDesign />
      <Step4_AnimationAndInteractions />
      <Step5_DataFormatting />
      <CompleteExample />
    </div>
  );
}
