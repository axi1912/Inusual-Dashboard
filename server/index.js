require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const path = require('path');
const db = require('../Data/db-mongo');

// Conectar a MongoDB al iniciar
db.connectDB().then(() => {
    console.log(' Dashboard conectado a MongoDB');
    db.initStats();
}).catch(err => console.error(' Error conectando a MongoDB:', err));
const { spawn, exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Almacenar procesos de bots
const botProcesses = {};
const botStartTimes = {};

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
    }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar Discord OAuth2
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Middleware de autenticación
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Rutas
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/dashboard');
    }
);

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Dashboard principal
app.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Obtener datos reales de la base de datos
        const stats = await db.getStats();

        res.render('dashboard', {
            user: req.user,
            stats: stats
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading dashboard');
    }
});

// Página de tickets
app.get('/tickets', isAuthenticated, async (req, res) => {
    const allTickets = await db.getAllTickets();
    
    // Formatear para la vista
    const tickets = allTickets.map(ticket => ({
        id: ticket.id,
        channelId: ticket.channelId,
        user: ticket.username,
        type: ticket.type,
        status: ticket.status === 'open' ? 'Open' : 'Closed',
        created: new Date(ticket.createdAt).toLocaleDateString()
    }));

    res.render('tickets', {
        user: req.user,
        tickets: tickets
    });
});

// API endpoint para tickets en tiempo real
app.get('/api/tickets', isAuthenticated, async (req, res) => {
    const allTickets = await db.getAllTickets();
    
    const tickets = allTickets.map(ticket => ({
        id: ticket.id,
        channelId: ticket.channelId,
        user: ticket.username,
        type: ticket.type,
        status: ticket.status, // Mantener minúscula
        created: new Date(ticket.createdAt).toLocaleDateString(),
        createdAt: ticket.createdAt, // Para ordenar
        details: ticket.details // Para el modal
    }));
    
    res.json(tickets);
});

// Página de vouches
app.get('/vouches', isAuthenticated, async (req, res) => {
    const allVouches = await db.getAllVouches();
    
    // Formatear para la vista
    const vouches = allVouches.map(vouch => ({
        id: vouch.id,
        from: vouch.fromUsername,
        to: vouch.toUsername,
        rating: vouch.stars,
        review: vouch.comment || 'No comment provided',
        date: new Date(vouch.createdAt).toLocaleDateString()
    }));

    res.render('vouches', {
        user: req.user,
        vouches: vouches
    });
});

// API endpoint para vouches en tiempo real
app.get('/api/vouches', isAuthenticated, async (req, res) => {
    const allVouches = await db.getAllVouches();
    
    const vouches = allVouches.map(vouch => ({
        id: vouch.id,
        from: vouch.fromUsername,
        to: vouch.toUsername,
        rating: vouch.stars,
        review: vouch.comment || 'No comment provided',
        date: new Date(vouch.createdAt).toLocaleDateString()
    }));
    
    res.json(vouches);
});

// Página de estadísticas
app.get('/stats', isAuthenticated, async (req, res) => {
    const allTickets = await db.getAllTickets();
    const allVouches = await db.getAllVouches();
    const stats = await db.getStats();
    
    // Calcular estadísticas detalladas
    const boostTickets = allTickets.filter(t => t.type === 'Boost').length;
    const customBotTickets = allTickets.filter(t => t.type === 'Custom Bot').length;
    const supportTickets = allTickets.filter(t => t.type === 'Support').length;
    
    // Calcular promedio de rating
    const totalRating = allVouches.reduce((sum, v) => sum + v.stars, 0);
    const avgRating = vouchesWithStars.length > 0 ? (totalRating / vouchesWithStars.length).toFixed(1) : 0;
    const fiveStarVouches = allVouches.filter(v => v.stars === 5).length;

    const statsData = {
        tickets: {
            total: stats.totalTickets,
            boost: boostTickets,
            customBot: customBotTickets,
            support: supportTickets
        },
        vouches: {
            total: stats.totalVouches,
            average: avgRating,
            fiveStars: fiveStarVouches
        },
        verification: {
            verified: stats.verifiedUsers,
            pending: 0
        }
    };

    res.render('stats', {
        user: req.user,
        stats: statsData
    });
});

// Página de control de bots
app.get('/bots', isAuthenticated, async (req, res) => {
    res.render('bots', {
        user: req.user
    });
});

// API endpoints para datos en tiempo real
app.get('/api/stats', isAuthenticated, async (req, res) => {
    const stats = await db.getStats();
    res.json(stats);
});

// API endpoint para obtener ticket específico
app.get('/api/ticket/:id', isAuthenticated, async (req, res) => {
    const ticketId = parseInt(req.params.id);
    const ticket = await db.getTicketById(ticketId);
    
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json(ticket);
});

// API endpoint para cerrar ticket
app.post('/api/ticket/:id/close', isAuthenticated, (req, res) => {
    const ticketId = parseInt(req.params.id);
    const success = db.closeTicket(ticketId);
    
    if (success) {
        res.json({ success: true, message: 'Ticket closed successfully' });
    } else {
        res.status(500).json({ error: 'Failed to close ticket' });
    }
});

