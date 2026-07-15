import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from './index';
import { useTheme } from '../../hooks';

interface ChartProps {
  data: any[];
  title?: string;
  height?: number;
  className?: string;
}

const chartColors = {
  primary: '#0EA5E9',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
};

const useChartTheme = () => {
  const { isDarkMode } = useTheme();
  // Ensure print mode gets dark-on-light theme
  const isDark = isDarkMode; 
  
  return {
    gridStroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)",
    axisStroke: isDark ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.4)",
    tooltipContentStyle: {
      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(15, 23, 42, 0.1)',
      borderRadius: '8px',
      padding: '12px',
      color: isDark ? '#fff' : '#0f172a',
    },
    tooltipLabelStyle: { color: isDark ? '#fff' : '#0f172a' },
  };
};

// ==================== LINE CHART ====================
interface LineChartProps extends ChartProps {
  dataKey: string;
  name?: string;
  color?: string;
  multiLine?: Array<{ key: string; name: string; color?: string }>;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  dataKey,
  name,
  color = chartColors.primary,
  multiLine,
  title,
  height = 300,
  className = '',
}) => {
  const theme = useChartTheme();
  return (
    <Card className={className}>
      {title && <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</h3>}
      <div className="print:break-inside-avoid">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
            <XAxis stroke={theme.axisStroke} style={{ fontSize: '12px' }} />
            <YAxis stroke={theme.axisStroke} style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={theme.tooltipContentStyle}
              labelStyle={theme.tooltipLabelStyle}
            />
            {multiLine ? (
              <>
                <Legend />
                {multiLine.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.name}
                    stroke={line.color || chartColors.primary}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false} /* Disabled for stable print rendering */
                  />
                ))}
              </>
            ) : (
              <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// ==================== BAR CHART ====================
interface BarChartProps extends ChartProps {
  dataKey: string;
  name?: string;
  color?: string;
  multiBar?: Array<{ key: string; name: string; color?: string }>;
}

export const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  dataKey,
  name,
  color = chartColors.primary,
  multiBar,
  title,
  height = 300,
  className = '',
}) => {
  const theme = useChartTheme();
  return (
    <Card className={className}>
      {title && <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</h3>}
      <div className="print:break-inside-avoid">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
            <XAxis stroke={theme.axisStroke} style={{ fontSize: '12px' }} />
            <YAxis stroke={theme.axisStroke} style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={theme.tooltipContentStyle}
              labelStyle={theme.tooltipLabelStyle}
            />
            {multiBar ? (
              <>
                <Legend />
                {multiBar.map((bar) => (
                  <Bar key={bar.key} dataKey={bar.key} name={bar.name} fill={bar.color || chartColors.primary} isAnimationActive={false} />
                ))}
              </>
            ) : (
              <Bar dataKey={dataKey} name={name} fill={color} isAnimationActive={false} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// ==================== PIE CHART ====================
interface PieChartProps extends ChartProps {
  dataKey: string;
  nameKey?: string;
}

export const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  dataKey,
  nameKey = 'name',
  title,
  height = 300,
  className = '',
}) => {
  const theme = useChartTheme();
  const colors = [
    chartColors.primary,
    chartColors.secondary,
    chartColors.success,
    chartColors.warning,
    chartColors.danger,
    chartColors.info,
  ];

  return (
    <Card className={className}>
      {title && <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</h3>}
      <div className="print:break-inside-avoid">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={theme.tooltipContentStyle}
              labelStyle={theme.tooltipLabelStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

// ==================== AREA CHART ====================
interface AreaChartProps extends ChartProps {
  dataKey: string;
  name?: string;
  color?: string;
  multiArea?: Array<{ key: string; name: string; color?: string }>;
}

export const AreaChartComponent: React.FC<AreaChartProps> = ({
  data,
  dataKey,
  name,
  color = chartColors.primary,
  multiArea,
  title,
  height = 300,
  className = '',
}) => {
  const theme = useChartTheme();
  return (
    <Card className={className}>
      {title && <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white print:text-black">{title}</h3>}
      <div className="print:break-inside-avoid">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.gridStroke} />
            <XAxis stroke={theme.axisStroke} style={{ fontSize: '12px' }} />
            <YAxis stroke={theme.axisStroke} style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={theme.tooltipContentStyle}
              labelStyle={theme.tooltipLabelStyle}
            />
            {multiArea ? (
              <>
                <Legend />
                {multiArea.map((area) => (
                  <Area
                    key={area.key}
                    type="monotone"
                    dataKey={area.key}
                    name={area.name}
                    stroke={area.color || chartColors.primary}
                    fill={area.color || chartColors.primary}
                    fillOpacity={0.3}
                    isAnimationActive={false}
                  />
                ))}
              </>
            ) : (
              <Area type="monotone" dataKey={dataKey} name={name} stroke={color} fill={color} fillOpacity={0.3} isAnimationActive={false} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
