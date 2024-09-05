import { Hero } from "../components/Hero"
import { Appbar } from "../components/Appbar"
import { Features } from "@/components/Features"
import { Pricing } from "@/components/Pricing"



export const Home = () =>{
    
    return <div className="flex flex-col min-h-screen">
        <Appbar/>

        <main className="flex-1">
            <Hero/>
            <Features/>
            <Pricing/>
        </main>
    </div>
       

}