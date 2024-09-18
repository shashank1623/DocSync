import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import axios from 'axios';
import { FileText, Users, Share2, ChevronLeft, Check, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BACKEND_URL } from '@/config'; // Ensure this points to your backend

interface DocSyncEditorProps {
  onSave?: (docId: string, title: string, content: string) => void;
  onBack?: () => void;
}

export default function DocSyncEditor({ onSave }: DocSyncEditorProps) {
  const { id: paramDocId, accessType: paramAccessType } = useParams<{ id: string; accessType: string }>();
  const [docId, setDocId] = useState(paramDocId || ''); 
  const [title, setTitle] = useState('Untitled Document');
  const [isSaving, setIsSaving] = useState(false);
  const [activeUsers, setActiveUsers] = useState(1);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [accessType, setAccessType] = useState(paramAccessType || "viewer");
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  // Default onBack function: Navigate back to the dashboard if no onBack prop is provided
  const handleBack = () => {
    navigate(-1);
  };

  // Fetch the document by ID and set the title and content in the editor
  useEffect(() => {
    const fetchDocument = async () => {
      if (docId) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/dashboard/documents/${docId}`, {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          });
          const document = response.data;
          setTitle(document.title);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = document.content; // Set content in the Quill editor
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    fetchDocument();
  }, [docId]);

  // Initialize Quill editor and web socket connection
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      });

      quillRef.current = quill;

      const token = localStorage.getItem('token');

      // Correct WebSocket URL with token and accessType
      const wsUrl = `ws://localhost:3001/docs/${docId}?access=${accessType}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        socket.send(JSON.stringify({
          type: "auth",
          token,  // Send the token after the connection opens
        }));
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'edit') {
          if (quillRef.current) {
            quillRef.current.root.innerHTML = message.content;
          }
        } else if (message.type === 'activeUsers') {
          setActiveUsers(message.count);
        }
      };

      setWs(socket);

      const autoSaveInterval = setInterval(() => {
        handleSave();
      }, 5000);

      return () => {
        clearInterval(autoSaveInterval); 
        socket.close(); 
      };
    }
  }, [docId, accessType]);

  const handleSave = async () => {
    if (quillRef.current && docId) {
      setIsSaving(true);
      const content = quillRef.current.root.innerHTML;

      try {
        await axios.put(`${BACKEND_URL}/api/v1/dashboard/documents/${docId}`, {
          title,
          content,
        }, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        if (ws) {
          ws.send(JSON.stringify({ type: 'edit', content }));
        }
      } catch (error) {
        console.error("Error saving document:", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      console.error("docId is missing or Quill is not initialized");
    }
  };

  const handleCopyLink = () => {
    const url = `${BACKEND_URL}/api/v1/dashboard/documents/${docId}?access=${accessType}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <FileText className="h-6 w-6 text-blue-500" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:ring-0"
            onBlur={handleSave}
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>{activeUsers} active</span>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share document</DialogTitle>
                <DialogDescription>
                  Choose access type and share the link.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <RadioGroup value={accessType} onValueChange={setAccessType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="viewer" id="viewer" />
                    <Label htmlFor="viewer">Viewer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="editor" id="editor" />
                    <Label htmlFor="editor">Editor</Label>
                  </div>
                </RadioGroup>
                <div className="flex items-center space-x-2">
                  <Input
                    value={`${BACKEND_URL}/api/v1/dashboard/documents/${docId}?access=${accessType}`}
                    readOnly
                  />
                  <Button onClick={handleCopyLink}>
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex-1 p-4">
        <div ref={editorRef} className="h-full"></div>
      </main>
    </div>
  );
}
