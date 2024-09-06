

export const Security = () =>{
    return <div id="security" className="w-full py-12 md:py-24 lg:py-32 bg-gray-300 dark:bg-gray-800 px-4 sm:px-6">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Security First</h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">End-to-End Encryption</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Your documents are encrypted from the moment you create them until they reach the recipient.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Two-Factor Authentication</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Add an extra layer of security to your account with our two-factor authentication feature.
          </p>
        </div>
      </div>
    </div>
  </div>
}