import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronDown, HelpCircle, Info } from "lucide-react";
import Header from "@/react-app/components/Header";
import { SidebarNavigation, MenuButton } from "@/react-app/components/SidebarNavigation";
import { constructionSystems } from "@/shared/constructionSystems";

export default function SimulationPage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(250000);
  const [region, setRegion] = useState("Costa");
  const [housingType, setHousingType] = useState("Unifamiliar");
  const [familyCount, setFamilyCount] = useState(5);
  const [wallMaterial, setWallMaterial] = useState("Ladrillo");
  const [constructionSystem, setConstructionSystem] = useState("sip");
  const [showSystemInfo, setShowSystemInfo] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  const regions = ["Costa", "Sierra", "Selva"];
  const housingTypes = ["Unifamiliar", "Multifamiliar", "Departamento", "Casa Rural"];

  const handleSimulation = () => {
    // Get full material data for the selected material
    const selectedMaterial = materials.find(m => m.nombre_material === wallMaterial);
    
    // Store simulation parameters in localStorage for the results page
    localStorage.setItem('simulationParams', JSON.stringify({
      budget,
      region,
      housingType,
      familyCount,
      wallMaterial,
      constructionSystem,
      materialData: selectedMaterial // Include full material data
    }));
    navigate('/simulation-results');
  };

  const selectedSystem = constructionSystems.find(sys => sys.id === constructionSystem);

  // Load materials from API
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await fetch('/api/materials', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setMaterials(data);
          // Set default material to the first one if available
          if (data.length > 0 && !wallMaterial) {
            setWallMaterial(data[0].nombre_material);
          }
        } else {
          console.error('Error loading materials:', response.statusText);
          // Fallback to static list if API fails
          setMaterials([
            { nombre_material: "Ladrillo" },
            { nombre_material: "Adobe" },
            { nombre_material: "Concreto" },
            { nombre_material: "Madera" },
            { nombre_material: "Material Noble" }
          ]);
        }
      } catch (error) {
        console.error('Error fetching materials:', error);
        // Fallback to static list if API fails
        setMaterials([
          { nombre_material: "Ladrillo" },
          { nombre_material: "Adobe" },
          { nombre_material: "Concreto" },
          { nombre_material: "Madera" },
          { nombre_material: "Material Noble" }
        ]);
      } finally {
        setLoadingMaterials(false);
      }
    };

    loadMaterials();
  }, []);

  return (
    <div className="min-h-screen">
      <Header title="Configuración de parámetros" />
      
      <div className="px-6 py-6">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 space-y-6 border border-blue-500/30">
          {/* Budget Slider */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Presupuesto total
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="100000"
                max="500000"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-white font-medium min-w-[100px] text-right">
                S/{budget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Region Selection */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Región
            </label>
            <div className="grid grid-cols-3 gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    region === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-900/30 text-blue-200 hover:bg-blue-800/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Housing Type */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Tipo de vivienda
            </label>
            <div className="relative">
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-blue-500/50 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-400 backdrop-blur-sm"
              >
                {housingTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300 pointer-events-none" />
            </div>
          </div>

          {/* Family Count Slider */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Número de Familias/Unidades
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="20"
                value={familyCount}
                onChange={(e) => setFamilyCount(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-white font-medium min-w-[80px] text-right">
                {familyCount} unidades
              </span>
            </div>
          </div>

          {/* Construction System Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-white text-sm font-medium">
                Sistema Constructivo (MMC)
              </label>
              <button
                onClick={() => setShowSystemInfo(!showSystemInfo)}
                className="p-1 text-blue-300 hover:text-white transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <select
                value={constructionSystem}
                onChange={(e) => setConstructionSystem(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-blue-500/50 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-400 backdrop-blur-sm"
              >
                {constructionSystems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300 pointer-events-none" />
            </div>
            
            {/* System Information Card */}
            {showSystemInfo && selectedSystem && (
              <div className="mt-4 bg-blue-900/30 rounded-lg p-4 border border-blue-500/40">
                <h4 className="text-blue-200 font-medium mb-2">{selectedSystem.nombre}</h4>
                <p className="text-blue-100 text-sm mb-3">{selectedSystem.descripcion}</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-blue-300">Ahorro en Costo:</span>
                    <p className="text-white font-medium">
                      {selectedSystem.id === 'base-tradicional' ? 'Base' : 
                       `${((1 - selectedSystem.costo_factor) * 100).toFixed(0)}%`}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-300">Ahorro en Tiempo:</span>
                    <p className="text-white font-medium">
                      {selectedSystem.id === 'base-tradicional' ? 'Base' : 
                       `${((1 - selectedSystem.tiempo_factor) * 100).toFixed(0)}%`}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-300">Aislamiento:</span>
                    <p className="text-white font-medium">{selectedSystem.aislamiento_termico}</p>
                  </div>
                  <div>
                    <span className="text-blue-300">Huella de Carbono:</span>
                    <p className="text-white font-medium text-xs">{selectedSystem.huella_carbono}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-blue-500/30">
                  <span className="text-green-300 text-sm font-medium">Ventaja clave: </span>
                  <span className="text-green-200 text-sm">{selectedSystem.ventaja_clave}</span>
                </div>
              </div>
            )}
          </div>

          {/* Wall Material */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Material Principal de Muros
            </label>
            <div className="relative">
              {loadingMaterials ? (
                <div className="w-full px-4 py-3 bg-black/40 border border-blue-500/50 rounded-lg text-blue-300 flex items-center">
                  <span className="animate-pulse">Cargando materiales...</span>
                </div>
              ) : (
                <>
                  <select
                    value={wallMaterial}
                    onChange={(e) => setWallMaterial(e.target.value)}
                    className="w-full px-4 py-3 bg-black/40 border border-blue-500/50 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-400 backdrop-blur-sm"
                  >
                    {materials.map((material) => (
                      <option key={material.id || material.nombre_material} value={material.nombre_material}>
                        {material.nombre_material}
                        {material.costo_m2_soles && ` (S/.${material.costo_m2_soles}/m²)`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300 pointer-events-none" />
                </>
              )}
            </div>
            
            {/* Material Info */}
            {!loadingMaterials && wallMaterial && (
              (() => {
                const selectedMaterial = materials.find(m => m.nombre_material === wallMaterial);
                if (selectedMaterial && selectedMaterial.costo_m2_soles) {
                  return (
                    <div className="mt-3 bg-blue-900/30 rounded-lg p-3 border border-blue-500/40">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-blue-300">Costo por m²:</span>
                          <p className="text-white font-medium">S/.{selectedMaterial.costo_m2_soles}</p>
                        </div>
                        <div>
                          <span className="text-blue-300">Impacto CO2:</span>
                          <p className="text-white font-medium">{selectedMaterial.impacto_co2_texto}</p>
                        </div>
                        {selectedMaterial.ahorro_energia_pct > 0 && (
                          <div>
                            <span className="text-blue-300">Ahorro Energético:</span>
                            <p className="text-green-300 font-medium">{selectedMaterial.ahorro_energia_pct}%</p>
                          </div>
                        )}
                        {selectedMaterial.reduccion_hit_pct > 0 && (
                          <div>
                            <span className="text-blue-300">Reducción Térmica:</span>
                            <p className="text-green-300 font-medium">{selectedMaterial.reduccion_hit_pct}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })()
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <button
            onClick={handleSimulation}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ver Simulación
          </button>
          
          <button
            onClick={() => navigate('/chat')}
            className="w-full py-4 bg-blue-200 text-blue-900 rounded-lg font-medium hover:bg-blue-300 transition-colors flex items-center justify-center space-x-2"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Preguntar a IA / Asistente Gemini</span>
          </button>
        </div>
      </div>

      <MenuButton onClick={() => setIsSidebarOpen(true)} />
      <SidebarNavigation 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}
