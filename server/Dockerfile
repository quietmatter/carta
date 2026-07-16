# CARTA sync server — zero dependencies, so the image is just Node + one file.
FROM node:22-alpine

# Non-root for safety; own the data dir so the volume mount is writable.
WORKDIR /app
COPY package.json server.js test.js ./

ENV NODE_ENV=production \
    PORT=8787 \
    CARTA_DATA=/data

RUN mkdir -p /data && chown -R node:node /data /app
USER node

EXPOSE 8787
VOLUME ["/data"]

# Liveness: hit the unauthenticated /health endpoint.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||8787)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
