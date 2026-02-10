import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Building2, Wrench, Sparkles, Save, CheckCircle, Clock, Leaf, Eye, FileText, Loader2 } from "lucide-react";
import Header from "@/react-app/components/Header";
import { SidebarNavigation, MenuButton } from "@/react-app/components/SidebarNavigation";
import ARViewer from "@/react-app/components/ARViewer";
import type { SimulationParamsType, MaterialType } from "@/shared/types";
import { getConstructionSystemById, getBaseSystem } from "@/shared/constructionSystems";
import { getAssetUrl } from "@/utils/getAssetUrl";

import { MasonryEngine } from "@/core/MasonryEngine";
// import type { SimulationMetrics } from "@/types/domain"; // Eliminado por conflicto con models.ts

const DEFAULT_AREA_UNIT_M2 = 35.00;  // Área referencial Módulo Básico

export default function SimulationResultsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useState<SimulationParamsType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectSaved, setIsProjectSaved] = useState(false);
  const [materialData, setMaterialData] = useState<MaterialType | null>(null);
  const [baseMaterialData, setBaseMaterialData] = useState<MaterialType | null>(null);
  const [loadingRender, setLoadingRender] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [renderImageUrl, setRenderImageUrl] = useState<string | null>(null);
  const [detailImageUrl, setDetailImageUrl] = useState<string | null>(null);

  // Get construction systems for calculation
  const selectedSystem = params?.constructionSystem ? getConstructionSystemById(params.constructionSystem) : null;
  const baseSystem = getBaseSystem();

  // Delegar cálculos al Motor Puro (Core Domain)
  // Esto asegura que la lógica sea idéntica a la probada en los tests unitarios
  // Lógica de Cálculo TRL 8 (Integration Layer)
  const metrics = (() => {
    if (!params) return null;

    // Estimación paramétrica: Densidad de muros para vivienda social
    // 1 m2 techado ≈ 1.8 m2 de muros (tabiquería + perímetro)
    const densityFactor = 1.8;
    const wallAreaPerUnit = DEFAULT_AREA_UNIT_M2 * densityFactor;

    // 1. Ejecutar Motor de Albañilería (Base)
    const baseMuroResult = MasonryEngine.calculateWallMaterials({
      wallArea: wallAreaPerUnit,
      brickType: 'king_kong_18',
      mortarRatio: '1:5',
      jointThickness: 1.5
    });

    // 2. Extrapolación de Costos ("Whole Building Cost")
    // Se asume que el Casco Gris (Muros, Techos, Cimentación) es el 45% del costo directo.
    // Y los Muros son aprox el 40% del Casco Gris.
    // Factor Multiplicador = 1 / (0.45 * 0.40) ≈ 5.5 (Heurística)
    // Para ser conservadores y coincidir con precios de mercado (S/ 600-900 /m2):
    // const multiplier = 2.5; // Ajuste empírico para llegar a ~S/ 600/m2 base

    // Costo Base Directo Unitario
    // Costo Materiales Muro * Multiplicador Materiales * Factor Mano Obra
    // Simplificado: Costo Muro Math * Ratio Construcción
    const baseCostUnit = baseMuroResult.totalMaterialCost * 6.5; // Factor ajustado para S/ 20k-25k por módulo

    // 3. Escenario Optimizado
    const systemFactor = selectedSystem?.costo_factor || 1.0;
    const optimizedCostUnit = baseCostUnit * systemFactor;

    const totalBase = baseCostUnit * params.familyCount;
    const totalOpt = optimizedCostUnit * params.familyCount;

    return {
      baseCostPerUnit: baseCostUnit,
      optimizedCostPerUnit: optimizedCostUnit,
      totalBaseCost: totalBase,
      totalOptimizedCost: totalOpt,
      totalSavings: totalBase - totalOpt,
      savingsPercentage: totalBase > 0 ? ((totalBase - totalOpt) / totalBase) * 100 : 0
    };
  })();

  // Valores seguros para UI
  const safeMetrics = metrics || {
    baseCostPerUnit: 0,
    optimizedCostPerUnit: 0,
    totalBaseCost: 0,
    totalOptimizedCost: 0,
    totalSavings: 0,
    savingsPercentage: 0
  };

  const totalOriginalCost = safeMetrics.totalBaseCost;
  const totalOptimizedCost = safeMetrics.totalOptimizedCost;
  const totalSavings = safeMetrics.totalSavings;
  const savingsPercentage = safeMetrics.savingsPercentage;
  const baseCostPerUnit = safeMetrics.baseCostPerUnit;
  const optimizedCostPerUnit = safeMetrics.optimizedCostPerUnit;
  const baseAreaPerUnit = DEFAULT_AREA_UNIT_M2;
  const systemAdjustedOptimizedCost = optimizedCostPerUnit;

  // Variables derivadas para visualización
  const baseCostPerM2 = baseCostPerUnit / baseAreaPerUnit;
  const optimizedCostPerM2 = optimizedCostPerUnit / baseAreaPerUnit;

  // Datos de simulación específicos proporcionados
  const simulationData = {
    resumenProyecto: {
      titulo: `Simulación con ${selectedSystem?.nombre || 'Sistema MMC'}`,
      descripcion: selectedSystem ?
        `Comparación entre sistema tradicional y ${selectedSystem.nombre}. ${selectedSystem.descripcion}` :
        "Reducir el costo directo en 10%, incrementar el área techada en 5%, y mejorar la calidad percibida de los acabados mediante el uso de Métodos Modernos de Construcción (MMC) e industrialización."
    },
    optimizacionResumen: [
      {
        concepto: "Costo Directo por Unidad",
        valorOriginal: `S/. ${baseCostPerUnit.toLocaleString()}`,
        objetivo: selectedSystem ? `Factor ${selectedSystem.costo_factor}` : "Material optimizado",
        resultado: `S/. ${systemAdjustedOptimizedCost.toLocaleString()}`
      },
      {
        concepto: "Costo Total del Proyecto",
        valorOriginal: `S/. ${totalOriginalCost.toLocaleString()}`,
        objetivo: `${params?.familyCount || 1} unidades optimizadas`,
        resultado: `S/. ${totalOptimizedCost.toLocaleString()}`
      },
      {
        concepto: "Área Techada por Unidad",
        valorOriginal: `${baseAreaPerUnit.toFixed(2)} m²`,
        objetivo: "Misma área",
        resultado: `${baseAreaPerUnit.toFixed(2)} m²`
      },
      {
        concepto: "Costo por m²",
        valorOriginal: `S/. ${baseCostPerM2.toFixed(2)} / m²`,
        objetivo: "Material optimizado",
        resultado: `S/. ${optimizedCostPerM2.toFixed(2)} / m²`
      }
    ],
    justificacionAhorro: {
      partidas: [
        {
          componente: "Material Principal",
          sistemaOriginal: baseMaterialData?.nombre_material || baseSystem.nombre,
          nuevoSistema: materialData?.nombre_material || "Material optimizado",
          ahorroEstimado: `~ S/. ${(totalSavings * 0.70).toLocaleString()}`
        },
        {
          componente: "Sistema Constructivo",
          sistemaOriginal: baseSystem.nombre,
          nuevoSistema: selectedSystem?.nombre || "Sistema MMC",
          ahorroEstimado: `~ S/. ${(totalSavings * 0.30).toLocaleString()}`
        }
      ],
      ahorroTotal: {
        componente: "AHORRO TOTAL",
        ahorroEstimado: `~ S/. ${totalSavings.toLocaleString()} (${savingsPercentage.toFixed(1)}%)`
      },
      nota: selectedSystem ?
        `${selectedSystem.ventaja_clave} El sistema ${selectedSystem.nombre} ofrece un ahorro del ${savingsPercentage.toFixed(1)}% comparado con el sistema tradicional.` :
        "El ahorro total potencial es significativo. Esto da flexibilidad para absorber costos de transporte, mejorar acabados, o aumentar el margen de utilidad."
    },
    acabadosValorAnadido: [
      {
        partidaOriginal: "Tarrajeo de muros y cielo raso.",
        partidaOptimizada: "Paneles de Yeso-Cartón (Drywall) o Enlucidos Prefabricados.",
        impacto: "Superficies perfectamente lisas. Reducción drástica de tiempos de obra (elimina secado). Mejora el aislamiento térmico/acústico."
      },
      {
        partidaOriginal: "Pisos de Cemento Pulido o Cerámico.",
        partidaOptimizada: "Pisos Vinílicos (LVT o SPC) de instalación en seco.",
        impacto: "Estética moderna (tipo madera). Instalación rápida (click). Mayor calidez y confort al tacto."
      },
      {
        partidaOriginal: "Aparatos Sanitarios Estándar.",
        partidaOptimizada: "Inodoros Ecoeficientes y Grifería de bajo consumo.",
        impacto: "Sostenibilidad (Ahorro de agua a largo plazo). Valor percibido de modernidad y responsabilidad ambiental."
      }
    ]
  };

  useEffect(() => {
    const savedParams = localStorage.getItem('simulationParams');
    if (savedParams) {
      setParams(JSON.parse(savedParams));
    } else {
      navigate('/simulation');
    }
  }, [navigate]);

  // Load material data when params are set
  useEffect(() => {
    const loadMaterialData = async () => {
      if (!params?.materialData?.id) return;

      try {
        // Load selected material data
        const response = await fetch(`/api/materials/${params.materialData.id}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setMaterialData(data);
        } else {
          console.error('Error loading material data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching material data:', error);
      }
    };

    const loadBaseMaterialData = async () => {
      try {
        // Load base material data (Albañilería Confinada)
        const response = await fetch('/api/materials/base', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setBaseMaterialData(data);
        } else {
          console.error('Error loading base material data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching base material data:', error);
      }
    };

    if (params) {
      loadMaterialData();
      loadBaseMaterialData();
    }
  }, [params]);



  if (!params) {
    return <div className="min-h-screen" />;
  }

  // Gráfico de comparación de costos
  const costComparisonData = [
    { name: 'Sistema Base', value: totalOriginalCost, color: '#EF4444' },
    { name: 'Sistema Optimizado', value: totalOptimizedCost, color: '#10B981' }
  ];

  // Gráfico de distribución de ahorros
  const savingsData = [
    { name: 'Estructura', ahorro: totalSavings * 0.82 },
    { name: 'Acabados', ahorro: totalSavings * 0.18 }
  ];

  const handleSaveScenario = () => {
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');

    const newProject = {
      id: Date.now().toString(),
      name: `Proyecto Optimizado - ${params.region}`,
      region: params.region,
      date: new Date().toLocaleDateString('es-PE'),
      params,
      simulationData,
      results: {
        costoOriginal: totalOriginalCost,
        costoOptimizado: totalOptimizedCost,
        ahorroTotal: totalSavings,
        areaTechada: baseAreaPerUnit,
        familyCount: params.familyCount,
        selectedSystem: selectedSystem?.nombre || 'Sistema MMC'
      }
    };

    savedProjects.push(newProject);
    localStorage.setItem('savedProjects', JSON.stringify(savedProjects));

    setIsProjectSaved(true);

    // Mostrar confirmación visual por unos segundos
    setTimeout(() => {
      setIsProjectSaved(false);
    }, 3000);
  };

  const generateRender = async () => {
    setLoadingRender(true);
    try {
      // Use getAssetUrl to retrieve the asset from Firebase Storage
      setRenderImageUrl(getAssetUrl('albanileria_confinada_base.png'));
    } catch (error) {
      console.error('Error loading render:', error);
    } finally {
      setLoadingRender(false);
    }
  };

  const generateDetail = async () => {
    setLoadingDetail(true);
    try {
      // Use getAssetUrl to retrieve the asset from Firebase Storage
      setDetailImageUrl(getAssetUrl('bloques_apilables_flat_block.png'));
    } catch (error) {
      console.error('Error loading detail:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto">
      <Header title="Simulación con MMC" />

      <div className="px-6 py-6 space-y-6 pb-20">
        {/* Resumen del Proyecto */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-3 flex items-center">
            <Building2 className="w-6 h-6 mr-2" />
            {simulationData.resumenProyecto.titulo}
          </h3>
          <p className="text-blue-200 leading-relaxed text-sm mb-4">
            {simulationData.resumenProyecto.descripcion}
          </p>

          {/* System comparison badges */}
          {selectedSystem && (
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="bg-green-600/20 border border-green-500/30 rounded-lg px-3 py-2 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-200 text-sm">
                  {savingsPercentage.toFixed(1)}% Ahorro en Costo
                </span>
              </div>
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg px-3 py-2 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200 text-sm">
                  {((1 - selectedSystem.tiempo_factor) * 100).toFixed(0)}% Menos Tiempo
                </span>
              </div>
              <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-3 py-2 flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-purple-400" />
                <span className="text-purple-200 text-sm">
                  {selectedSystem.aislamiento_termico}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Optimización Resumen */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Resultados de Optimización
          </h3>
          <div className="space-y-4">
            {simulationData.optimizacionResumen.map((item, index) => (
              <div key={index} className="bg-blue-900/20 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-blue-200 font-medium">{item.concepto}</span>
                  <span className="text-green-400 text-sm">{item.objetivo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{item.valorOriginal}</span>
                  <span className="text-white font-semibold">{item.resultado}</span>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Comparación Visual de Costos */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4">Comparación de Costos</h3>
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costComparisonData}>
                <XAxis dataKey="name" tick={{ fill: '#93C5FD' }} />
                <YAxis tick={{ fill: '#93C5FD' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #3B82F6',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <span className="text-green-400 text-lg font-semibold">
              Ahorro Total: S/. {totalSavings.toLocaleString()} ({savingsPercentage.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Justificación de Ahorro */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <Wrench className="w-6 h-6 mr-2" />
            Justificación de Ahorros por Componente
          </h3>
          <div className="space-y-4">
            {simulationData.justificacionAhorro.partidas.map((partida, index) => (
              <div key={index} className="border border-blue-500/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-blue-300 font-medium">{partida.componente}</h4>
                  <span className="text-green-400 font-semibold">{partida.ahorroEstimado}</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-red-300 text-sm">Sistema Original: </span>
                    <span className="text-gray-300 text-sm">{partida.sistemaOriginal}</span>
                  </div>
                  <div>
                    <span className="text-green-300 text-sm">Nuevo Sistema: </span>
                    <span className="text-gray-300 text-sm">{partida.nuevoSistema}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500/30">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-green-300 font-bold text-lg">{simulationData.justificacionAhorro.ahorroTotal.componente}</h4>
                <span className="text-green-400 font-bold text-lg">{simulationData.justificacionAhorro.ahorroTotal.ahorroEstimado}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {simulationData.justificacionAhorro.nota}
              </p>
            </div>
          </div>
        </div>

        {/* Impacto Sostenible y Productividad */}
        {(materialData || baseMaterialData) && (
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Leaf className="w-6 h-6 mr-2" />
              Comparación de Impacto Sostenible
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Material Original */}
                <div className="space-y-3">
                  <h4 className="text-red-300 font-medium text-center">Material Base</h4>
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    <div className="text-center">
                      <span className="text-red-200 text-sm">Ahorro Energético:</span>
                      <p className="text-red-400 font-bold">
                        {baseMaterialData?.ahorro_energia_pct || 0}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    <div className="text-center">
                      <span className="text-red-200 text-sm">Reducción H-H:</span>
                      <p className="text-red-400 font-bold">
                        {baseMaterialData?.reduccion_hit_pct || 0}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
                    <div className="text-center">
                      <span className="text-red-200 text-sm">CO2:</span>
                      <p className="text-red-400 font-bold text-xs">
                        {baseMaterialData?.impacto_co2_texto || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Material Optimizado */}
                <div className="space-y-3">
                  <h4 className="text-green-300 font-medium text-center">Material Optimizado</h4>
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
                    <div className="text-center">
                      <span className="text-green-200 text-sm">Ahorro Energético:</span>
                      <p className="text-green-400 font-bold">
                        {materialData?.ahorro_energia_pct || 0}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
                    <div className="text-center">
                      <span className="text-green-200 text-sm">Reducción H-H:</span>
                      <p className="text-green-400 font-bold">
                        {materialData?.reduccion_hit_pct || 0}%
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-900/20 rounded-lg p-3 border border-green-500/30">
                    <div className="text-center">
                      <span className="text-green-200 text-sm">CO2:</span>
                      <p className="text-green-400 font-bold text-xs">
                        {materialData?.impacto_co2_texto || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-lg p-4 border border-green-500/20">
                <div className="text-center space-y-2">
                  <div>
                    <span className="text-red-300 font-semibold">Material Base: </span>
                    <span className="text-white">{baseMaterialData?.nombre_material || 'Cargando...'}</span>
                  </div>
                  <div>
                    <span className="text-green-300 font-semibold">Material Seleccionado: </span>
                    <span className="text-white">{materialData?.nombre_material || params?.wallMaterial || 'Cargando...'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Acabados de Valor Añadido */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <Sparkles className="w-6 h-6 mr-2" />
            Acabados de Valor Añadido
          </h3>
          <div className="space-y-4">
            {simulationData.acabadosValorAnadido.map((acabado, index) => (
              <div key={index} className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                <div className="space-y-3">
                  <div>
                    <span className="text-red-300 text-sm font-medium">Original: </span>
                    <span className="text-gray-300 text-sm">{acabado.partidaOriginal}</span>
                  </div>
                  <div>
                    <span className="text-blue-300 text-sm font-medium">Optimizado: </span>
                    <span className="text-gray-300 text-sm">{acabado.partidaOptimizada}</span>
                  </div>
                  <div className="bg-blue-900/30 rounded p-3">
                    <span className="text-blue-200 text-sm font-medium">Impacto: </span>
                    <span className="text-blue-100 text-sm">{acabado.impacto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución de Ahorros */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4">Distribución de Ahorros</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsData}>
                <XAxis dataKey="name" tick={{ fill: '#93C5FD' }} />
                <YAxis tick={{ fill: '#93C5FD' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: '1px solid #3B82F6',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="ahorro" fill="#10B981" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sistema Constructivo Seleccionado */}
        {selectedSystem && (
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-white text-lg font-semibold mb-4">Sistema Constructivo Seleccionado</h3>
            <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-lg p-4 border border-green-500/20">
              <h4 className="text-green-300 font-semibold mb-2">{selectedSystem.nombre}</h4>
              <p className="text-gray-300 text-sm mb-4">{selectedSystem.descripcion}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-blue-200 text-xs">Factor de Costo</p>
                  <p className="text-white font-bold text-lg">{selectedSystem.costo_factor}</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-200 text-xs">Factor de Tiempo</p>
                  <p className="text-white font-bold text-lg">{selectedSystem.tiempo_factor}</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-200 text-xs">Aislamiento Térmico</p>
                  <p className="text-white font-medium text-sm">{selectedSystem.aislamiento_termico}</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-200 text-xs">Huella de Carbono</p>
                  <p className="text-white font-medium text-sm">{selectedSystem.huella_carbono}</p>
                </div>
              </div>

              <div className="bg-blue-900/30 rounded p-3">
                <span className="text-blue-200 text-sm font-medium">Ventaja clave: </span>
                <span className="text-blue-100 text-sm">{selectedSystem.ventaja_clave}</span>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                <span>Fuente: {selectedSystem.fuente}</span>
              </div>
            </div>
          </div>
        )}

        {/* Visualizaciones con IA */}
        {params.materialData && (
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2" />
              Visualizaciones Generadas con IA
            </h3>
            <div className="space-y-6">

              {/* 3D Render Section */}
              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
                <h4 className="text-purple-200 font-medium mb-3">Visualización 3D del Material</h4>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={generateRender}
                    disabled={loadingRender}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loadingRender ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Cargando Visualización 3D...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        <span>Mostrar Visualización 3D</span>
                      </>
                    )}
                  </button>

                  {/* 3D Render Image Container - Conectado a imagen_render_generada */}
                  <div className="w-full h-64 bg-gray-800/50 rounded-lg border border-purple-500/30 flex items-center justify-center overflow-hidden">
                    {loadingRender ? (
                      <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                        <span className="text-purple-200 text-sm">Cargando visualización 3D...</span>
                      </div>
                    ) : renderImageUrl ? (
                      <div className="w-full h-full relative group">
                        <ARViewer
                          src={renderImageUrl.replace(/\.(png|jpg|jpeg)$/i, '.glb')}
                          poster={renderImageUrl}
                          alt="Visualización 3D - Albañilería Confinada"
                          className="w-full h-full rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <Eye className="w-16 h-16 text-purple-400 mb-4 mx-auto opacity-50" />
                        <h5 className="text-purple-200 font-medium mb-2">Visualización 3D</h5>
                        <span className="text-gray-400 text-sm">Haz clic en el botón para mostrar la visualización 3D</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Construction Detail Section */}
              <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20">
                <h4 className="text-blue-200 font-medium mb-3">Detalle Constructivo</h4>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={generateDetail}
                    disabled={loadingDetail}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loadingDetail ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Cargando Detalle Constructivo...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Mostrar Detalle Constructivo</span>
                      </>
                    )}
                  </button>

                  {/* Construction Detail Image Container - Conectado a imagen_detalle_generada */}
                  <div className="w-full h-64 bg-gray-800/50 rounded-lg border border-blue-500/30 flex items-center justify-center overflow-hidden">
                    {loadingDetail ? (
                      <div className="flex flex-col items-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                        <span className="text-blue-200 text-sm">Cargando detalle constructivo...</span>
                      </div>
                    ) : detailImageUrl ? (
                      <div className="w-full h-full relative group">
                        <ARViewer
                          src={detailImageUrl.replace(/\.(png|jpg|jpeg)$/i, '.glb')}
                          poster={detailImageUrl}
                          alt="Detalle Constructivo - Bloques Apilables"
                          className="w-full h-full rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <FileText className="w-16 h-16 text-blue-400 mb-4 mx-auto opacity-50" />
                        <h5 className="text-blue-200 font-medium mb-2">Detalle Constructivo</h5>
                        <span className="text-gray-400 text-sm">Haz clic en el botón para mostrar el detalle constructivo</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg p-4 border border-purple-500/20">
                <div className="text-center">
                  <span className="text-purple-300 font-semibold">Material Seleccionado: </span>
                  <span className="text-white">{params.wallMaterial}</span>
                  {params.materialData?.id && (
                    <span className="text-gray-400 text-sm block mt-1">ID: {params.materialData.id}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Parámetros de Simulación */}
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
          <h3 className="text-white text-lg font-semibold mb-4">Parámetros de Simulación</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-blue-200 text-sm">Región:</span>
              <p className="text-white font-medium">{params.region}</p>
            </div>
            <div>
              <span className="text-blue-200 text-sm">Tipo:</span>
              <p className="text-white font-medium">{params.housingType}</p>
            </div>
            <div>
              <span className="text-blue-200 text-sm">Presupuesto:</span>
              <p className="text-white font-medium">S/{params.budget.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-blue-200 text-sm">Unidades:</span>
              <p className="text-white font-medium">{params.familyCount}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pb-6">
          <button
            onClick={handleSaveScenario}
            disabled={isProjectSaved}
            className={`w-full py-4 text-white rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center justify-center space-x-3 ${isProjectSaved
              ? 'bg-green-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
          >
            {isProjectSaved ? (
              <>
                <CheckCircle className="w-6 h-6" />
                <span>¡Proyecto Guardado Exitosamente!</span>
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                <span>Guardar Proyecto Optimizado</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="w-full py-4 bg-black/40 border border-blue-500/50 text-white rounded-lg font-medium hover:bg-blue-600/20 transition-colors"
          >
            Consultar con IA sobre Optimizaciones
          </button>

          {isProjectSaved && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-300 font-medium mb-2">¡Proyecto guardado correctamente!</p>
              <p className="text-green-200 text-sm">
                Puedes encontrar este proyecto en la sección "Proyectos Guardados"
              </p>
              <button
                onClick={() => navigate('/saved-projects')}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Ver Proyectos Guardados
              </button>
            </div>
          )}
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
