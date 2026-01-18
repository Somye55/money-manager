const { PrismaClient } = require("@prisma/client");

// Singleton pattern for Prisma Client in serverless environment
// Prevents multiple instances from being created on each function invocation
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to preserve the instance
  // across hot reloads
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
