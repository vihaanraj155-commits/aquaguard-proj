/**
 * DashboardStats Component
 * Displays current flow rate and estimated water usage
 */
export default function DashboardStats({ flowRate, waterWasted }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Current Flow Rate */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
        <p className="text-sm text-gray-600 mb-2">Current Flow Rate</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-blue-600">
            {flowRate.toFixed(2)}
          </span>
          <span className="text-lg text-gray-500">L/min</span>
        </div>
      </div>

      {/* Water Wasted/Saved */}
      <div className="bg-purple-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
        <p className="text-sm text-gray-600 mb-2">Water Wasted</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-purple-600">
            {waterWasted.toFixed(1)}
          </span>
          <span className="text-lg text-gray-500">liters</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          (from current leak period)
        </p>
      </div>
    </div>
  );
}
