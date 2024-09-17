
import { Button } from "@/components/ui/button"
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useNavigate } from "react-router-dom"

export const NewDoc = () =>{

  const navigate = useNavigate();
  const createNewDocument = async ()=>{

    try{
      const response = await axios.post(`${BACKEND_URL}/api/v1/dashboard/documents`,
        {
          title : "Untitled Document",  // Default title for new documents
          content : "",   //Blank document Initially
        },{
          headers : {
            "Content-Type" : "application/json",
            Authorization : localStorage.getItem("token"),
          }
        }
      );

      const newDocument = response.data;
      //if the response is ok
      // the navigate the user to `/dashboard/document/d/${data.id}/edit;
      navigate(`/dashboard/document/d/${newDocument.id}/edit`);
    }catch(error){
      console.error("Error creating documetn",error)
    }
  }
    return <>
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold mb-4">Start a new document</h2>
          <div className="flex flex-col items-center">
            <Button 
              className="w-40 h-52 flex flex-col items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 ease-in-out"
              onClick={createNewDocument}
            >
              <div className="w-14 h-14 mb-2 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-2 bg-blue-500" />
                  <div className="w-2 h-10 bg-green-500 absolute" />
                </div>
                <div className="absolute top-0 left-0 w-6 h-2 bg-red-500" />
                <div className="absolute bottom-0 right-0 w-6 h-2 bg-yellow-500" />
              </div>
              <span className="text-sm text-gray-900">Blank</span>
            </Button>
            <p className="mt-2 text-sm text-gray-600">Blank document</p>
          </div>
        </div>
    </>
}