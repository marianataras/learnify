import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
    req: NextRequest,
    { params }: { params: { courseId: string } }
) => {
    try {
        const { userId } = auth();
        const { courseId } = params;

        if (!userId) {
            return new Response("Користувача не авторизовано", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: { id: courseId, instructorId: userId },
            include: {
                sections: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if (!course) {
            return new Response("Курс не знайдено", { status: 404 });
        }

        const isPublishedSections = course.sections.some((section) => section.isPublished);

        if (
            !course.title ||
            !course.description ||
            !course.categoryId ||
            !course.subCategoryId ||
            !course.levelId ||
            !course.imageUrl ||
            !course.price ||
            !isPublishedSections
        ) {
            return new NextResponse("Пропущено обов'язкові поля", { status: 400 })
        }

        const publishedCourse = await db.course.update({
            where: { id: courseId, instructorId: userId },
            data: { isPublished: true },
        });

        return NextResponse.json(publishedCourse, { status: 200 });

    } catch (err) {
        console.log("[courseId_publish_POST]", err)
        return new Response("Internal Server Error", { status: 500 })
    }
}