import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const InstructorLayout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth()

    if (!userId) {
        return redirect("/sign-in")
    }

    return (
        <div className="h-full flex flex-col">
            <Topbar />
            <div className="flex-1 flex">
                <Sidebar />
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default InstructorLayout