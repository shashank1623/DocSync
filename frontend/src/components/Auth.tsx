import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
interface AuthProps {
    type: "signin" | "signup";
}
export default function Auth({ type }: AuthProps) {

    const isSignIn = type === "signin";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <span className="ml-2 text-2xl font-bold">DocSync</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSignIn ? "Sign in to your account" : "Create an account"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSignIn
                            ? "Enter your email below to sign in to your account"
                            : "Enter your details below to create your account"}
                    </CardDescription>

                    <CardContent className="space-y-4">
                        {!isSignIn && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input id="first-name" placeholder="John" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input id="last-name" placeholder="Doe" required />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>

                        <Button className="w-full">
                            {isSignIn ? "Sign In" : "Create Account"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline">
                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline">
                                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                                Facebook
                            </Button>
                        </div>
                    </CardContent>
                </CardHeader>

                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground">
                        {isSignIn ? (
                            <>
                                <span className="mr-1 hidden sm:inline-block">Don&apos;t have an account?</span>
                                <Link to="/signup" className="text-primary underline-offset-4 transition-colors hover:underline">
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <span className="text-center w-full">
                                Already have an account?{" "}
                                <Link to="/signin" className="text-primary underline-offset-4 transition-colors hover:underline">
                                    Sign in
                                </Link>
                            </span>
                        )}
                    </div>

                    {isSignIn && (
                        <Link to="/forgot-password" className="text-sm text-primary underline-offset-4 transition-colors hover:underline">
                            Forgot password?
                        </Link>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}