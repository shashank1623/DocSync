
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { FileText, MoreVertical, Grid, List } from "lucide-react"
export const DocList = () =>{

    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const userDocuments = [
        { id: 1, title: "Project Proposal", lastModified: "2023-06-15T10:30:00Z", thumbnail: "/placeholder.svg?height=200&width=150" },
        { id: 2, title: "Meeting Notes", lastModified: "2023-06-14T15:45:00Z", thumbnail: "/placeholder.svg?height=200&width=150" },
        { id: 3, title: "Budget Report", lastModified: "2023-06-13T09:00:00Z", thumbnail: "/placeholder.svg?height=200&width=150" },
        { id: 4, title: "Marketing Strategy", lastModified: "2023-06-12T14:20:00Z", thumbnail: "/placeholder.svg?height=200&width=150" },
        { id: 5, title: "Product Roadmap", lastModified: "2023-06-11T11:00:00Z", thumbnail: "/placeholder.svg?height=200&width=150" },
    ]

    return <>
        <div className="mt-8 px-4 sm:px-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Recent documents</h2>
            <div className="flex items-center space-x-4">
              <Select defaultValue="anyone">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Owned by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anyone">Owned by anyone</SelectItem>
                  <SelectItem value="me">Owned by me</SelectItem>
                  <SelectItem value="others">Not owned by me</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {viewMode === "grid" ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {userDocuments.map((doc) => (
                <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
                  <div className="aspect-w-3 aspect-h-2">
                    <img src={doc.thumbnail} alt={doc.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Open</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>Opened {doc.lastModified}</span>
                      {doc.shared && <Users className="h-4 w-4 ml-2" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {userDocuments.map((doc) => (
                  <li key={doc.id}>
                    <div className="px-4 py-4 flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <FileText className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                        <div className="flex items-center min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.title}</p>
                          {doc.shared && <Users className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mr-4">me</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mr-4">{doc.lastModified}</p>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Open</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
    </>
}