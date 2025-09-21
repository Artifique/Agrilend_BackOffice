// Composants de graphiques pour AGRILEND
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';
import { CHART_COLORS } from '../../constants';

// Interface pour les props de base des graphiques
interface BaseChartProps {
  data: Record<string, unknown>[];
  width?: string | number;
  height?: string | number;
  className?: string;
}

// Composant de graphique en barres
interface BarChartProps extends BaseChartProps {
  dataKey: string;
  xAxisKey: string;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  dataKey,
  xAxisKey,
  color = CHART_COLORS.PRIMARY,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  width = '100%',
  height = 300,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
          {showLegend && <Legend />}
          <Bar 
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant de graphique en barres multiples
interface MultiBarChartProps extends BaseChartProps {
  bars: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  xAxisKey: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export const MultiBarChart: React.FC<MultiBarChartProps> = ({
  data,
  bars,
  xAxisKey,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  width = '100%',
  height = 300,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
          {showLegend && <Legend />}
          {bars.map((bar, index) => (
            <Bar 
              key={index}
              dataKey={bar.dataKey}
              fill={bar.color}
              name={bar.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant de graphique en ligne
interface LineChartProps extends BaseChartProps {
  lines: Array<{
    dataKey: string;
    color: string;
    name: string;
    strokeWidth?: number;
  }>;
  xAxisKey: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showDots?: boolean;
}

export const CustomLineChart: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisKey,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  showDots = true,
  width = '100%',
  height = 300,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
          {showLegend && <Legend />}
          {lines.map((line, index) => (
            <Line 
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth || 2}
              name={line.name}
              dot={showDots ? { fill: line.color, strokeWidth: 2, r: 4 } : false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant de graphique en aires
interface AreaChartProps extends BaseChartProps {
  areas: Array<{
    dataKey: string;
    color: string;
    name: string;
    fillOpacity?: number;
  }>;
  xAxisKey: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export const CustomAreaChart: React.FC<AreaChartProps> = ({
  data,
  areas,
  xAxisKey,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  width = '100%',
  height = 300,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
          {showLegend && <Legend />}
          {areas.map((area, index) => (
            <Area 
              key={index}
              type="monotone"
              dataKey={area.dataKey}
              stroke={area.color}
              fill={area.color}
              fillOpacity={area.fillOpacity || 0.6}
              name={area.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant de graphique en secteurs
interface PieChartProps extends BaseChartProps {
  dataKey: string;
  nameKey: string;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export const CustomPieChart: React.FC<PieChartProps> = ({
  data,
  dataKey,
  colors = [CHART_COLORS.PRIMARY, CHART_COLORS.SECONDARY, CHART_COLORS.SUCCESS, CHART_COLORS.WARNING, CHART_COLORS.ERROR],
  innerRadius = 60,
  outerRadius = 100,
  showTooltip = true,
  showLegend = true,
  width = '100%',
  height = 300,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={5}
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant de graphique composé (barres + lignes)
interface ComposedChartProps extends BaseChartProps {
  bars: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  lines: Array<{
    dataKey: string;
    color: string;
    name: string;
    yAxisId?: string;
  }>;
  xAxisKey: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export const CustomComposedChart: React.FC<ComposedChartProps> = ({
  data,
  bars,
  lines,
  xAxisKey,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  width = '100%',
  height = 300,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis 
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          {showTooltip && (
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}
            />
          )}
          {showLegend && <Legend />}
          {bars.map((bar, index) => (
            <Bar 
              key={index}
              yAxisId="left"
              dataKey={bar.dataKey}
              fill={bar.color}
              name={bar.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
          {lines.map((line, index) => (
            <Line 
              key={index}
              yAxisId={line.yAxisId || "right"}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              name={line.name}
              dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Composant de métrique avec graphique
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  chart?: {
    data: Record<string, unknown>[];
    dataKey: string;
    color: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  chart,
  icon,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#1E90FF] rounded-xl">
          {icon}
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <span className="mr-1">
              {change.type === 'increase' ? '↗' : '↘'}
            </span>
            {Math.abs(change.value)}%
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      
      {chart && (
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart.data}>
              <Area 
                type="monotone" 
                dataKey={chart.dataKey} 
                stroke={chart.color} 
                fill={chart.color} 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

// Composant de graphique de performance
interface PerformanceChartProps extends BaseChartProps {
  metrics: Array<{
    name: string;
    value: number;
    target?: number;
    color?: string;
  }>;
  showTarget?: boolean;
  className?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  metrics,
  showTarget = true,
  width = '100%',
  height = 200,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`} style={{ width, height }}>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{metric.name}</span>
              <span className="text-sm text-gray-600">{metric.value}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  metric.color || CHART_COLORS.PRIMARY
                }`}
                style={{ width: `${Math.min(metric.value, 100)}%` }}
              />
            </div>
            
            {showTarget && metric.target && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>Objectif: {metric.target}%</span>
                <span className={metric.value >= metric.target ? 'text-green-600' : 'text-red-600'}>
                  {metric.value >= metric.target ? '✓ Atteint' : '✗ Non atteint'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
