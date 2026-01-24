import { useState, useEffect } from 'react';
import AlertBanner from './components/AlertBanner';
import StatusCard from './components/StatusCard';
import DashboardStats from './components/DashboardStats';
import UsageChart from './components/UsageChart';
import EducationalMessage from './components/EducationalMessage';
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

function App() {
  // State for sensor data
  const [sensorData, setSensorData] = useState([]);
  const [currentReading, setCurrentReading] = useState(null);
  const [leakDetected, setLeakDetected] = useState(false);
  const [leakStartTime, setLeakStartTime] = useState(null);
  const [waterWasted, setWaterWasted] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [leakPeriods, setLeakPeriods] = useState([]);

  /**
   * Generate mock sensor data
   * Simulates realistic water flow patterns with occasional leaks
   */
  const generateMockData = () => {
    const now = new Date();
    const data = [];
    
    // Generate data for the last 2 hours (120 minutes)
    for (let i = 120; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000);
      let flowRate = 0;
      
      // Simulate different scenarios:
      // - Normal periods (0 flow)
      // - Usage periods (high flow > 1 L/min)
      // - Leak periods (low flow 0.1-0.4 L/min)
      
      const minuteOfHour = timestamp.getMinutes();
      const hourOfDay = timestamp.getHours();
      
      // Simulate a leak starting 45 minutes ago and continuing
      if (i >= 45 && i <= 75) {
        // Leak period: continuous low flow
        flowRate = 0.2 + Math.random() * 0.2; // 0.2-0.4 L/min
      } else if (Math.random() > 0.7 && i < 45) {
        // Random usage periods
        flowRate = 1.5 + Math.random() * 3; // 1.5-4.5 L/min
      } else {
        // Normal: no flow
        flowRate = 0;
      }
      
      data.push({
        timestamp: timestamp.toISOString(),
        flow_rate_lpm: flowRate,
        duration_seconds: 60, // Each reading represents 1 minute
      });
    }
    
    return data;
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
   */
  const calculateWaterWasted = (readings) => {
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

  // Initialize with mock data
  useEffect(() => {
    const initialData = generateMockData();
    setSensorData(initialData);
    
    if (initialData.length > 0) {
      const latest = initialData[initialData.length - 1];
      setCurrentReading(latest);
      
      const isLeak = detectLeak(latest, initialData);
      setLeakDetected(isLeak);
      
      if (isLeak) {
        // Find when leak started
        for (let i = initialData.length - 1; i >= 0; i--) {
          const reading = initialData[i];
          const isLeakReading = reading.flow_rate_lpm > LEAK_THRESHOLD_MIN && 
                               reading.flow_rate_lpm < LEAK_THRESHOLD_MAX;
          if (!isLeakReading) {
            if (i < initialData.length - 1) {
              setLeakStartTime(initialData[i + 1].timestamp);
            }
            break;
          }
        }
      }
      
      const wasted = calculateWaterWasted(initialData);
      setWaterWasted(wasted);
      
      const periods = findLeakPeriods(initialData);
      setLeakPeriods(periods);
    }
  }, []);

  // Simulate new sensor readings every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate new reading
      const now = new Date();
      let flowRate = 0;
      
      // Continue the simulated leak
      const timeSinceStart = (now.getTime() - new Date(sensorData[0]?.timestamp || now).getTime()) / 1000 / 60;
      if (timeSinceStart > 45 && timeSinceStart < 75) {
        flowRate = 0.2 + Math.random() * 0.2;
      } else if (Math.random() > 0.85) {
        flowRate = 1.5 + Math.random() * 3;
      }
      
      const newReading = {
        timestamp: now.toISOString(),
        flow_rate_lpm: flowRate,
        duration_seconds: 60,
      };
      
      // Add to data (keep last 120 readings)
      const updatedData = [...sensorData, newReading].slice(-120);
      setSensorData(updatedData);
      setCurrentReading(newReading);
      
      // Check for leak
      const isLeak = detectLeak(newReading, updatedData);
      setLeakDetected(isLeak);
      
      if (isLeak && !leakStartTime) {
        // Find leak start
        for (let i = updatedData.length - 1; i >= 0; i--) {
          const reading = updatedData[i];
          const isLeakReading = reading.flow_rate_lpm > LEAK_THRESHOLD_MIN && 
                               reading.flow_rate_lpm < LEAK_THRESHOLD_MAX;
          if (!isLeakReading) {
            if (i < updatedData.length - 1) {
              setLeakStartTime(updatedData[i + 1].timestamp);
            }
            break;
          }
        }
      } else if (!isLeak) {
        setLeakStartTime(null);
      }
      
      // Update water wasted
      const wasted = calculateWaterWasted(updatedData);
      setWaterWasted(wasted);
      
      // Update leak periods
      const periods = findLeakPeriods(updatedData);
      setLeakPeriods(periods);
      
      // Rotate educational message every 30 seconds
      if (Math.random() > 0.7) {
        setMessageIndex((prev) => prev + 1);
      }
    }, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [sensorData, leakStartTime]);

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
            />
          )}

          {/* Usage Chart */}
          {sensorData.length > 0 && (
            <UsageChart data={sensorData} leakPeriods={leakPeriods} />
          )}

          {/* Educational Message */}
          <EducationalMessage 
            leakDetected={leakDetected}
            messageIndex={messageIndex}
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
