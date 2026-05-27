import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { taskId, hours, date, weekStart, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (taskId !== undefined) updateData.taskId = taskId;
    if (hours !== undefined) updateData.hours = parseFloat(hours);
    if (date !== undefined) updateData.date = new Date(date);
    if (weekStart !== undefined) updateData.weekStart = new Date(weekStart);
    if (notes !== undefined) updateData.notes = notes || null;

    const entry = await prisma.timeEntry.update({
      where: { id: params.id },
      data: updateData,
      include: {
        task: { select: { id: true, title: true, tag: true } },
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("PUT /api/time-entries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update time entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.timeEntry.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/time-entries/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete time entry" },
      { status: 500 }
    );
  }
}
