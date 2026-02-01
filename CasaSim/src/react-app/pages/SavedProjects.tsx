import { useState, useEffect } from "react";
import { Check, Download, Trash2 } from "lucide-react";
import Header from "@/react-app/components/Header";
import { SidebarNavigation, MenuButton } from "@/react-app/components/SidebarNavigation";

interface SavedProject {
  id: string;
  name: string;
  region: string;
  date: string;
  params: any;
  results: any;
}

export default function SavedProjectsPage() {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Load saved projects from localStorage
    const projects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    setSavedProjects(projects);
  }, []);

  const toggleProjectSelection = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleDownloadReport = async () => {
    if (selectedProjects.size === 0) {
      alert('Por favor selecciona al menos un proyecto para descargar');
      return;
    }

    try {
      const selectedProjectsList = savedProjects.filter(p => selectedProjects.has(p.id));
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: selectedProjectsList }),
        credentials: 'include'
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `reporte-proyectos-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert(`Reporte PDF descargado exitosamente para ${selectedProjects.size} proyecto(s)`);
      } else {
        const error = await response.json();
        alert(`Error al generar el PDF: ${error.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el reporte PDF. Por favor intenta de nuevo.');
    }
  };

  const handleDeleteProjects = () => {
    if (selectedProjects.size === 0) {
      alert('Por favor selecciona al menos un proyecto para eliminar');
      return;
    }

    const confirmed = confirm(`¿Estás seguro de que deseas eliminar ${selectedProjects.size} proyecto(s)? Esta acción no se puede deshacer.`);
    if (confirmed) {
      const updatedProjects = savedProjects.filter(p => !selectedProjects.has(p.id));
      setSavedProjects(updatedProjects);
      localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
      setSelectedProjects(new Set());
      alert(`${selectedProjects.size} proyecto(s) eliminado(s) exitosamente`);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="CasaSim" showClose={true} />
      
      <div className="px-6 py-6">
        <h2 className="text-2xl font-bold text-white mb-6">Proyectos Guardados</h2>

        {/* Projects List */}
        <div className="space-y-4 mb-8">
          {savedProjects.length === 0 ? (
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 text-center border border-blue-500/30">
              <p className="text-blue-200 mb-4">No hay proyectos guardados</p>
              <p className="text-blue-200 text-sm">
                Guarda un escenario desde la simulación para verlo aquí
              </p>
            </div>
          ) : (
            savedProjects.map((project) => (
              <div key={project.id} className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">{project.name}</h3>
                    <p className="text-blue-200 text-sm mb-1">
                      Región: {project.region} | Fecha: {project.date}
                    </p>
                    <p className="text-blue-200 text-sm">
                      {project.results?.familyCount} familias | S/{project.results?.totalCost?.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleProjectSelection(project.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      selectedProjects.has(project.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'
                    }`}
                  >
                    {selectedProjects.has(project.id) && <Check className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadReport}
            disabled={selectedProjects.size === 0}
            className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Descargar PDF</span>
          </button>
          
          <button
            onClick={handleDeleteProjects}
            disabled={selectedProjects.size === 0}
            className="flex-1 py-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Eliminar</span>
          </button>
        </div>

        {selectedProjects.size > 0 && (
          <p className="text-center text-blue-200 text-sm mt-2">
            {selectedProjects.size} proyecto(s) seleccionado(s)
          </p>
        )}
      </div>

      <MenuButton onClick={() => setIsSidebarOpen(true)} />
      <SidebarNavigation 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}
