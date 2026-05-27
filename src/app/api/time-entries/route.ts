import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const weekStart = searchParams.get("weekStart");
    const taskId = searchParams.get("taskId");

    const where: Record<string, unknown> = {};

    if (weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      where.weekStart = { gte: start, lt: end };
    }

    if (taskId) {
      where.taskId = taskId;
    }

    const entries = await prisma.timeEntry.findMany({
      where,
      orderBy: { date: "asc" },
      include: {
        task: {
          select: { id: true, title: true, tag: true },
        },
      },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET /api/time-entries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch time entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskId, hours, date, weekStart, notes } = body;

    if (!taskId || hours === undefined || !date || !weekStart) {
      return NextResponse.json(
        { error: "Missing required fields: taskId, hours, date, weekStart" },
        { status: 400 }
      );
    }

    const entry = await prisma.timeEntry.create({
      data: {
        taskId,
        hours: parseFloat(hours),
        date: new Date(date),
        weekStart: new Date(weekStart),
        notes: notes || null,
      },
      include: {
        task: { select: { id: true, title: true, tag: true } },
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/time-entries error:", error);
    return NextResponse.json(
      { error: "Failed to create time entry" },
      { status: 500 }
    );
  }
}
