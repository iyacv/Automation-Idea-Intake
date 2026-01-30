import { ReactNode } from 'react';

// ChartCard  
interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Bar Chart  
interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: ChartData[];
}

export function BarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-24 truncate" title={item.label}>
            {item.label}
          </span>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 w-8 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// Donut Chart 
interface DonutChartProps {
  data: ChartData[];
  centerLabel?: string;
  centerValue?: number;
}

export function DonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const size = 120;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {/* Data segments */}
          {data.map((item, index) => {
            const segmentLength = total > 0 ? (item.value / total) * circumference : 0;
            const offset = currentOffset;
            currentOffset += segmentLength;

            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
          })}
        </svg>
        {/* Center text */}
        {centerLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-800">{centerValue}</span>
            <span className="text-xs text-gray-500">{centerLabel}</span>
          </div>
        )}
      </div>
      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600">{item.label}</span>
            <span className="text-xs font-medium text-gray-800">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Circle 
interface ProgressCircleProps {
  value: number;
  label: string;
  color?: string;
}

export function ProgressCircle({ value, label, color = '#3b82f6' }: ProgressCircleProps) {
  const size = 64;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-800">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 mt-2">{label}</span>
    </div>
  );
}
