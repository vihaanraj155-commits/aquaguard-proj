import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

/**
 * UsageChart Component
 * Displays a timeline of water flow over time
 * Highlights leak periods in red
 */
export default function UsageChart({ data, leakPeriods }) {
  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-2 border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Water Flow Timeline</h3>
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              label={{ value: 'Flow Rate (L/min)', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              formatter={(value) => [`${value.toFixed(2)} L/min`, 'Flow Rate']}
              labelFormatter={(label) => `Time: ${formatTime(label)}`}
            />
            <Line
              type="monotone"
              dataKey="flow_rate_lpm"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Flow Rate"
            />
            {/* Highlight leak periods */}
            {leakPeriods.map((period, idx) => (
              <ReferenceArea
                key={idx}
                x1={period.start}
                x2={period.end}
                stroke="red"
                strokeOpacity={0.2}
                fill="red"
                fillOpacity={0.1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-600">Normal Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span className="text-gray-600">Leak Period</span>
        </div>
      </div>
    </div>
  );
}
