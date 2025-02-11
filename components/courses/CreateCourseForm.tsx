"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ComboBox } from "@/components/custom/ComboBox";
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"


const formSchema = z.object({
    title: z.string().min(2, {
        message: "Назва має містити щонайменше 2 символи"
    }),
    categoryId: z.string().min(1, {
        message: "Категорія обов'язкова"
    }),
    subCategoryId: z.string().min(1, {
        message: "Підкатегорія обов'язкова"
    })
})

interface CreateCourseFormProps {
    categories: {
        label: string
        value: string
        subCategories: { label: string, value: string }[];
    }[];
}

const CreateCourseForm = ({ categories }: CreateCourseFormProps) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            categoryId: "",
            subCategoryId: ""
        },
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values)
            router.push(`/instructor/courses/${response.data.id}/basic`)
            toast.success("Новий курс успішно створено")
        } catch (err) {
            console.log("Новий курс не створено", err)
            toast.error("Щось пішло не так, спробуйте ще раз")
        }
    }


    return (
        <div className="p-10">
            <h1 className="text-xl font-bold">Розкажіть про базові аспекти вашого курсу</h1>
            <p className="text-sm mt-3">Це нормально, якщо ви не можете придумати хорошу назву чи категорію. Ти зможеш змінити їх пізніше.</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Назва курсу</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Приклад: Веб-розробка для початківців"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Категорія</FormLabel>
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
                                <FormLabel>Підкатегорія</FormLabel>
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

                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            "Створити"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateCourseForm