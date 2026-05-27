import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        timeEntries: {
          orderBy: { date: "desc" },
        },
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, phase, tag, status, steps, notes } = body;

    if (!title || !description || !phase || !tag) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, phase, tag" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        phase,
        tag,
        status: status || "Not Started",
        steps: typeof steps === "string" ? steps : JSON.stringify(steps || []),
        notes: notes || null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
