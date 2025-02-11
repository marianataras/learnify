import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import axios from "axios";
  import { Loader2, Trash } from "lucide-react";
  import { useRouter } from "next/navigation";
  import { useState } from "react";
  import toast from "react-hot-toast";
  import { Button } from "../ui/button";
  
  interface DeleteProps {
    item: string;
    courseId: string;
    sectionId?: string;
  }
  
  const Delete = ({ item, courseId, sectionId }: DeleteProps) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
  
    const onDelete = async () => {
      try {
        setIsDeleting(true);
        const url =
          item === "курс"
            ? `/api/courses/${courseId}`
            : `/api/courses/${courseId}/sections/${sectionId}`;
        await axios.delete(url);
  
        setIsDeleting(false);
        const pushedUrl =
          item === "курс"
            ? "/instructor/courses"
            : `/instructor/courses/${courseId}/sections`;
        router.push(pushedUrl);
        router.refresh();
        toast.success(`${item} видалено`);
      } catch (err) {
        toast.error(`Щось пішло не так...`);
        console.log(`Не вдалось видалити ${item}`, err);
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">
              Ви впевнені?
            </AlertDialogTitle>
            <AlertDialogDescription>
            Цю дію неможливо скасувати. Ви назавжди видалите цей {item}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction className="bg-[#1E5B4F]" onClick={onDelete}>Видалити</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default Delete;