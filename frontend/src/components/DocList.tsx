import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '@/config'; // Ensure this points to your backend
import { Button } from '@/components/ui/button';
import { Grid, List, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SkeltonLoader } from './SkeltonLoader'; // Import the SkeletonLoader component

interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export const DocList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Default to grid view
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const navigate = useNavigate();

  // Fetch documents on component load
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/dashboard/documents`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchDocuments();
  }, []);

  // Function to handle opening a specific document
  const handleOpenDocument = (docId: string) => {
    navigate(`/dashboard/document/d/${docId}/edit`);
  };

  const handleDocumentDelete = async (e: React.MouseEvent ,docId : string) =>{
    e.stopPropagation(); // Prevent event propagation to the parent div
    if (window.confirm('Are you sure you want to delete this document?')) { // Confirm deletion
      try {
        await axios.delete(`${BACKEND_URL}/api/v1/dashboard/documents/${docId}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        // After successful deletion, remove the document from the local state
        setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.id !== docId));
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        <div className="flex items-center space-x-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-1'}`}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeltonLoader key={index} />
            )) // Render skeleton loaders
          : documents.map((document) => (
              <div
                key={document.id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                onClick={() => handleOpenDocument(document.id)} // Navigate to document editor on click
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">
                    {document.title || 'Untitled Document'} {/* Handle untitled documents */}
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" >
                      <DropdownMenuItem onClick={() => handleOpenDocument(document.id)}>Open</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e)=> handleDocumentDelete(e,document.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-gray-500">{new Date(document.updatedAt).toLocaleString()}</p>
              </div>
            ))}
      </div>
    </div>
  );
};
