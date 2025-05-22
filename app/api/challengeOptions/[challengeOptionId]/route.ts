import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { ApiHandler } from "@/app/types";

// Helper function to safely parse ID
const parseId = (id: string): number => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new Error("Invalid ID format");
  }
  return parsedId;
};

export const GET: ApiHandler<{ challengeOptionId: string }> = async (
  _req,
  { params }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  try {
    const id = parseId(params.challengeOptionId);
    
    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, id),
    });

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse("Invalid ID format", { status: 400 });
  }
};

export const PUT: ApiHandler<{ challengeOptionId: string }> = async (
  req,
  { params }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  try {
    const id = parseId(params.challengeOptionId);
    
    const body = (await req.json()) as typeof challengeOptions.$inferSelect;
    const data = await db
      .update(challengeOptions)
      .set({
        ...body,
      })
      .where(eq(challengeOptions.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse("Invalid ID format", { status: 400 });
  }
};

export const DELETE: ApiHandler<{ challengeOptionId: string }> = async (
  _req,
  { params }
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  try {
    const id = parseId(params.challengeOptionId);
    
    const data = await db
      .delete(challengeOptions)
      .where(eq(challengeOptions.id, id))
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    return new NextResponse("Invalid ID format", { status: 400 });
  }
};
