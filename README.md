# VoltGuard - AI-Powered Smart Energy Management System

VoltGuard is an innovative smart energy management system that uses AI-powered mmWave technology and TinyML to optimize energy consumption in your home or office. The system provides real-time presence detection and automated energy optimization.

## Features

- 🤖 AI-Driven Automation
- 📊 Real-time Energy Analytics
- 🌞 Solar-Powered Operation
- 🔒 Privacy-Focused Design
- 🔌 Smart Device Integration
- 📱 Responsive Web Interface

## Hardware Requirements

- mmWave Sensor (e.g., TI IWR6843ISK-ODS)
- Microcontroller (e.g., ESP32 or Arduino)
- Power Supply
- USB Cable for programming
- Optional: Solar Panel for eco-friendly operation

## Software Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voltguard.git
cd voltguard
```

2. Install dependencies:
```bash
npm install
```

3. Configure hardware connection:
   - Connect your mmWave sensor to your computer via USB
   - Note the port name (e.g., COM3 on Windows, /dev/ttyUSB0 on Linux)
   - Update the port configuration in `server.js`

4. Start the server:
```bash
npm start
```

5. Open the web interface:
   - Navigate to `http://localhost:3000` in your web browser
   - The interface will automatically connect to your hardware

## Hardware Setup

1. Connect the mmWave sensor:
   - Power supply to VCC and GND
   - USB to UART converter for programming
   - Optional: Solar panel connection

2. Upload firmware:
   - Use the provided firmware for your microcontroller
   - Configure the sensor parameters
   - Test the basic functionality

3. Calibration:
   - Follow the on-screen calibration process
   - Adjust sensitivity as needed
   - Save the configuration

## Usage

1. **Dashboard**
   - View real-time energy consumption
   - Monitor occupancy status
   - Check system health

2. **Controls**
   - Toggle power states
   - Adjust sensitivity
   - Set schedules

3. **Analytics**
   - View energy usage patterns
   - Export reports
   - Track savings

## API Endpoints

### GET /api/status
Returns the current status of the hardware:
```json
{
    "status": "online",
    "power": "on",
    "energyUsage": "2.5 kWh",
    "occupancy": true
}
```

### POST /api/control
Send commands to the hardware:
```json
{
    "action": "power",
    "value": "on"
}
```

## Troubleshooting

1. **Hardware Connection Issues**
   - Check USB connections
   - Verify port permissions
   - Test with different USB cable

2. **Software Issues**
   - Clear browser cache
   - Restart the server
   - Check console for errors

3. **Performance Issues**
   - Adjust sensor sensitivity
   - Optimize polling frequency
   - Check network connectivity

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: soumenbhandari88@gmail.com
- Phone: +91 8116862676

## Acknowledgments

- TI for mmWave technology
- Open-source community
- Contributors and testers

---

Made with ❤️ by VoltGuard Team 
