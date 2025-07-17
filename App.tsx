import React, { useState, useCallback, useEffect } from 'react';
import {
  StrengthAnalysis,
  BuyerPersona,
  ListeningGuide,
  PilotOffer,
  ScalingStrategy,
  AppData,
  LoadingStep
} from './types';
import * as geminiService from './services/geminiService';
import Loader from './components/Loader';
import Tutorial from './components/Tutorial';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  BullhornIcon,
  LightBulbIcon,
  RocketIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from './components/icons';

const stepIcons: Record<number, React.ReactNode> = {
  1: <MagnifyingGlassIcon className="w-8 h-8 text-amber-400" />,
  2: <UserCircleIcon className="w-8 h-8 text-cyan-400" />,
  3: <BullhornIcon className="w-8 h-8 text-violet-400" />,
  4: <LightBulbIcon className="w-8 h-8 text-rose-400" />,
  5: <RocketIcon className="w-8 h-8 text-emerald-400" />,
};

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  isOpen: boolean;
  isComplete: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, description, isOpen, isComplete, onToggle, children }) => (
  <div className="border border-slate-700 bg-slate-800/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ease-in-out">
    <button
      onClick={onToggle}
      className="w-full p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-inset"
    >
      <div className="flex items-center">
        <div className="mr-5 flex-shrink-0 w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center">
            {stepIcons[step]}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">{step}. {title}</h3>
          <p className="text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="flex items-center">
        {isComplete && <CheckCircleIcon className="w-6 h-6 text-emerald-400 mr-4" />}
        <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} />
      </div>
    </button>
    {isOpen && (
      <div className="px-6 pb-6 pt-2 border-t border-slate-700/50">
        {children}
      </div>
    )}
  </div>
);

