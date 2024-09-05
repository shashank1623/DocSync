import { Hero } from "../components/Hero"
import { Appbar } from "../components/Appbar"



export const Home = () =>{
    
    return <div className="flex flex-col min-h-screen">
        <Appbar/>

        <main className="flex-1">
            <Hero/>
        </main>
    </div>
       

}