import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
    req: NextRequest,
    { params }: { params: { courseId: string, sectionId: string } }
) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Користувача не авторизовано", { status: 401 })
        }

        const { courseId, sectionId } = params;

        const course = await db.course.findUnique({
            where: {
                id: courseId,
            }
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

        const muxData = await db.muxData.findUnique({
            where: {
                sectionId,
            }
        })

        if (!section || !muxData || !section.title || !section.description || !section.videoUrl) {
            return new NextResponse("Пропущено обов'язкові поля", {status: 400});
        }

        const publishedSection = await db.section.update({
            where: {
                id: sectionId,
                courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedSection, {status: 200});
    }   catch (err) {
        console.log("[section_publish_POST]", err)
        return new NextResponse("Internal Server Error", {status: 500});
    }
}