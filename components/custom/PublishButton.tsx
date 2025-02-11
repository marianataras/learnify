"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { on } from "events"

interface PublishButtonProps {
    disabled: boolean
    courseId: string
    sectionId?: string
    isPublished: boolean
    page: string
}

const PublishButton = ({
    disabled,
    courseId,
    sectionId,
    isPublished,
    page,
}: PublishButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        let url = `/api/courses/${courseId}`
        if (page === "Розділ") {
            url += `/sections/${sectionId}`
        }

        try {
            setIsLoading(true)
            isPublished
                ? await axios.post(`${url}/unpublish`)
                : await axios.post(`${url}/publish`)

            toast.success(`${page} ${isPublished ? "знято з публікації" : "опубліковано"}`);
            router.refresh();
        } catch (err) {
            toast.error("Щось пішло не так!")
            console.log(`Не вдалося ${isPublished ? "опублікувати" : "зняти з публікації"} ${page}`, err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button variant="outline" disabled={disabled || isLoading} onClick={onClick}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPublished ? "Скасувати публікацію" : "Опублікувати"}
        </Button>
    )
}

export default PublishButton