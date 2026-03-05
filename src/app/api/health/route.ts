/**
 * GET /api/health
 *
 * Simple health check endpoint used by Docker health checks,
 * load balancers, and uptime monitors.
 */

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  });
}
