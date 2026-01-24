/**
 * StatusCard Component
 * Displays the current leak status with color-coded indicator
 */
export default function StatusCard({ leakDetected }) {
  return (
    <div className={`rounded-lg shadow-md p-6 ${
      leakDetected ? 'bg-red-50 border-2 border-red-300' : 'bg-green-50 border-2 border-green-300'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Leak Status</p>
          <h2 className={`text-2xl md:text-3xl font-bold ${
            leakDetected ? 'text-red-600' : 'text-green-600'
          }`}>
            {leakDetected ? 'Possible Leak' : 'Normal'}
          </h2>
        </div>
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
          leakDetected ? 'bg-red-200' : 'bg-green-200'
        }`}>
          {leakDetected ? (
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
