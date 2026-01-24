/**
 * DemoControls Component
 * Provides buttons to manually simulate leaks for demonstration purposes
 */
export default function DemoControls({ onSimulateLeak, onReturnToNormal }) {
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Demo Controls</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSimulateLeak}
          className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Simulate Leak
        </button>
        <button
          onClick={onReturnToNormal}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          Return to Normal
        </button>
      </div>
    </div>
  );
}
