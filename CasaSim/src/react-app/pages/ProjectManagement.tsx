import { useState, useEffect } from "react";
import { Download, Eye } from "lucide-react";
import Header from "@/react-app/components/Header";
import { SidebarNavigation, MenuButton } from "@/react-app/components/SidebarNavigation";

interface Project {
  id: number;
  name: string;
  description: string;
  region: string;
  image_urls: string[];
  created_at: string;
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showImages, setShowImages] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  

  const handleDownloadImages = (project: Project) => {
    // Download all images from the project
    project.image_urls.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name}_imagen_${index + 1}.jpeg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleViewImages = (project: Project) => {
    setSelectedProject(project);
    setShowImages(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <Header title="CasaSim" showLogout={true} />
      
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold text-white mb-6">Gestión de Proyectos</h2>

        {/* Projects List */}
        <div className="space-y-4 mb-8">
          {projects.length === 0 ? (
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 text-center border border-blue-500/30">
              <p className="text-blue-200 mb-4">No hay proyectos disponibles</p>
              <p className="text-blue-200 text-sm">
                Añade un nuevo proyecto manualmente o sube datos históricos para comenzar
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold">{project.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewImages(project)}
                      className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      title="Ver imágenes"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => handleDownloadImages(project)}
                      className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      title="Descargar imágenes"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <p className="text-blue-200 text-sm mb-1">Región: {project.region}</p>
                <p className="text-blue-200 text-sm mb-2">Fecha: {formatDate(project.created_at)}</p>
                <p className="text-gray-300 text-sm">{project.description}</p>
                <div className="mt-3">
                  <span className="inline-block bg-blue-600/30 text-blue-200 px-3 py-1 rounded-full text-xs">
                    {project.image_urls.length} imagen{project.image_urls.length !== 1 ? 'es' : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        
      </div>

      {/* Image Viewer Modal */}
      {showImages && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-blue-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">{selectedProject.name}</h3>
              <button
                onClick={() => setShowImages(false)}
                className="text-gray-400 hover:text-white transition-colors text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedProject.image_urls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`${selectedProject.name} - Imagen ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/60 text-white px-2 py-1 rounded text-xs">
                      {index + 1} de {selectedProject.image_urls.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setShowImages(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => handleDownloadImages(selectedProject)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Todas</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <MenuButton onClick={() => setIsSidebarOpen(true)} />
      <SidebarNavigation 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}
