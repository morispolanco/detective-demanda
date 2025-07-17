import React from 'react';
import { XIcon } from './icons';

interface TutorialProps {
    onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header */}
                <header className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-sky-400">Manual de usuario: Detective de Demanda</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto prose prose-invert max-w-none prose-h1:text-sky-400 prose-h3:text-amber-400">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-4">Bienvenido al Detective de demanda</h1>
                    <p>
                        Esta herramienta está diseñada para transformar la forma en que te presentas al mundo profesional. En lugar de simplemente listar tus habilidades, te ayudaremos a descubrir quién necesita exactamente esas habilidades y por qué estarían dispuestos a pagar por ellas. El objetivo es pasar de "esto es lo que sé hacer" a "estos son los problemas que resuelvo y para quién".
                    </p>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div>
                            <h3 className="text-2xl font-bold text-amber-400 mb-2">Paso 1: Descubre tus superpoderes</h3>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Por qué es importante?</h4>
                            <p className="mb-3">
                                Los clientes no compran "habilidades", compran "soluciones". Un "experto en Python" es una habilidad, pero "automatizar informes financieros para ahorrar 10 horas de trabajo a la semana" es una solución valiosa. Este primer paso traduce tus talentos en resultados comerciales tangibles que un cliente puede entender y desear.
                            </p>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Cómo funciona?</h4>
                            <p>
                                Pega tu currículum, perfil de LinkedIn o una descripción de tus capacidades. La IA analizará el texto para identificar tus fortalezas principales y las reformulará como "problemas resueltos", añadiendo un ejemplo práctico para que la propuesta de valor sea cristalina.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div>
                            <h3 className="text-2xl font-bold text-cyan-400 mb-2">Paso 2: Dibuja a tu cliente ideal</h3>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Por qué es importante?</h4>
                            <p className="mb-3">
                                Intentar venderle a "todo el mundo" es la forma más rápida de no venderle a nadie. Al crear 2 o 3 "buyer personas" de ultra-nicho, concentras tus esfuerzos en un grupo muy específico de personas que tienen la mayor probabilidad de necesitar y valorar tus soluciones. Conocer sus desafíos, metas y dónde pasan el tiempo online es oro puro para el marketing.
                            </p>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Cómo funciona?</h4>
                            <p>
                                Basándose en los problemas que resuelves, la IA creará perfiles detallados de clientes ficticios pero realistas. Estos perfiles no son solo demográficos; incluyen sus dolores de cabeza profesionales, las herramientas que usan y las comunidades online que frecuentan.
                            </p>
                        </div>

                         {/* Step 3 */}
                        <div>
                            <h3 className="text-2xl font-bold text-violet-400 mb-2">Paso 3: Investiga de incógnito</h3>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Por qué es importante?</h4>
                            <p className="mb-3">
                                Antes de crear una oferta, debes validar que los problemas que crees que existen son realmente urgentes para tu cliente ideal. La "escucha activa" te permite sumergirte en sus conversaciones, entender su lenguaje y confirmar si están buscando activamente una solución. Es la diferencia entre adivinar y saber.
                            </p>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Cómo funciona?</h4>
                            <p>
                                La IA te proporcionará una guía de espionaje: palabras clave exactas para monitorear en foros y redes sociales, una plantilla de mini-encuesta para validar la urgencia a escala y preguntas de entrevista para conversaciones uno a uno que te ayudarán a descubrir la disposición a pagar.
                            </p>
                        </div>

                         {/* Step 4 */}
                        <div>
                            <h3 className="text-2xl font-bold text-rose-400 mb-2">Paso 4: Prepara el cebo</h3>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Por qué es importante?</h4>
                            <p className="mb-3">
                                Pedir un gran compromiso de entrada es arriesgado tanto para ti como para el cliente. Una oferta piloto es una versión pequeña y de bajo riesgo de tu servicio principal. Su objetivo no es ganar mucho dinero, sino validar tu solución, obtener un testimonio valioso y conseguir un caso de éxito que puedas usar para atraer a más clientes.
                            </p>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Cómo funciona?</h4>
                            <p>
                                La IA te sugerirá 2 ofertas piloto irresistibles. Cada una se centrará en un resultado rápido y tangible y propondrá un modelo de precio de baja fricción (una tarifa pequeña o un intercambio por un testimonio detallado) para que sea una decisión fácil para tu cliente potencial.
                            </p>
                        </div>
                        
                         {/* Step 5 */}
                        <div>
                            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Paso 5: Amplifica tu señal</h3>
                            <h4 className="font-semibold text-slate-200 mb-2">¿Por qué es importante?</h4>
                            <p className="mb-3">
                                Una vez que has validado tu oferta, necesitas que la gente adecuada la vea. En lugar de gritar al vacío, este paso te da estrategias de marketing de precisión diseñadas específicamente para tu buyer persona, asegurando que tu mensaje llegue a quienes más importan sin desperdiciar tiempo ni dinero.
                            </p>
                             <h4 className="font-semibold text-slate-200 mb-2">¿Cómo funciona?</h4>
                            <p>
                                La IA generará un plan de acción concreto: ideas para artículos de blog con SEO hiper-específico para atraer tráfico orgánico, una plantilla para una campaña de anuncios ultra-segmentada en la plataforma más relevante y un perfil del tipo de micro-influencer con el que deberías colaborar.
                            </p>
                        </div>

                        {/* Checklist & Iteration */}
                        <div>
                            <h3 className="text-2xl font-bold text-amber-300 mb-2">El ciclo de demanda: checklist e iteración</h3>
                             <p>
                                El checklist final no es el final del camino, es el comienzo de un ciclo. El mercado cambia, los clientes evolucionan y tus habilidades mejoran. Revisa este proceso cada 4-6 semanas para mantenerte afilado y asegurarte de que tu oferta siempre esté perfectamente alineada con la demanda real del mercado. ¡La iteración es la clave del éxito a largo plazo!
                            </p>
                        </div>
                    </div>
                </div>
                 {/* Footer */}
                <footer className="p-4 border-t border-slate-700 flex justify-end">
                     {/* Print button removed */}
                </footer>
            </div>
        </div>
    );
};

export default Tutorial;