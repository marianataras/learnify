"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { MuxData, Resource, Section } from "@prisma/client"
import Link from "next/link"
import axios from "axios"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ArrowLeft, Loader2 } from "lucide-react"
import MuxPlayer from "@mux/mux-player-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import RichEditor from "../custom/RichEditor"
import FileUpload from "../custom/FileUpload"
import { Switch } from "@/components/ui/switch"
import ResourceForm from "@/components/sections/ResourceForm"
import Delete from "@/components/custom/Delete"
import PublishButton from "@/components/custom/PublishButton"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Назва має містити щонайменше 2 символи"
    }),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
    isFree: z.boolean().optional(),
})

interface EditSectionFormProps {
    section: Section & { resources: Resource[], muxData?: MuxData | null }
    courseId: string
    isCompleted: boolean
}

const EditSectionForm = ({ section, courseId, isCompleted }: EditSectionFormProps) => {
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: section.title,
            description: section.description || "",
            videoUrl: section.videoUrl || "",
            isFree: section.isFree,
        },
    })

    const { isValid, isSubmitting } = form.formState;

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/sections/${section.id}`, values)
            toast.success("Розділ оновлено")
            router.refresh()
        } catch (err) {
            console.log("Розділ не оновлено", err)
            toast.error("Щось пішло не так, спробуйте ще раз")
        }
    }

    return (
        <>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between mb-7">
                <Link href={`/instructor/courses/${courseId}/sections`}>
                    <Button variant="outline" className="text-sm font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Повернутись до змісту
                    </Button>
                </Link>

                <div className="flex gap-4 items-start">
                    <PublishButton
                        disabled={!isCompleted}
                        courseId={courseId}
                        sectionId={section.id}
                        isPublished={section.isPublished}
                        page="Розділ"
                    />
                    <Delete item="розділ" courseId={courseId} sectionId={section.id} />
                </div>
            </div>

            <h1 className="text-xl font-bold">Деталі розділу</h1>
            <p className="text-sm font-medium mt-2">
                Заповніть розділ детальною інформацією, хорошими відео та ресурсами, щоб ваші учні могли зрозуміти тему краще.
            </p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Назва розділу <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Приклад: Вступ до веб-розробки" {...field} />
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
                                    <RichEditor placeholder="Про що цей розділ?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {section.videoUrl && (
                        <div className="my-5 ">
                            <MuxPlayer
                                playbackId={section.muxData?.playbackId || ""}
                                className="md: max-w-[600px]"

                            />
                        </div>
                    )}
                    <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Відео-матеріали <span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <FileUpload
                                        value={field.value || ""}
                                        onChange={(url) => field.onChange(url)}
                                        endpoint="sectionVideo"
                                        page="Edit Section"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isFree"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Доступність</FormLabel>
                                    <FormDescription>
                                        Кожен може отримати доступ до цього розділу БЕЗКОШТОВНО.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className='flex gap-5'>
                        <Link href={`/instructor/courses/${courseId}/sections`}><Button variant="outline" type="button">Скасувати</Button></Link>
                        <Button type="submit" disabled={!isValid || isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Зберегти"}
                        </Button>
                    </div>
                </form>
            </Form>

            <ResourceForm section={section} courseId={courseId} />
        </>
    );
};

export default EditSectionForm;