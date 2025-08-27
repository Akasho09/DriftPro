"use server";

import aksh from "@repo/db/client";

export default async function getContacts() {
  try {
    const users = await aksh.user.findMany({
      select: {
        id: true,
        name: true,
        mobile: true
      },
    orderBy: {
        name: "asc", // ✅ sort alphabetically by name
      },
    });

    return users;
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return [];
  }
}
