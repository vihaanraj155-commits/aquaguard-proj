/**
 * DashboardStats Component
 * Displays current flow rate, water usage, and cost estimates
 */
export default function DashboardStats({ flowRate, waterWasted, gallonsWasted, costSoFar, yearlyCost }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

      {/* Water Wasted */}
      <div className="bg-purple-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
        <p className="text-sm text-gray-600 mb-2">Water Wasted</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-purple-600">
            {waterWasted.toFixed(1)}
          </span>
          <span className="text-lg text-gray-500">liters</span>
        </div>
        {gallonsWasted > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            ≈ {gallonsWasted.toFixed(1)} gallons
          </p>
        )}
      </div>

      {/* Cost Estimate */}
      {costSoFar > 0 && (
        <div className="bg-red-50 rounded-lg shadow-md p-6 border-2 border-red-200">
          <p className="text-sm text-gray-600 mb-2">Estimated Cost</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold text-red-600">
              ${costSoFar.toFixed(2)}
            </span>
          </div>
          {yearlyCost > 0 && (
            <p className="text-xs text-gray-600 mt-2">
              ≈ ${yearlyCost.toFixed(0)}/year if leak continues
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            (NJ water rates estimate)
          </p>
        </div>
      )}
    </div>
  );
}
