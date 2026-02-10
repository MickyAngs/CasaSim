import { useState, useRef, useEffect } from 'react';
import '@google/model-viewer';
import { ScanLine, Box, AlertTriangle, RefreshCcw } from 'lucide-react';

// Declaración eliminada, ver src/types.d.ts

interface ARViewerProps {
    src: string;
    poster?: string;
    alt: string;
    className?: string;
    iosSrc?: string; // Para .usdz en iOS
}

// Definición local de tipos para model-viewer para evitar conflictos de TS
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src?: string;
                poster?: string;
                alt?: string;
                ar?: boolean;
                'ar-modes'?: string;
                'camera-controls'?: boolean;
                'auto-rotate'?: boolean;
                'shadow-intensity'?: string;
                loading?: 'auto' | 'lazy' | 'eager';
                'ios-src'?: string;
                reveal?: 'auto' | 'interaction' | 'manual';
            }, HTMLElement>;
        }
    }
}

// Hack para evitar error de compilación TS2339 con tags personalizados
const ModelViewerComponent = "model-viewer" as any;

export default function ARViewer({ src, poster, alt, className = '', iosSrc }: ARViewerProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const modelViewerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const modelViewer = modelViewerRef.current;
        if (modelViewer) {
            const handleLoad = () => setIsLoading(false);
            const handleError = (error: any) => {
                console.error("Error loading 3D model:", error);
                setHasError(true);
                setIsLoading(false);
            };

            modelViewer.addEventListener('load', handleLoad);
            modelViewer.addEventListener('error', handleError);

            return () => {
                modelViewer.removeEventListener('load', handleLoad);
                modelViewer.removeEventListener('error', handleError);
            };
        }
    }, []);

    // Si hay error, mostrar fallback elegante
    if (hasError) {
        return (
            <div className={`relative w-full h-full bg-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center border border-red-500/20 ${className}`}>
                {poster && (
                    <img
                        src={poster}
                        alt={alt}
                        className="absolute inset-0 w-full h-full object-contain opacity-20 blur-sm pointer-events-none"
                    />
                )}
                <div className="z-10 bg-slate-800/80 p-4 rounded-full mb-3 shadow-lg border border-red-500/30">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-white font-medium z-10 mb-1">No se pudo cargar el modelo 3D</h3>
                <p className="text-slate-400 text-xs max-w-[200px] z-10 mb-4 leading-relaxed">
                    Esto puede deberse a un problema de conexión o al formato del archivo.
                </p>
                <button
                    onClick={() => { setHasError(false); setIsLoading(true); }}
                    className="z-10 flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all border border-slate-600 hover:border-slate-500 shadow-md"
                >
                    <RefreshCcw className="w-4 h-4" />
                    <span>Reintentar</span>
                </button>
            </div>
        );
    }

    return (
        <div className={`relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-2xl border border-white/10 ${className}`}>

            {/* Indicador de carga */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md transition-opacity duration-300">
                    <div className="relative w-16 h-16 mb-4">
                        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-t-transparent border-r-cyan-400 border-b-transparent border-l-pink-400 rounded-full animate-spin-reverse opacity-70"></div>
                    </div>
                    <span className="text-white font-medium tracking-wide animate-pulse">Cargando Modelo 3D...</span>
                </div>
            )}

            {/* Visor 3D AR */}
            {/* Visor 3D AR */}
            <ModelViewerComponent
                ref={modelViewerRef}
                src={src}
                ios-src={iosSrc}
                poster={poster}
                alt={alt}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1.5"
                shadow-softness="0.5"
                exposure="1.2"
                environment-image="neutral"
                loading="eager"
                class="w-full h-full focus:outline-none"
                style={{ width: '100%', height: '100%', '--poster-color': 'transparent' } as React.CSSProperties}
            >
                {/* Botón FAB "Ver en mi espacio" (Glassmorphism) */}
                <button
                    slot="ar-button"
                    className="absolute bottom-6 right-6 z-30 group flex items-center space-x-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-5 py-3 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/20 hover:border-white/30 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="bg-gradient-to-tr from-blue-500 to-purple-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                        <ScanLine className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-bold tracking-wide">Ver en mi espacio</span>
                        <span className="text-[10px] text-blue-200 uppercase tracking-wider font-medium">Realidad Aumentada</span>
                    </div>
                </button>

                {/* Botón de fallback si AR no es soportado (opcional, model-viewer lo maneja internamente generalmente pero podemos personalizarlo) */}
                <div slot="ar-prompt" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-0 transition-opacity duration-300">
                    <img src="https://modelviewer.dev/shared-assets/icons/hand.png" className="w-12 h-12 animate-bounce" />
                </div>

            </ModelViewerComponent>

            {/* Badge de Tecnología */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-2 pointer-events-none">
                <Box className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] text-white/80 font-medium uppercase tracking-widest">3D Interactive</span>
            </div>

        </div>
    );
}
