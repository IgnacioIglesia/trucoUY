# TrucoUY

Plataforma de Truco uruguayo multijugador en tiempo real. Jugá partidas 1v1, 2v2 y 3v3 contra amigos o desconocidos, seguí tu ranking y desbloqueá logros.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 8 + Tailwind CSS v4 |
| Backend | Node.js + Express 5 + Socket.IO |
| Base de datos | Firebase Firestore |
| Auth | Firebase Authentication (email + Google) |
| Hosting | Firebase Hosting (frontend) |

## Características

- **Truco Online** — partidas 1v1, 2v2 y 3v3 en tiempo real vía WebSocket
- **Server-authoritative** — toda la lógica del juego corre en el servidor; el cliente es puro display
- **Lobby con código** — compartí un link de invitación para que un amigo se una directamente
- **Ranking global** — tabla de los 50 mejores jugadores, ordenada por victorias y winrate
- **Perfil público** — estadísticas, racha actual, historial de las últimas partidas y ring de winrate
- **Logros** — 10 badges que se desbloquean automáticamente según el historial del jugador
- **Historial detallado** — cada partida guardada con rival, puntaje y fecha relativa
- **Stats avanzadas** — mejor racha histórica, winrate de las últimas 10 partidas, partidas del mes

## Estructura del proyecto

```
playroom/
├── frontend/          # React SPA
│   └── src/
│       ├── pages/
│       │   ├── Truco/       # Lobby, sala de juego 1v1/2v2/3v3
│       │   ├── Perfil.jsx   # Perfil propio (tabs: resumen, historial, logros, rivales, editar)
│       │   ├── PerfilPublico.jsx
│       │   ├── Ranking.jsx
│       │   ├── Login.jsx
│       │   └── Registro.jsx
│       └── components/
└── backend/           # Express + Socket.IO
    ├── trucoLogica.js  # Lógica completa del Truco (server-authoritative)
    └── routes/
```

## Setup local

### Requisitos

- Node.js 20+
- Una cuenta Firebase con Firestore y Authentication habilitados

### Variables de entorno

Creá `frontend/.env.local`:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_BACKEND_URL=http://localhost:3001
```

### Correr el proyecto

```bash
# Backend
cd backend
npm install
node index.js

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

El frontend queda en `http://localhost:5173` y el backend en `http://localhost:3001`.

## Reglas de Firestore

Las reglas están en `firestore.rules`. El backend escribe en Firestore con permisos de admin a través del SDK Admin (no expuesto al cliente).

## Scripts útiles

```bash
# Build de producción
cd frontend && npm run build

# Lint
cd frontend && npm run lint

# Preview del build
cd frontend && npm run preview
```

## Licencia

Uso personal / privado.
