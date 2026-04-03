import { prisma } from "../lib/prisma";

async function main() {
  console.log("Updating trending scores...");

  await prisma.$executeRaw`
    UPDATE post p
    SET "score" = sub.score,
        "scoreUpdatedAt" = NOW()
    FROM (
      SELECT 
        p.id,
        COALESCE(
          SUM(1.0 / (EXTRACT(EPOCH FROM (NOW() - l."createdAt")) / 3600 + 1)),
          0
        ) AS score
      FROM post p
      LEFT JOIN like l 
        ON l."artPostId" = p.id
        AND l."createdAt" > NOW() - INTERVAL '7 days'
      GROUP BY p.id
    ) sub
    WHERE p.id = sub.id
  `;

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
