/// <reference types="react" />

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
                'shadow-softness'?: string;
                'exposure'?: string;
                'environment-image'?: string;
                loading?: 'auto' | 'lazy' | 'eager';
                reveal?: 'auto' | 'interaction' | 'manual';
                'ios-src'?: string;
                class?: string; // model-viewer usa class a veces en ejemplos, pero en React es className. Dejemos class por compatibilidad con web components directos si fuera necesario.
            }, HTMLElement>;
        }
    }
}

export { };
