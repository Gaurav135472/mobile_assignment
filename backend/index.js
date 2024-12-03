import { createClient } from 'redis';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3001;

// Initialize Redis Client
let redisClient;

(async () => {
    try {
        // Create Redis client
        redisClient = createClient({
            socket: {
                host: 'redis-14513.c253.us-central1-1.gce.redislabs.com', // Replace with your Redis Cloud host
                port: 14513 // Replace with your Redis Cloud port
            },
            password: 'your-redis-cloud-password' // Replace with your Redis Cloud password
        });

        // Connect to Redis
        await redisClient.connect();
        console.log('Connected to Redis Cloud!');
    } catch (err) {
        console.error('Failed to connect to Redis Cloud:', err);
        process.exit(1); // Exit if Redis connection fails
    }
})();

app.use(bodyParser.json());

// Middleware to ensure Redis client is connected
app.use((req, res, next) => {
    if (!redisClient || !redisClient.isOpen) {
        return res.status(500).json({ error: 'Redis client is not connected' });
    }
    next();
});

// Load TODO list
app.get('/load', async (req, res) => {
    try {
        const todos = await redisClient.get('todo_items');
        res.json(JSON.parse(todos) || []); // Return empty array if no items exist
    } catch (error) {
        res.status(500).json({ error: 'Failed to load TODO items' });
    }
});

// Save TODO list
app.post('/save', async (req, res) => {
    try {
        const todos = req.body;
        if (!Array.isArray(todos)) {
            return res.status(400).json({ error: 'Invalid data format' });
        }
        await redisClient.set('todo_items', JSON.stringify(todos));
        res.json({ status: 'save successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save TODO items' });
    }
});

// Clear TODO list
app.get('/clear', async (req, res) => {
    try {
        await redisClient.del('todo_items');
        res.json({ status: 'clear successful' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear TODO items' });
    }
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
