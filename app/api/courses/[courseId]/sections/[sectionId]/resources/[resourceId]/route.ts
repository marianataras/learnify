import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string, resourceId: string } }
) => {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Користувача не авторизовано", { status: 401 });
    }

    const { courseId, sectionId, resourceId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Курс не знайдено", { status: 404 });
    }

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Розділ не знайдено", { status: 404 });
    }

    await db.resource.delete({
      where: {
        id: resourceId,
        sectionId,
      },
    });
    
    return NextResponse.json("Матеріал видалено", { status: 200 });
  } catch (err) {
    console.log("[resourceId_DELETE", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};