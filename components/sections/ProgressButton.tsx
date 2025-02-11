"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface ProgressButtonProps {
  courseId: string;
  sectionId: string;
  isCompleted: boolean;
}

const ProgressButton = ({
  courseId,
  sectionId,
  isCompleted,
}: ProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/sections/${sectionId}/progress`, {
        isCompleted: !isCompleted,
      });
      toast.success("Прогрес оновлено!");
      router.refresh();
    } catch (err) {
      console.log("Не вийшло оновити прогрес", err);
      toast.error("Щось пішло не так...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant={isCompleted ? "complete" : "default"} onClick={onClick}>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isCompleted ? (
        <div className="flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>Completed</span>
        </div>
      ) : (
        "Позначити як завершене"
      )}
    </Button>
  );
};

export default ProgressButton;