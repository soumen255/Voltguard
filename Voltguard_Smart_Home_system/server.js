const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory

// Hardware communication endpoints
app.get('/api/status', (req, res) => {
    // Replace this with actual hardware communication
    res.json({
        status: 'online',
        power: 'on',
        energyUsage: '2.5 kWh',
        occupancy: true
    });
});

app.post('/api/control', (req, res) => {
    const { action, value } = req.body;
    // Replace this with actual hardware control
    console.log(`Sending command to hardware: ${action} = ${value}`);
    res.json({ success: true, message: `Command ${action} executed successfully` });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 