import prisma from "../config/prisma.js";

const shutdown = async (signal) => {
  console.log(`\nReceive ${signal}, shutting down`);
  try {
    await prisma.$disconnect();
    console.log("Prisma disconnect");
  } catch (err) {
    console.log("Error when disconnect", err);
  }
};

export default shutdown;