// API: Datos de tendencia para gráfica
app.get('/api/trend-data', isAuthenticated, async (req, res) => {
    const allTickets = await db.getAllTickets();
    const now = new Date();
    const labels = [];
    const created = [];
    const closed = [];
    
    // Últimos 7 días
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        
        const dayTickets = allTickets.filter(t => {
            const ticketDate = new Date(t.createdAt);
            return ticketDate >= dayStart && ticketDate <= dayEnd;
        });
        
        const closedTickets = allTickets.filter(t => {
            if (!t.closedAt) return false;
            const closedDate = new Date(t.closedAt);
            return closedDate >= dayStart && closedDate <= dayEnd;
        });
        
        labels.push(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayStart.getDay()]);
        created.push(dayTickets.length);
        closed.push(closedTickets.length);
    }
    
    res.json({ labels, created, closed });
});

// API: Activity Feed
app.get('/api/activity-feed', isAuthenticated, async (req, res) => {
    const allTickets = await db.getAllTickets();
    const allVouches = await db.getAllVouches();
    const activities = [];
    
    // Agregar tickets recientes
    allTickets.slice(-10).reverse().forEach(ticket => {
        if (ticket.status === 'open') {
            activities.push({
                type: 'ticket_created',
                user: ticket.username,
                ticketId: ticket.id,
                time: new Date(ticket.createdAt).getTime()
            });
        } else {
            activities.push({
                type: 'ticket_closed',
                ticketId: ticket.id,
                time: new Date(ticket.closedAt || ticket.createdAt).getTime()
            });
        }
    });
    
    // Agregar vouches recientes
    allVouches.slice(-5).reverse().forEach(vouch => {
        activities.push({
            type: 'vouch_added',
            user: vouch.fromUsername,
            rating: vouch.stars,
            time: new Date(vouch.createdAt).getTime()
        });
    });
    
    // Ordenar por tiempo (más reciente primero)
    activities.sort((a, b) => b.time - a.time);
    
    res.json(activities.slice(0, 10));
});

// API: Top Users
app.get('/api/top-users', isAuthenticated, async (req, res) => {
    const allTickets = await db.getAllTickets();
    const userCounts = {};
    
    allTickets.forEach(ticket => {
        const username = ticket.username;
        userCounts[username] = (userCounts[username] || 0) + 1;
    });
    
    const topUsers = Object.entries(userCounts)
        .map(([username, count]) => ({ username, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    
    res.json(topUsers);
});

// Configuración de bots
const botsConfig = {
    inusual: { path: 'C:\\Users\\AXIOMS\\Desktop\\Inusual BOT', name: 'Inusual Boosting' },
    verification: { path: 'C:\\Users\\AXIOMS\\Desktop\\Verification BOT', name: 'Verification Bot' },
    vouch: { path: 'C:\\Users\\AXIOMS\\Desktop\\Vouch BOT', name: 'Vouch Bot' },
    support: { path: 'C:\\Users\\AXIOMS\\Desktop\\Support BOT', name: 'Support Bot' }
};

// API: Obtener estado de todos los bots
app.get('/api/bots/status', isAuthenticated, async (req, res) => {
    const status = {};
    
    for (const [id, config] of Object.entries(botsConfig)) {
        const process = botProcesses[id];
        const startTime = botStartTimes[id];
        
        status[id] = {
            running: process && !process.killed,
            pid: process ? process.pid : null,
            uptime: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
        };
    }
    
    res.json(status);
});

// API: Iniciar un bot
app.post('/api/bots/:id/start', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const config = botsConfig[id];
    
    if (!config) {
        return res.status(404).json({ error: 'Bot not found' });
    }
    
    if (botProcesses[id] && !botProcesses[id].killed) {
        return res.json({ error: 'Bot is already running' });
    }
    
    try {
        const process = spawn('npm', ['start'], {
            cwd: config.path,
            shell: true,
            detached: false
        });
        
        botProcesses[id] = process;
        botStartTimes[id] = Date.now();
        
        process.stdout.on('data', (data) => {
            console.log(`[${config.name}] ${data}`);
        });
        
        process.stderr.on('data', (data) => {
            console.error(`[${config.name}] ERROR: ${data}`);
        });
        
        process.on('close', (code) => {
            console.log(`[${config.name}] Process exited with code ${code}`);
            delete botProcesses[id];
            delete botStartTimes[id];
        });
        
        res.json({ success: true, message: `${config.name} started`, pid: process.pid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Detener un bot
app.post('/api/bots/:id/stop', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const config = botsConfig[id];
    
    if (!config) {
        return res.status(404).json({ error: 'Bot not found' });
    }
    
    const process = botProcesses[id];
    
    if (!process || process.killed) {
        return res.json({ error: 'Bot is not running' });
    }
    
    try {
        // En Windows, usar taskkill para matar el proceso y sus hijos
        exec(`taskkill /pid ${process.pid} /T /F`, (error) => {
            if (error) {
                console.error(`Error stopping ${config.name}:`, error);
            }
        });
        
        delete botProcesses[id];
        delete botStartTimes[id];
        
        res.json({ success: true, message: `${config.name} stopped` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🌐 Dashboard running on http://localhost:${PORT}`);
    console.log(`✅ Ready to manage Inusual Bots`);
});
















