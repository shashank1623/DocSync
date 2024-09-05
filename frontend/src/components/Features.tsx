
import { Users , Share2 , Lock } from "lucide-react"
export const Features = () =>{
    return <div id="features" className=" flex items-center justify-center w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
    <div className="container  px-4 md:px-6">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col items-center space-y-4">
          <Users className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-bold">Real-Time Collaboration</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Work together with your team in real-time, seeing changes as they happen.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Share2 className="h-12 w-12 text-green-500" />
          <h3 className="text-xl font-bold">Easy Sharing</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Share your documents with anyone, anywhere, with just a few clicks.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <Lock className="h-12 w-12 text-red-500" />
          <h3 className="text-xl font-bold">Advanced Security</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Keep your documents safe with our state-of-the-art security measures.
          </p>
        </div>
      </div>
    </div>
  </div>
}