const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);

// 1. Tracking Link Route
app.get('/track', (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    
    // Using standard quotes to guarantee no backtick syntax issues
    const logEntry = "[" + timestamp + "] INTEREST DETECTED - IP: " + clientIp + " - Device: " + userAgent + "\n";
    
    fs.appendFile(path.join(__dirname, 'clicks.txt'), logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
        res.redirect('https://brianirungu224-sys.github.io/Sanifu-Digital/'); 
    });
});

// 2. Dashboard Route
app.get('/sanifu-dashboard', (req, res) => {
    const logFilePath = path.join(__dirname, 'clicks.txt');
    
    if (!fs.existsSync(logFilePath)) {
        return res.send('<h1>Sanifu Digital Dashboard</h1><p>No client clicks recorded yet.</p>');
    }
    
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading tracking logs.');
        }
        
        const lines = data.split('\n');
        let formattedLogs = '';
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() !== '') {
                formattedLogs += '<li>' + lines[i] + '</li>';
            }
        }
        
        res.send(
            '<h1>Sanifu Digital - Active Client Tracker</h1>' +
            '<p>Every line below represents a client who clicked your link:</p>' +
            '<ul>' + formattedLogs + '</ul>' +
            '<br>' +
            '<a href="/sanifu-dashboard">Refresh Tracker</a>'
        );
    });
});

app.listen(PORT, () => {
    console.log('Tracker running perfectly on port ' + PORT);
});