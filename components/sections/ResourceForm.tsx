"use client";
import { Resource, Section } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FileUpload from "@/components/custom/FileUpload";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Назва повинна містити принаймні 2 символи"
    }),
    fileUrl: z.string().min(1, {
        message: "Виберіть файл",
    }),
})

interface ResourceFormProps {
    section: Section & { resources: Resource[] }
    courseId: string
}

const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
    const router = useRouter();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            fileUrl: "",
        },
    })

    const { isValid, isSubmitting } = form.formState;

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/sections/${section.id}/resources`, values);
            toast.success("Матеріал успішно додано")
            form.reset();
            router.refresh();
        } catch (err) {
            toast.error("Щось пішло не так. Спробуйте ще раз.")
            console.log("Не вдалось додати матеріал", err)
        }
    }

    const onDelete = async (id: string) => {
        try {
            await axios.post(`/api/courses/${courseId}/sections/${section.id}/resources/${id}`);
            toast.success("Матеріал видалено!")
            router.refresh();
        } catch (err) {
            toast.error("Щось пішло не так. Спробуйте ще раз.")
            console.log("Не вдалось видалити матеріал", err)
        }
    }

    return (
        <>
            <div className="flex gap-2 items-center text-xl font-bold mt-12">
                <PlusCircle />
                Додати матеріали (рекомендовано)
            </div>

            <p className="text-sm font-medium mt-2">
                Додайте матеріали для цього розділу
            </p>

            <div className="mt-5 flex flex-col gap-5">
                {section.resources.map((resource) => (
                    <div className="flex justify-between bg-[#FFF8EB] rounded-lg text-sm font-medium p-3">
                        <div className="flex items-center">
                            <File className="h-4 w-4 mr-4" />
                            {resource.name}
                        </div>
                        <button className="text-[#1E5B4F]" disabled={isSubmitting}
                            onClick={() => onDelete(resource.id)}
                        >
                            {isSubmitting ? (<Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <X className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                ))}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Назва файлу</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Приклад: Посібник" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fileUrl"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Завантажені файли</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            value={field.value || ""}
                                            onChange={(url) => field.onChange(url)}
                                            endpoint="sectionResource"
                                            page="Edit Section"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={!isValid || isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Завантажити"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default ResourceForm;