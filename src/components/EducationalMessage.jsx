/**
 * EducationalMessage Component
 * Displays sustainability tips and educational content
 */
const messages = [
  "A small drip can waste thousands of liters per year.",
  "Saving water also saves the energy used to treat it.",
  "Fixing leaks promptly can reduce your water bill significantly.",
  "Even a slow leak can waste over 3,000 gallons per year.",
  "Water conservation helps protect our environment and resources.",
];

export default function EducationalMessage({ leakDetected, messageIndex }) {
  const currentMessage = messages[messageIndex % messages.length];
  
  return (
    <div className={`rounded-lg shadow-md p-4 md:p-6 ${
      leakDetected 
        ? 'bg-yellow-50 border-2 border-yellow-300' 
        : 'bg-green-50 border-2 border-green-200'
    }`}>
      <div className="flex items-start gap-3">
        <svg
          className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 mt-1 ${
            leakDetected ? 'text-yellow-600' : 'text-green-600'
          }`}
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
        <div>
          <h4 className={`font-semibold text-lg mb-1 ${
            leakDetected ? 'text-yellow-800' : 'text-green-800'
          }`}>
            {leakDetected ? 'Did You Know?' : 'Water Conservation Tip'}
          </h4>
          <p className={`text-base md:text-lg ${
            leakDetected ? 'text-yellow-700' : 'text-green-700'
          }`}>
            {currentMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
