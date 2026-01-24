import { useState, useEffect } from 'react';
import AlertBanner from './components/AlertBanner';
import StatusCard from './components/StatusCard';
import DashboardStats from './components/DashboardStats';
import UsageChart from './components/UsageChart';
import EducationalMessage from './components/EducationalMessage';
import DemoControls from './components/DemoControls';
import LeakGuidance from './components/LeakGuidance';
import './App.css';

/**
 * AquaGuard - Water Leak Awareness App
 * 
 * Detects and alerts users about small, continuous water leaks
 * to increase awareness and encourage behavior change.
 */

// Leak detection thresholds
const LEAK_THRESHOLD_MIN = 0; // Flow rate must be greater than 0
const LEAK_THRESHOLD_MAX = 0.5; // Flow rate must be less than 0.5 L/min
const LEAK_DURATION_THRESHOLD = 1800; // Must persist for 30 minutes (1800 seconds)

// New Jersey residential water cost assumptions
// Estimated rate: $0.008 per gallon (approximately $8 per 1,000 gallons)
// This is an estimate for awareness purposes, not an exact bill calculation
const NJ_WATER_COST_PER_GALLON = 0.008; // $0.008 per gallon
const LITERS_PER_GALLON = 3.785; // 1 gallon ≈ 3.785 liters

// App state modes for realistic water usage simulation
const MODE_LEAK = 'leak';
const MODE_NORMAL_IDLE = 'normal_idle';
const MODE_NORMAL_BURST = 'normal_burst';

