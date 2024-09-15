import { DashBoardAppbar } from "@/components/DashBoardAppbar"
import { NewDoc } from "@/components/NewDoc"
import { DocList } from "@/components/DocList"

export const Dashboard = () => {
    
    return <div className="min-h-screen bg-gray-100 dark:bg-gray-900">

        <DashBoardAppbar />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <NewDoc/>

        <DocList/>
      </main>
    </div>
}