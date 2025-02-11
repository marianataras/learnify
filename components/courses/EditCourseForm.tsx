"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Course } from "@prisma/client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import RichEditor from "../custom/RichEditor"
import { ComboBox } from "../custom/ComboBox"
import FileUpload from "../custom/FileUpload"
import Link from "next/link"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"
import Delete from "../custom/Delete"
import PublishButton from "../custom/PublishButton"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Назва має містити щонайменше 2 символи"
    }),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, {
        message: "Категорія обов'язкова"
    }),
    subCategoryId: z.string().min(1, {
        message: "Підкатегорія обов'язкова"
    }),
    levelId: z.string().optional(),
    imageUrl: z.string().optional(),
    price: z.coerce.number().optional(),
})

interface EditCourseFormProps {
    course: Course
    categories: {
        label: string
        value: string
        subCategories: { label: string, value: string }[];
    }[];
    levels: { label: string, value: string }[];
    isCompleted: boolean;
}

const EditCourseForm = ({ course, categories, levels, isCompleted, }: EditCourseFormProps) => {
    const router = useRouter();
    const pathname = usePathname();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: course.title,
            subtitle: course.subtitle || "",
            description: course.description || "",
            categoryId: course.categoryId,
            subCategoryId: course.subCategoryId,
            levelId: course.levelId || "",
            imageUrl: course.imageUrl || "",
            price: course.price || undefined,
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${course.id}`, values)
            toast.success("Курс оновлено")
            router.refresh()
        } catch (err) {
            console.log("Курс не оновлено", err)
            toast.error("Щось пішло не так, спробуйте ще раз")
        }
    }

    const routes = [
        { label: "Загальна інформація", path: `/instructor/courses/${course.id}/basic` },
        { label: "Зміст курсу", path: `/instructor/courses/${course.id}/sections` },
    ]

    return (
        <>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7">
                <div className="flex gap-5">
                    {routes.map((route) => (
                        <Link key={route.path} href={route.path} className="flex gap-4">
                            <Button variant={pathname === route.path ? "default" : "outline"}>{route.label}</Button>
                        </Link>
                    ))}
                </div>

                <div className="flex gap-4 items-start">
                    <PublishButton
                        disabled={!isCompleted}
                        courseId={course.id}
                        isPublished={course.isPublished}
                        page="Курс"
                    />
                    <Delete item="курс" courseId={course.id} />
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Назва курсу <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Приклад: Веб-розробка для початківців" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Підзаголовок курсу</FormLabel>
                                <FormControl>
                                    <Input placeholder="Приклад: Стань веб-розробником за один курс. HTML, CSS, JavaScript, Node, React, MongoDB та багато іншого!" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Опис <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <RichEditor placeholder="Про що цей курс?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-wrap gap-10">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Категорія <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <ComboBox options={categories} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subCategoryId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Підкатегорія <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <ComboBox
                                            options={
                                                categories.find(
                                                    (category) =>
                                                        category.value === form.watch("categoryId")
                                                )?.subCategories || []
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="levelId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Рівень <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <ComboBox options={levels} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Обкладинка курсу <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <FileUpload
                                        value={field.value || ""}
                                        onChange={(url) => field.onChange(url)}
                                        endpoint="courseBanner"
                                        page="Edit Course"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Вартість (грн.) <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="299.99" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex gap-5'>
                        <Link href="/instructor/courses"><Button variant="outline" type="button">Скасувати</Button></Link>
                        <Button type="submit">Зберегти</Button>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default EditCourseForm;