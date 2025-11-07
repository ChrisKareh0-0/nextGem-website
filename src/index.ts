import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve static images from the public/images folder before the catch-all.
    // This ensures requests like /images/nextgem-logo.png return the PNG
    // with the correct Content-Type instead of falling through to index.html.
    "/images/:path*": async req => {
      try {
        const p = req.params["path*"];
        // Bun.file will set the correct Content-Type for common image types.
        return new Response(Bun.file(`public/images/${p}`));
      } catch (err) {
        return new Response("Not Found", { status: 404 });
      }
    },

    // Serve index.html for all other unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
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
