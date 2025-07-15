import { clerkClient } from "@clerk/nextjs/server";
import prisma          from "@/lib/client";

async function main() {
  /* 1️⃣  get a live Clerk client instance */
  const client = await clerkClient();            // ←  required in Next.js
    let offset =0;
    const limit = 100;

  while (true) {
    const page = await client.users.getUserList({
      limit: 100,
      offset,
    });
// console.log(page)
    /* 3️⃣  upsert into Prisma */
    for (const u of page.data) {
      await prisma.user.upsert({
        where: { id: u.id },
        create: {
          id:       u.id,
          email:    u.primaryEmailAddress?.emailAddress ?? "",
          name:     u.firstName  ?? "",
          surname:  u.lastName   ?? "",
          avatar:   u.imageUrl ?? "/noAvatar.png",
          username: u.username   ?? "",
          city:     (u.publicMetadata.city    as string) ?? "",
          school:   (u.publicMetadata.school  as string) ?? "",
          work:     (u.publicMetadata.work    as string) ?? "",
          website:  (u.publicMetadata.website as string) ?? "",
        },
        update: {},          // idempotent
      });
    }

    if (page.data.length < limit) break;
    offset += limit;   // fetch next page
  }

  console.log("✔ Back-fill complete");
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
