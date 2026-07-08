const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ── Security & parsing middleware ─────────────────────────
app.use(helmet()); // sets safe HTTP response headers
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*'
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : '*',
  })
);
app.use(express.json()); // parse application/json bodies
app.use(express.urlencoded({ extended: true })); // parse form-encoded bodies

// ── Request logging (skip noise during tests) ─────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Health check ──────────────────────────────────────────
// Lightweight endpoint for uptime monitors, load balancers and
// the upcoming Django AI service to confirm this API is alive.
app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'vastra-ai-backend',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ────────────────────────────────────────────
// Feature routers (auth, users, artisans, designs, ...) will be
// mounted under /api here as we build each module.

// ── Error handling (must be registered last) ──────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
