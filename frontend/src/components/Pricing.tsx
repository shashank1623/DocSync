import { Card, CardHeader , CardTitle , CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Check } from "lucide-react"
export const Pricing = () => {

    return <div id="pricing" className="w-full py-12 md:py-24 lg:py-32 px-4 sm:px-6">
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Pricing Plans</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: "Basic", price: "$9.99", features: ["5 GB Storage", "Up to 3 users", "Basic support"] },
          { name: "Pro", price: "$19.99", features: ["50 GB Storage", "Up to 10 users", "Priority support"] },
          { name: "Enterprise", price: "Custom", features: ["Unlimited Storage", "Unlimited users", "24/7 support"] },
        ].map((plan) => (
          <Card key={plan.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-3xl font-bold">{plan.price}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
              <ul className="mt-4 space-y-2 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full">Choose Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>

}