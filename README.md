# AquaGuard - Water Leak Awareness System

A simple, demo-ready web application that detects and alerts users about small, continuous water leaks to increase awareness and encourage behavior change.

## Overview

AquaGuard is designed for a high school engineering competition. It is **NOT** a smart shutoff system - it only detects and notifies users about micro-leaks to raise awareness.

## Features

- **Leak Detection**: Automatically detects leaks when:
  - Flow rate is between 0 and 0.5 L/min
  - Leak persists for more than 30 minutes (1800 seconds)

- **Real-time Dashboard**: 
  - Current flow rate display
  - Leak status indicator (Normal / Possible Leak)
  - Estimated water wasted calculation

- **Usage Timeline**: Visual chart showing water flow over time with leak periods highlighted

- **Educational Feedback**: Rotating sustainability messages to educate users about water conservation

## Tech Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite
- **No Backend**: Uses mock sensor data

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

## Project Structure

```
src/
  ├── components/
  │   ├── AlertBanner.jsx      # Prominent leak alert banner
  │   ├── StatusCard.jsx        # Leak status indicator
  │   ├── DashboardStats.jsx    # Flow rate and water wasted stats
  │   ├── UsageChart.jsx        # Timeline chart with leak highlighting
  │   └── EducationalMessage.jsx # Sustainability tips
  ├── App.jsx                   # Main application with leak detection logic
  ├── index.css                 # Tailwind CSS imports
  └── main.jsx                  # React entry point
```

## Sensor Data Format

The app expects sensor data in this format:
```json
{
  "timestamp": "ISO_8601_string",
  "flow_rate_lpm": number,
  "duration_seconds": number
}
```

## Leak Detection Logic

A leak is detected when:
- `flow_rate_lpm > 0` AND `flow_rate_lpm < 0.5`
- Continuous flow persists for `duration_seconds > 1800` (30 minutes)

## Design Principles

- Clean, minimal UI
- Large, readable text
- Clear color signals (green = normal, red = leak)
- Mobile-friendly responsive layout
- No complex settings or menus

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Demo Notes

The app uses simulated sensor data that includes:
- Normal periods (no flow)
- Usage periods (high flow)
- A simulated leak period (low continuous flow)

The mock data updates every 10 seconds to simulate real-time monitoring.

## License

This project is created for educational/demonstration purposes.