function App() {
  // State for sensor data
  const [sensorData, setSensorData] = useState([]);
  const [currentReading, setCurrentReading] = useState(null);
  const [leakDetected, setLeakDetected] = useState(false);
  const [leakStartTime, setLeakStartTime] = useState(null);
  const [waterWasted, setWaterWasted] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [leakPeriods, setLeakPeriods] = useState([]);
  
  // State for cost calculations
  const [gallonsWasted, setGallonsWasted] = useState(0);
  const [costSoFar, setCostSoFar] = useState(0);
  const [yearlyCost, setYearlyCost] = useState(0);
  
  // State for realistic simulation mode
  const [simulationMode, setSimulationMode] = useState(MODE_NORMAL_IDLE);
  const [burstStartTime, setBurstStartTime] = useState(null);
  const [leakModeStartTime, setLeakModeStartTime] = useState(null);

  /**
   * Generate mock sensor data for initial load
   * Creates a 30-minute dataset showing normal usage (no leak)
   * This provides a baseline view when the app first loads
   */
  const generateMockData = () => {
    // Use the same normal data generation for consistency
    return generateNormalData();
  };

  /**
   * Detect if current reading indicates a leak
   * Leak conditions:
   * - flow_rate_lpm > 0 AND flow_rate_lpm < 0.5
   * - duration_seconds > 1800 (30 minutes)
   */
  const detectLeak = (reading, previousReadings) => {
    if (!reading) return false;
    
    const { flow_rate_lpm, duration_seconds } = reading;
    
    // Check if flow rate is in leak range
    const isLowFlow = flow_rate_lpm > LEAK_THRESHOLD_MIN && flow_rate_lpm < LEAK_THRESHOLD_MAX;
    
    if (!isLowFlow) {
      return false;
    }
    
    // Check if leak has persisted long enough
    // We need to check consecutive readings to determine duration
    let consecutiveLeakDuration = 0;
    let consecutiveCount = 0;
    
    // Look back through previous readings to find leak duration
    for (let i = previousReadings.length - 1; i >= 0; i--) {
      const prev = previousReadings[i];
      const prevIsLeak = prev.flow_rate_lpm > LEAK_THRESHOLD_MIN && 
                        prev.flow_rate_lpm < LEAK_THRESHOLD_MAX;
      
      if (prevIsLeak) {
        consecutiveCount++;
        consecutiveLeakDuration += prev.duration_seconds || 60;
      } else {
        break;
      }
    }
    
    // Include current reading
    consecutiveLeakDuration += duration_seconds || 60;
    
    return consecutiveLeakDuration >= LEAK_DURATION_THRESHOLD;
  };

  /**
   * Calculate water wasted during leak period
   * For demo leaks, uses the full leak duration (many hours) if available
   */
  const calculateWaterWasted = (readings, leakStartTime, currentFlowRate) => {
    // If we have a leak start time, calculate based on full duration
    // This handles long-running demo leaks (12 hours)
    if (leakStartTime && currentFlowRate > 0 && currentFlowRate < LEAK_THRESHOLD_MAX) {
      const now = new Date();
      const leakStart = new Date(leakStartTime);
      const leakDurationMs = now.getTime() - leakStart.getTime();
      const leakDurationMinutes = leakDurationMs / (1000 * 60);
      
      // Calculate total water wasted: flow_rate (L/min) × duration (minutes)
      return currentFlowRate * leakDurationMinutes;
    }
    
    // Fallback: calculate from readings (for normal operation)
    let totalLiters = 0;
    let leakStart = null;
    
    readings.forEach((reading, index) => {
      const isLeak = reading.flow_rate_lpm > LEAK_THRESHOLD_MIN && 
                     reading.flow_rate_lpm < LEAK_THRESHOLD_MAX;
      
      if (isLeak) {
        if (leakStart === null) {
          leakStart = index;
        }
        // Calculate water: flow_rate (L/min) * duration (minutes)
        const durationMinutes = (reading.duration_seconds || 60) / 60;
        totalLiters += reading.flow_rate_lpm * durationMinutes;
      } else {
        if (leakStart !== null) {
          // Leak period ended
          leakStart = null;
        }
      }
    });
    
    return totalLiters;
  };

  /**
   * Calculate water cost based on New Jersey residential rates
   * Converts liters to gallons and applies estimated cost per gallon
   * 
   * Assumptions:
   * - New Jersey residential water cost: ~$0.008 per gallon
   * - 1 gallon ≈ 3.785 liters
   * - This is an estimate for awareness, not an exact bill calculation
   */
  const calculateWaterCost = (litersWasted, currentFlowRate) => {
    // Convert liters to gallons
    const gallonsWasted = litersWasted / LITERS_PER_GALLON;
    
    // Calculate cost so far
    const costSoFar = gallonsWasted * NJ_WATER_COST_PER_GALLON;
    
    // Calculate yearly projection if leak continues
    // Based on current flow rate: cost per minute × minutes per year
    let yearlyCost = 0;
    if (currentFlowRate > 0 && currentFlowRate < LEAK_THRESHOLD_MAX) {
      // Flow rate in gallons per minute
      const flowRateGallonsPerMin = currentFlowRate / LITERS_PER_GALLON;
      // Cost per minute
      const costPerMinute = flowRateGallonsPerMin * NJ_WATER_COST_PER_GALLON;
      // Yearly cost: cost per minute × 60 min/hour × 24 hours/day × 365 days/year
      yearlyCost = costPerMinute * 60 * 24 * 365;
    }
    
    return {
      gallonsWasted,
      costSoFar,
      yearlyCost,
    };
  };

  /**
   * Find leak periods for chart highlighting
   */
  const findLeakPeriods = (readings) => {
    const periods = [];
    let currentPeriod = null;
    
    readings.forEach((reading, index) => {
      const isLeak = reading.flow_rate_lpm > LEAK_THRESHOLD_MIN && 
                     reading.flow_rate_lpm < LEAK_THRESHOLD_MAX;
      
      if (isLeak) {
        if (currentPeriod === null) {
          currentPeriod = { start: reading.timestamp, end: reading.timestamp };
        } else {
          currentPeriod.end = reading.timestamp;
        }
      } else {
        if (currentPeriod !== null) {
          periods.push(currentPeriod);
          currentPeriod = null;
        }
      }
    });
    
    // Add final period if still active
    if (currentPeriod !== null) {
      periods.push(currentPeriod);
    }
    
    return periods;
  };

  /**
   * Update all state based on new sensor data
   * Helper function to keep state synchronized
   * @param {Array} data - Sensor data array
   * @param {string|null} overrideLeakStartTime - Optional leak start time override (for demo mode)
   */
  const updateStateFromData = (data, overrideLeakStartTime = null) => {
    if (data.length === 0) return;
    
    const latest = data[data.length - 1];
    setCurrentReading(latest);
    
    const isLeak = detectLeak(latest, data);
    setLeakDetected(isLeak);
    
    // Find leak start time if leak is detected
    // For demo leaks, overrideLeakStartTime is provided (many hours ago)
    if (isLeak) {
      if (overrideLeakStartTime) {
        // Use provided leak start time (demo mode - long-running leak)
        setLeakStartTime(overrideLeakStartTime);
      } else if (!leakStartTime) {
        // Find leak start from data (normal operation)
        for (let i = data.length - 1; i >= 0; i--) {
          const reading = data[i];
          const isLeakReading = reading.flow_rate_lpm > LEAK_THRESHOLD_MIN && 
                               reading.flow_rate_lpm < LEAK_THRESHOLD_MAX;
          if (!isLeakReading) {
            if (i < data.length - 1) {
              setLeakStartTime(data[i + 1].timestamp);
            }
            break;
          }
        }
      }
    } else {
      setLeakStartTime(null);
    }
    
    // Calculate water wasted using full leak duration if available
    // Use override or current leakStartTime for accurate calculation
    const currentLeakStartTime = overrideLeakStartTime || leakStartTime;
    const wasted = calculateWaterWasted(data, currentLeakStartTime, latest?.flow_rate_lpm);
    setWaterWasted(wasted);
    
    // Calculate cost estimates (only show if leak is detected)
    if (isLeak && latest) {
      const costData = calculateWaterCost(wasted, latest.flow_rate_lpm);
      setGallonsWasted(costData.gallonsWasted);
      setCostSoFar(costData.costSoFar);
      setYearlyCost(costData.yearlyCost);
    } else {
      // Reset cost data when no leak
      setGallonsWasted(0);
      setCostSoFar(0);
      setYearlyCost(0);
    }
    
    const periods = findLeakPeriods(data);
    setLeakPeriods(periods);
  };

  /**
   * Generate data with a simulated leak
   * Demo leaks simulate a leak that has already been running for several hours.
   * This creates a realistic long-running micro-leak scenario (12 hours = 43,200 seconds).
   * The graph shows the last 60 minutes for readability, but calculations use full duration.
   */
  const generateLeakData = () => {
    const now = new Date();
    const data = [];
    
    // Demo leak has been running for 12 hours (43,200 seconds)
    // This represents a serious, long-running micro-leak
    const LEAK_DURATION_HOURS = 12;
    const LEAK_DURATION_MINUTES = LEAK_DURATION_HOURS * 60;
    const LEAK_DURATION_SECONDS = LEAK_DURATION_MINUTES * 60;
    
    // For the graph, show the last 60 minutes (readable window)
    // This represents a snapshot of a much longer leak
    const GRAPH_WINDOW_MINUTES = 60;
    
    // Generate data for the last 60 minutes (graph window)
    // This is a fixed window showing the most recent portion of the long-running leak
    for (let i = 0; i <= GRAPH_WINDOW_MINUTES; i++) {
      const timestamp = new Date(now.getTime() - (GRAPH_WINDOW_MINUTES - i) * 60 * 1000);
      
      // Leak: steady low flow (0.15-0.3 L/min)
      // Minimal variation to show consistency (small noise is okay)
      const baseFlow = 0.22; // Base flow rate around 0.22 L/min
      const noise = (Math.random() - 0.5) * 0.08; // Small variation ±0.04
      const flowRate = Math.max(0.15, Math.min(0.3, baseFlow + noise));
      
      data.push({
        timestamp: timestamp.toISOString(),
        flow_rate_lpm: flowRate,
        duration_seconds: 60, // Each reading represents 1 minute
        minutes_ago: GRAPH_WINDOW_MINUTES - i, // For chart labeling
        // Store full leak duration for cost calculations
        fullLeakDurationSeconds: LEAK_DURATION_SECONDS,
      });
    }
    
    return data;
  };

  /**
   * Generate normal data (no leaks)
   * Creates a complete 30-minute dataset showing realistic normal usage
   * Normal usage is either:
   * - Zero flow (most of the time - idle state)
   * - Short high-flow bursts (5-7 L/min for 30-120 seconds)
   * This demonstrates why normal usage doesn't trigger leak alerts: it's brief
   */
  const generateNormalData = () => {
    const now = new Date();
    const data = [];
    
    // Generate exactly 30 minutes of data (30 data points, one per minute)
    // Burst occurs at minute 8-10 (realistic point in the timeline)
    const burstStartMinute = 8;
    const burstDurationMinutes = 2; // 2 minutes = 120 seconds
    
    for (let i = 0; i <= 30; i++) {
      const timestamp = new Date(now.getTime() - (30 - i) * 60 * 1000);
      let flowRate = 0;
      
      // Normal usage: mostly zero flow (idle state)
      // One short burst of high flow occurs briefly
      if (i >= burstStartMinute && i < burstStartMinute + burstDurationMinutes) {
        // Burst period: high flow (5-7 L/min)
        // This represents normal water usage (faucet, shower, etc.)
        flowRate = 5.5 + Math.random() * 1.5; // 5.5-7 L/min
      } else {
        // Normal: no flow (idle state - most of the time)
        flowRate = 0;
      }
      
      data.push({
        timestamp: timestamp.toISOString(),
        flow_rate_lpm: flowRate,
        duration_seconds: i >= burstStartMinute && i < burstStartMinute + burstDurationMinutes ? 60 : 0,
        minutes_ago: 30 - i, // For chart labeling
      });
    }
    
    return data;
  };

  /**
   * Demo control: Simulate a leak
   * Instantly generates data showing a long-running leak (12 hours)
   * Demo leaks simulate a leak that has already been running for several hours.
   * This creates immediate impact: alerts, cost, and guidance all appear instantly.
   */
  const handleSimulateLeak = () => {
    setSimulationMode(MODE_LEAK);
    
    // Set leak start time to 12 hours ago (long-running leak)
    const leakStartTimeValue = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const leakStartTimeISO = leakStartTimeValue.toISOString();
    setLeakModeStartTime(leakStartTimeValue);
    setBurstStartTime(null);
    
    // Generate leak dataset (shows last 60 minutes in graph, but leak is 12 hours old)
    const leakData = generateLeakData();
    setSensorData(leakData);
    
    // Update state with leak data, passing leak start time for accurate calculations
    updateStateFromData(leakData, leakStartTimeISO);
  };

  /**
   * Demo control: Return to normal conditions
   * Instantly generates a complete 30-minute dataset showing normal usage
   * Normal usage is brief (one short burst) and doesn't trigger leak alerts
   */
  const handleReturnToNormal = () => {
    setSimulationMode(MODE_NORMAL_IDLE);
    setBurstStartTime(null);
    setLeakModeStartTime(null);
    
    // Generate complete 30-minute normal dataset instantly
    const normalData = generateNormalData();
    setSensorData(normalData);
    updateStateFromData(normalData);
  };

  // Initialize with normal data (30-minute dataset)
  useEffect(() => {
    const initialData = generateMockData(); // Generates 30-minute normal dataset
    setSensorData(initialData);
    setSimulationMode(MODE_NORMAL_IDLE);
    updateStateFromData(initialData);
  }, []);

  // Note: Demo mode uses pre-generated 30-minute datasets
  // No automatic updates needed - data is complete when buttons are clicked
  // This keeps the demo simple and instantly shows the full timeline

  // Calculate leak duration in minutes
  const leakDurationMinutes = leakStartTime
    ? (new Date().getTime() - new Date(leakStartTime).getTime()) / 1000 / 60
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
            AquaGuard
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Water Leak Awareness System
          </p>
        </header>

        {/* Alert Banner */}
        <AlertBanner 
          leakDetected={leakDetected} 
          durationMinutes={leakDurationMinutes}
        />

        {/* Main Dashboard */}
        <div className="space-y-6">
          {/* Status Card */}
          <StatusCard leakDetected={leakDetected} />

          {/* Dashboard Stats */}
          {currentReading && (
            <DashboardStats
              flowRate={currentReading.flow_rate_lpm}
              waterWasted={waterWasted}
              gallonsWasted={gallonsWasted}
              costSoFar={costSoFar}
              yearlyCost={yearlyCost}
            />
          )}

          {/* Usage Chart */}
          {sensorData.length > 0 && (
            <UsageChart data={sensorData} leakPeriods={leakPeriods} />
          )}

          {/* Leak Guidance Panel */}
          <LeakGuidance 
            leakDetected={leakDetected}
            durationMinutes={leakDurationMinutes}
          />

          {/* Educational Message */}
          <EducationalMessage 
            leakDetected={leakDetected}
            messageIndex={messageIndex}
          />

          {/* Demo Controls */}
          <DemoControls
            onSimulateLeak={handleSimulateLeak}
            onReturnToNormal={handleReturnToNormal}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>AquaGuard - Raising awareness about water conservation</p>
          <p className="mt-1">This is a demo system for educational purposes</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
