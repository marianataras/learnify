"use client";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast";
import axios from "axios";
import SectionList from "@/components/sections/SectionList";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Назва розділу повинна містити принаймні 2 символи"
    }),
})


const CreateSectionForm = ({ course }: { course: Course & { sections: Section[] } }) => {
    const pathname = usePathname();
    const router = useRouter();
    const routes = [
        {
            label: "Загальна інформація",
            path: `/instructor/courses/${course.id}/basic`
        },
        { label: "Зміст курсу", path: `/instructor/courses/${course.id}/sections` },
    ];

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`/api/courses/${course.id}/sections`, values);
            router.push(`/instructor/courses/${course.id}/sections/${response.data.id}`)
            toast.success("Розділ успішно створено")
        } catch (err) {
            toast.error("Щось пішло не так. Спробуйте ще раз.")
            console.log("Не вдалось створити нового розділу", err)
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            await axios.put(`/api/courses/${course.id}/sections/reorder`, {
                list: updateData
            })
            toast.success("Розділи успішно перевпорядковані")
        } catch (err) {
            toast.error("Щось пішло не так. Спробуйте ще раз.")
            console.log("Не вдалось перевпорядкувати розділи", err)
        }
    }

    return (
        <div className="px-10 py-6">
            <div className="flex gap-5">
                {routes.map((route) => (
                    <Link key={route.path} href={route.path} className="flex gap-4">
                        <Button variant={pathname === route.path ? "default" : "outline"}>{route.label}</Button>
                    </Link>
                ))}
            </div>

            <SectionList
                items={course.sections || []}
                onReorder={onReorder}
                onEdit={(id) => router.push(`/instructor/courses/${course.id}/sections/${id}`)}
            />

            <h1 className="text-xl font-bold mt-5">Додавання нового розділу</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Назва розділу</FormLabel>
                                <FormControl>
                                    <Input placeholder="Приклад: Вступ" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-5">
                        <Link href={`/instructor/courses/${course.id}/basic`}><Button variant="outline" type="button">Скасувати</Button></Link>
                        <Button type="submit">Створити</Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default CreateSectionForm;