import { serve } from "bun";
import index from "./index.html";

const server = serve({
  port: 3000,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/*": async (req) => {
      console.log(`Received ${req.method} request for: ${req.url}`);
      const url = new URL(req.url);
      const targetUrl = "https://flowmart.banit.co.ke" + url.pathname.replace("/api", "");

      console.log(`Proxying ${req.method} request to: ${targetUrl}`);

      const headers = new Headers(req.headers);
      headers.set("Host", new URL(targetUrl).hostname);

      // Forward the request exactly as it came in
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: headers,
        body: req.body,
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Add CORS headers to the response
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      // For preflight requests, return a simple response
      if (req.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
      }

      // Clone the response and add CORS headers
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: { ...response.headers, ...corsHeaders },
      });

      return newResponse;
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
