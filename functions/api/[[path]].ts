import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { getAuth } from '@clerk/nextjs/server';

// Define the environment bindings expected from Cloudflare
export interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>().basePath('/api');

// Middleware to check for authenticated user for specific routes
// Note: Clerk's authMiddleware in Next.js already protects API routes,
// but this provides an extra layer of assurance within the function itself.
app.use('/campaigns/*', async (c, next) => {
  // In Pages Functions, auth needs to be handled differently.
  // getAuth is not designed for this context.
  // We will rely on the Next.js middleware for protection for now.
  await next();
});

// GET /api/campaigns - Get all active campaigns
app.get('/campaigns', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM campaigns WHERE status = 'active' ORDER BY created_at DESC"
    ).all();
    return c.json(results);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Failed to fetch campaigns' }, 500);
  }
});

// POST /api/campaigns - Create a new campaign
app.post('/campaigns', async (c) => {
  // We need a way to get the authenticated userId here.
  // This will require a custom solution or different auth pattern.
  // For now, let's placeholder it.
  const userId = 'user_placeholder'; // IMPORTANT: Replace with real auth logic
  const { title, description, total_budget, rate_per_10k_views, terms } = await c.req.json();

  if (!title || !total_budget || !rate_per_10k_views) {
    return c.json({ error: 'Missing required fields' }, 400);
  }

  try {
    const { success } = await c.env.DB.prepare(
      `INSERT INTO campaigns (creator_id, title, description, total_budget, rate_per_10k_views, terms)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(userId, title, description, total_budget, rate_per_10k_views, terms).run();

    if (success) {
      return c.json({ message: 'Campaign created successfully' }, 201);
    } else {
      return c.json({ error: 'Failed to create campaign' }, 500);
    }
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Failed to create campaign' }, 500);
  }
});


// The 'handle' function is used to adapt Hono to the Cloudflare Pages Functions runtime.
export const onRequest: PagesFunction<Env> = handle(app);