const App: React.FC = () => {
  const [data, setData] = useState<AppData>({
    strengths: [],
    personas: [],
    listeningGuides: {},
    pilotOffers: {},
    scalingStrategies: {},
  });
  const [profileText, setProfileText] = useState('');
  const [loading, setLoading] = useState<LoadingStep>(null);
  const [error, setError] = useState<string | null>(null);
  const [openStep, setOpenStep] = useState<number>(1);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    if (isTutorialOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isTutorialOpen]);

  const handleToggleStep = (step: number) => {
    setOpenStep(openStep === step ? 0 : step);
  };

  const executeApiCall = async <T,>(
    apiFn: () => Promise<T>, 
    loadingStep: LoadingStep, 
    onSuccess: (result: T) => void,
    onFinally?: () => void
  ) => {
    setLoading(loadingStep);
    setError(null);
    try {
        const result = await apiFn();
        onSuccess(result);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    } finally {
        setLoading(null);
        if (onFinally) onFinally();
    }
  };

  const handleGenerateStrengths = useCallback(async () => {
    if (!profileText.trim()) {
        setError("Por favor, introduce tu perfil, CV o una descripción de tus habilidades primero.");
        return;
    }
    await executeApiCall(
        () => geminiService.generateStrengths(profileText),
        'strengths',
        (result: StrengthAnalysis[]) => {
            setData(prev => ({ ...prev, strengths: result, personas: [], listeningGuides: {}, pilotOffers: {}, scalingStrategies: {} }));
            setOpenStep(2);
        }
    );
  }, [profileText]);

  const handleGeneratePersonas = useCallback(async () => {
    await executeApiCall(
        () => geminiService.generatePersonas(data.strengths),
        'personas',
        (result: BuyerPersona[]) => {
            setData(prev => ({ ...prev, personas: result, listeningGuides: {}, pilotOffers: {}, scalingStrategies: {} }));
            setSelectedPersona(result[0]?.name || '');
            setOpenStep(3);
        }
    );
  }, [data.strengths]);
  
  const generateForPersona = async (
    personaName: string,
    dataType: 'listening' | 'pilot' | 'scaling',
    apiFn: (persona: BuyerPersona, problem?: string) => Promise<any>
    ) => {
        const persona = data.personas.find(p => p.name === personaName);
        if (!persona) return;

        const problem = data.strengths[0]?.problemSolved; // Use first problem as primary
        if (!problem && (dataType === 'pilot' || dataType === 'scaling')) return;
        
        await executeApiCall(
            () => apiFn(persona, problem),
            dataType,
            (result) => {
                if (dataType === 'listening') setData(prev => ({ ...prev, listeningGuides: { ...prev.listeningGuides, [personaName]: result }}));
                if (dataType === 'pilot') setData(prev => ({...prev, pilotOffers: { ...prev.pilotOffers, [personaName]: result }}));
                if (dataType === 'scaling') setData(prev => ({...prev, scalingStrategies: { ...prev.scalingStrategies, [personaName]: result }}));
            },
            () => setOpenStep(dataType === 'listening' ? 4 : dataType === 'pilot' ? 5 : 5)
        );
    };

    const handleGenerateListeningGuide = useCallback((personaName: string) => {
        generateForPersona(personaName, 'listening', (p) => geminiService.generateListeningGuide(p));
    }, [data.personas]);

    const handleGeneratePilotOffers = useCallback((personaName: string) => {
        generateForPersona(personaName, 'pilot', (p, prob) => geminiService.generatePilotOffers(prob!, p));
    }, [data.personas, data.strengths]);

    const handleGenerateScalingStrategies = useCallback((personaName:string) => {
        generateForPersona(personaName, 'scaling', (p, prob) => geminiService.generateScalingStrategies(prob!, p));
    }, [data.personas, data.strengths]);

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
      {isTutorialOpen && <Tutorial onClose={() => setIsTutorialOpen(false)} />}
      <div>
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
              Detective de Demanda
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Identifica a tus clientes ideales y crea una oferta irresistible. Sigue estos pasos para convertir tus habilidades en un negocio rentable.
            </p>
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600/50 hover:bg-sky-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
            >
              <BookOpenIcon className="w-5 h-5 mr-2" />
              Leer el manual de usuario
            </button>
          </header>

          {error && (
              <div className="bg-rose-500/20 border border-rose-500 text-rose-300 p-4 rounded-lg mb-8" role="alert">
                  <p className="font-bold">Ocurrió un error:</p>
                  <p>{error}</p>
              </div>
          )}

          <main className="space-y-6">
              {/* Step 1 */}
              <StepCard step={1} title="Descubre tus superpoderes" description="De tu perfil a problemas resueltos" isOpen={openStep === 1} isComplete={data.strengths.length > 0} onToggle={() => handleToggleStep(1)}>
                  <textarea
                      className="w-full h-48 bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                      placeholder="Pega tu CV, perfil de LinkedIn, o una lista de tus habilidades aquí..."
                      value={profileText}
                      onChange={(e) => setProfileText(e.target.value)}
                  />
                  <button
                      onClick={handleGenerateStrengths}
                      disabled={loading === 'strengths'}
                      className="mt-4 w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
                  >
                      {loading === 'strengths' ? 'Analizando...' : 'Analizar fortalezas'}
                  </button>
                  {loading === 'strengths' && <div className="mt-4"><Loader text="Analizando tu perfil..."/></div>}
                  {data.strengths.length > 0 && !loading && (
                      <div className="mt-6 space-y-4">
                          {data.strengths.map((item, index) => (
                              <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                  <h4 className="font-bold text-sky-400">{item.strength}</h4>
                                  <p className="mt-1 text-slate-300"><strong className="text-slate-100">Resuelve el problema:</strong> {item.problemSolved}</p>
                                  <p className="mt-1 text-slate-400 italic"><strong>Ejemplo:</strong> {item.example}</p>
                              </div>
                          ))}
                      </div>
                  )}
              </StepCard>

              {/* Step 2 */}
              <StepCard step={2} title="Dibuja a tu cliente ideal" description="Construye tus buyer personas" isOpen={openStep === 2} isComplete={data.personas.length > 0} onToggle={() => handleToggleStep(2)}>
                  {data.strengths.length === 0 ? <p className="text-slate-400 text-center py-4">Completa el paso 1 para generar buyer personas.</p> :
                      <>
                          <button
                              onClick={handleGeneratePersonas}
                              disabled={loading === 'personas' || data.strengths.length === 0}
                              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
                          >
                              {loading === 'personas' ? 'Bocetando...' : 'Generar personas'}
                          </button>
                          {loading === 'personas' && <div className="mt-4"><Loader text="Construyendo los perfiles de tus clientes..."/></div>}
                          {data.personas.length > 0 && !loading && (
                              <div className="mt-6 grid md:grid-cols-2 gap-6">
                                  {data.personas.map((p, i) => (
                                      <div key={i} className="bg-slate-800 p-5 rounded-lg border border-slate-700 space-y-3">
                                          <h4 className="text-xl font-bold text-cyan-400">{p.name}</h4>
                                          <p className="text-slate-300 font-medium">{p.role}</p>
                                          <p className="text-sm text-slate-400">{p.demographics.age}, {p.demographics.location}</p>
                                          <div className="text-sm">
                                              <strong className="text-slate-200 block mb-1">Desafíos:</strong>
                                              <ul className="list-disc list-inside space-y-1 text-slate-400">
                                                  {p.challenges.map((c, j) => <li key={j}>{c}</li>)}
                                              </ul>
                                          </div>
                                          <div className="text-sm">
                                              <strong className="text-slate-200 block mb-1">Los encuentras aquí:</strong>
                                              <div className="flex flex-wrap gap-2 mt-2">
                                                  {p.digitalChannels.map((c, j) => <span key={j} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{c}</span>)}
                                              </div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </>
                  }
              </StepCard>

              {/* Steps 3, 4, 5 */}
              {data.personas.length > 0 && (
                  <>
                  <div className="bg-slate-800 p-4 rounded-lg sticky top-4 z-10 shadow-lg border border-slate-700">
                      <label htmlFor="persona-selector" className="block text-sm font-medium text-slate-300 mb-2">Selecciona una persona para generar las guías:</label>
                      <select
                          id="persona-selector"
                          value={selectedPersona}
                          onChange={(e) => setSelectedPersona(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      >
                          {data.personas.map(p => <option key={p.name} value={p.name}>{p.name} - {p.role}</option>)}
                      </select>
                  </div>
                  
                  {/* Step 3 */}
                  <StepCard step={3} title="Investiga de incógnito" description="Escucha y recopila pruebas" isOpen={openStep === 3} isComplete={!!data.listeningGuides[selectedPersona]} onToggle={() => handleToggleStep(3)}>
                      <button
                          onClick={() => handleGenerateListeningGuide(selectedPersona)}
                          disabled={loading === 'listening' || !selectedPersona}
                          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
                      >
                          {loading === 'listening' ? 'Generando...' : `Generar guía para ${selectedPersona}`}
                      </button>
                      {loading === 'listening' && <div className="mt-4"><Loader text="Buscando palabras clave y preguntas..."/></div>}
                      {data.listeningGuides[selectedPersona] && !loading && (
                          <div className="mt-6 space-y-4">
                              <h4 className="font-bold text-violet-400">Palabras clave a monitorear</h4>
                              <div className="flex flex-wrap gap-2">{data.listeningGuides[selectedPersona].monitoringKeywords.map((k, i) => <span key={i} className="bg-slate-700 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{k}</span>)}</div>
                              <h4 className="font-bold text-violet-400 mt-4">Plantilla de encuesta: {data.listeningGuides[selectedPersona].surveyTemplate.title}</h4>
                              <ul className="list-decimal list-inside space-y-1 text-slate-400">{data.listeningGuides[selectedPersona].surveyTemplate.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
                              <h4 className="font-bold text-violet-400 mt-4">Preguntas de entrevista</h4>
                              <ul className="list-decimal list-inside space-y-1 text-slate-400">{data.listeningGuides[selectedPersona].interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
                          </div>
                      )}
                  </StepCard>

                  {/* Step 4 */}
                  <StepCard step={4} title="Prepara el cebo" description="Lanza un servicio piloto" isOpen={openStep === 4} isComplete={!!data.pilotOffers[selectedPersona]} onToggle={() => handleToggleStep(4)}>
                      <button
                          onClick={() => handleGeneratePilotOffers(selectedPersona)}
                          disabled={loading === 'pilot' || !selectedPersona}
                          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
                      >
                          {loading === 'pilot' ? 'Creando ofertas...' : `Generar ofertas piloto para ${selectedPersona}`}
                      </button>
                      {loading === 'pilot' && <div className="mt-4"><Loader text="Diseñando tus ofertas piloto..."/></div>}
                      {data.pilotOffers[selectedPersona] && !loading && (
                          <div className="mt-6 space-y-4">
                              {data.pilotOffers[selectedPersona].map((offer, i) => (
                                  <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                      <h4 className="font-bold text-rose-400">{offer.offerTitle}</h4>
                                      <p className="mt-1 text-slate-300"><strong className="text-slate-100">Resultado:</strong> {offer.outcome}</p>
                                      <p className="mt-1 text-slate-400"><strong className="text-slate-100">Modelo de precio:</strong> {offer.pricingModel}</p>
                                  </div>
                              ))}
                          </div>
                      )}
                  </StepCard>

                  {/* Step 5 */}
                  <StepCard step={5} title="Amplifica tu señal" description="Escala con precisión" isOpen={openStep === 5} isComplete={!!data.scalingStrategies[selectedPersona]} onToggle={() => handleToggleStep(5)}>
                      <button
                          onClick={() => handleGenerateScalingStrategies(selectedPersona)}
                          disabled={loading === 'scaling' || !selectedPersona}
                          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors"
                      >
                          {loading === 'scaling' ? 'Desarrollando...' : `Generar estrategias para ${selectedPersona}`}
                      </button>
                      {loading === 'scaling' && <div className="mt-4"><Loader text="Construyendo tu plan de crecimiento..."/></div>}
                      {data.scalingStrategies[selectedPersona] && !loading && (
                          <div className="mt-6 space-y-6">
                              <div>
                                  <h4 className="font-bold text-emerald-400 mb-2">Contenido SEO</h4>
                                  {data.scalingStrategies[selectedPersona].seo.blogPosts.map((post, i) => (
                                      <div key={i} className="bg-slate-800 p-3 rounded-lg border border-slate-700 mb-2">
                                          <p><strong>Título:</strong> {post.title}</p>
                                          <p className="text-sm text-slate-400"><strong>Palabras clave:</strong> {post.keywords}</p>
                                      </div>
                                  ))}
                              </div>
                              <div>
                                  <h4 className="font-bold text-emerald-400 mb-2">Campaña publicitaria</h4>
                                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                      <p><strong>Plataforma:</strong> {data.scalingStrategies[selectedPersona].ads.platform}</p>
                                      <p><strong>Audiencia:</strong> {data.scalingStrategies[selectedPersona].ads.audience}</p>
                                      <p><strong>Copy (anuncio):</strong> "{data.scalingStrategies[selectedPersona].ads.copy}"</p>
                                  </div>
                              </div>
                              <div>
                                  <h4 className="font-bold text-emerald-400 mb-2">Micro-influencer</h4>
                                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                      <p><strong>Perfil:</strong> {data.scalingStrategies[selectedPersona].influencers.profile}</p>
                                      <p><strong>Idea:</strong> {data.scalingStrategies[selectedPersona].influencers.idea}</p>
                                  </div>
                              </div>
                          </div>
                      )}
                  </StepCard>
                  </>
              )}

              {/* Final Checklist */}
              {data.strengths.length > 0 && data.personas.length > 0 && (
                  <div className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl">
                      <h2 className="text-2xl font-bold text-center text-amber-300">Tu checklist accionable</h2>
                      <ul className="mt-6 space-y-3 text-lg list-inside">
                          <li className="flex items-start"><CheckCircleIcon className={`w-4 h-4 mr-3 mt-1.5 flex-shrink-0 ${data.strengths.length > 0 ? 'text-emerald-400' : 'text-slate-600'}`} /><span><strong>Valida fortalezas:</strong> Confirma que los problemas generados resuenan contigo.</span></li>
                          <li className="flex items-start"><CheckCircleIcon className={`w-4 h-4 mr-3 mt-1.5 flex-shrink-0 ${data.personas.length > 0 ? 'text-emerald-400' : 'text-slate-600'}`} /><span><strong>Elige una persona:</strong> Enfócate en un solo buyer persona para empezar.</span></li>
                          <li className="flex items-start"><CheckCircleIcon className={`w-4 h-4 mr-3 mt-1.5 flex-shrink-0 ${Object.keys(data.listeningGuides).length > 0 ? 'text-emerald-400' : 'text-slate-600'}`} /><span><strong>Escucha activamente:</strong> Dedica 15-30 min diarios a monitorear palabras clave en los canales de tu persona.</span></li>
                          <li className="flex items-start"><CheckCircleIcon className={`w-4 h-4 mr-3 mt-1.5 flex-shrink-0 ${Object.keys(data.listeningGuides).length > 0 ? 'text-emerald-400' : 'text-slate-600'}`} /><span><strong>Valida urgencia:</strong> Contacta a 3-5 personas que coincidan con tu persona para una charla rápida usando tus preguntas de entrevista.</span></li>
                          <li className="flex items-start"><CheckCircleIcon className={`w-4 h-4 mr-3 mt-1.5 flex-shrink-0 ${Object.keys(data.pilotOffers).length > 0 ? 'text-emerald-400' : 'text-slate-600'}`} /><span><strong>Lanza el piloto:</strong> Presenta tu oferta piloto a las personas que entrevistaste.</span></li>
                          <li className="flex items-start"><CheckCircleIcon className={`w-4 h-4 mr-3 mt-1.5 flex-shrink-0 ${Object.keys(data.scalingStrategies).length > 0 ? 'text-emerald-400' : 'text-slate-600'}`} /><span><strong>Inicia el contenido:</strong> Escribe el primer artículo de blog sugerido en tu plan de escalado.</span></li>
                      </ul>

                      <div className="mt-8 text-center bg-slate-900/50 border border-amber-500/30 p-4 rounded-lg">
                          <p className="font-bold text-amber-400">¡Itera y perfecciona!</p>
                          <p className="text-slate-400 mt-1">Este es un ciclo, no una tarea única. Revisa este proceso cada 4-6 semanas para afinar tu mensaje, canales y segmentación. El mercado siempre está en movimiento, ¡tú también deberías estarlo!</p>
                      </div>
                  </div>
              )}
          </main>

          <footer className="text-center mt-16 pb-4">
              <p className="text-slate-500">Potenciado por la API de Gemini</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;