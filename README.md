# Inusual Dashboard

Web dashboard para gestionar los bots de Inusual.

## Configuración

### 1. Crear aplicación OAuth2 en Discord

1. Ve a https://discord.com/developers/applications
2. Selecciona cualquiera de tus bots o crea una nueva app
3. Ve a **OAuth2 → General**
4. Copia el **Client ID** y **Client Secret**
5. En **Redirects** añade: `http://localhost:3000/auth/callback`

### 2. Configurar .env

Edita el archivo `.env` y añade:
```
DISCORD_CLIENT_ID=tu_client_id_aqui
DISCORD_CLIENT_SECRET=tu_client_secret_aqui
SESSION_SECRET=cualquier_texto_aleatorio_seguro
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el dashboard

```bash
npm start
```

O para desarrollo con auto-reload:
```bash
npm run dev
```

### 5. Acceder

Abre tu navegador en: http://localhost:3000

## Características

- 🔐 Login con Discord OAuth2
- 📊 Dashboard con estadísticas generales
- 🎫 Gestión de tickets (boost, custom bots, soporte)
- ⭐ Visualización de vouches
- 📈 Estadísticas detalladas
- 🎨 Diseño mint (#00D9A3) profesional
- 📱 Responsive design
- 🔒 Rutas protegidas con autenticación

## Páginas

- `/` - Login
- `/dashboard` - Panel principal
- `/tickets` - Gestión de tickets
- `/vouches` - Ver vouches
- `/stats` - Estadísticas detalladas
- `/logout` - Cerrar sesión

## API Endpoints

- `GET /api/stats` - Obtener estadísticas en tiempo real

## Estructura

```
Dashboard/
├── server/
│   └── index.js (servidor Express)
├── views/
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── tickets.ejs
│   ├── vouches.ejs
│   ├── stats.ejs
│   └── partials/
│       └── navbar.ejs
├── public/
│   └── css/
│       └── style.css
├── .env
├── package.json
└── README.md
```

## Próximas mejoras

- [ ] Conexión real con bots para datos en tiempo real
- [ ] Base de datos para persistencia
- [ ] Gráficas interactivas
- [ ] Sistema de notificaciones
- [ ] Gestión de configuración de bots
- [ ] Logs de actividad
