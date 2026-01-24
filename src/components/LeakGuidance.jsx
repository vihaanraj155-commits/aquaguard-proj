/**
 * LeakGuidance Component
 * Provides simple, non-technical guidance when a persistent leak is detected
 * Focuses on behavior change and awareness, not technical repair instructions
 */
export default function LeakGuidance({ leakDetected, durationMinutes }) {
  // Only show guidance if leak is detected and has persisted for meaningful duration
  if (!leakDetected || durationMinutes < 30) {
    return null;
  }

  return (
    <div className="bg-yellow-50 rounded-lg shadow-md p-6 border-2 border-yellow-300">
      <h3 className="text-xl font-bold text-yellow-800 mb-4">
        Possible Persistent Leak Detected
      </h3>
      
      <p className="text-sm text-yellow-700 mb-4">
        If this leak continues, it can waste significant water and money. Here's what you can do:
      </p>

      <div className="space-y-3">
        {/* Step 1 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 font-semibold text-sm">
            1
          </div>
          <div>
            <p className="font-semibold text-yellow-800">Check the faucet</p>
            <p className="text-sm text-yellow-700">
              Make sure handles are fully closed. Look for visible dripping.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 font-semibold text-sm">
            2
          </div>
          <div>
            <p className="font-semibold text-yellow-800">Check nearby fixtures</p>
            <p className="text-sm text-yellow-700">
              Listen for running toilets. Check under-sink connections.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 font-semibold text-sm">
            3
          </div>
          <div>
            <p className="font-semibold text-yellow-800">Recheck after a short wait</p>
            <p className="text-sm text-yellow-700">
              Turn the faucet fully off, then on. Monitor again after 10 minutes.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-800 font-semibold text-sm">
            4
          </div>
          <div>
            <p className="font-semibold text-yellow-800">If the leak continues</p>
            <p className="text-sm text-yellow-700">
              Contact building maintenance or a licensed plumber. Use the estimated yearly cost as justification.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex items-start gap-3 mt-4 pt-3 border-t border-yellow-300">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-yellow-800">Why fixing it matters</p>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Saves water and protects our environment</li>
              <li>• Saves money on your water bill</li>
              <li>• Prevents long-term damage to your home</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
