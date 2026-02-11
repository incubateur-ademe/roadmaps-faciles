postdeploy: echo "====== PRISMA MIGRATE DEPLOY ======" && pnpm install && pnpm prisma migrate deploy && rm -rf node_modules && pnpm install --prod && echo "====== PRISMA MIGRATE DEPLOY FINISH ======"
