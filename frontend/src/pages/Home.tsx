import { Hero } from "../components/Hero"
import { Appbar } from "../components/Appbar"
import { Features } from "@/components/Features"
import { Pricing } from "@/components/Pricing"
import { Security } from "@/components/Security"
import { Templates } from "@/components/Templates"
import { Footer } from "@/components/Footer"



export const Home = () =>{
    
    return <div className="flex flex-col min-h-screen">
        <Appbar/>

        <main className="flex-1">
            <Hero/>
            <Features/>
            <Pricing/>
            <Security/>
            <Templates/>
        </main>

        <Footer/>
    </div>
       

}