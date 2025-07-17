import React from 'react';
import type { AppData } from '../types';
import {
    MagnifyingGlassIcon,
    UserCircleIcon,
    BullhornIcon,
    LightBulbIcon,
    RocketIcon
} from './icons';

interface PrintableReportProps {
    data: AppData;
    selectedPersona: string;
    profileText: string;
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; }> = ({ title, children, icon }) => (
    <div className="pt-8 pb-4 px-2">
        <div className="flex items-center border-b-2 border-gray-300 pb-2 mb-6">
            <span className="mr-4 text-gray-700">{icon}</span>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </div>
);

export const PrintableReport: React.FC<PrintableReportProps> = ({ data, selectedPersona, profileText }) => {
    const persona = data.personas.find(p => p.name === selectedPersona);
    const listeningGuide = persona ? data.listeningGuides[persona.name] : null;
    const pilotOffers = persona ? data.pilotOffers[persona.name] : null;
    const scalingStrategies = persona ? data.scalingStrategies[persona.name] : null;

    return (
        <div className="bg-white text-gray-900 font-serif">
            {/* Page 1: Header, Profile, Strengths */}
            <div className="break-after-page">
                <header className="flex flex-col items-center justify-center text-center py-10 px-8 bg-slate-100 border-b-8 border-sky-600">
                    <MagnifyingGlassIcon className="w-20 h-20 text-sky-700 mb-4" />
                    <h1 className="text-5xl font-extrabold text-slate-800">Reporte estratégico</h1>
                    <p className="text-3xl text-slate-600 mt-3 font-semibold">Detective de Demanda</p>
                    <p className="text-base text-slate-500 mt-5">Generado el: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </header>

                {profileText && (
                    <ReportSection title="Perfil profesional analizado" icon={<UserCircleIcon className="w-8 h-8"/>}>
                         <p className="whitespace-pre-wrap text-gray-700 bg-slate-50 p-6 border border-slate-200 rounded-lg text-lg leading-relaxed">{profileText}</p>
                    </ReportSection>
                )}
                
                {data.strengths.length > 0 && (
                    <ReportSection title="Paso 1: Superpoderes identificados" icon={<MagnifyingGlassIcon className="w-8 h-8 text-amber-600"/>}>
                        <div className="space-y-6">
                            {data.strengths.map((item, index) => (
                                <div key={index} className="p-5 border border-slate-200 rounded-lg shadow-sm bg-slate-50/50">
                                    <h3 className="font-bold text-xl text-sky-800 flex items-center"><span className="text-2xl mr-2">⚡</span>{item.strength}</h3>
                                    <p className="mt-2 text-lg"><strong className="font-semibold text-slate-800">Resuelve el problema:</strong> {item.problemSolved}</p>
                                    <p className="mt-2 text-slate-600 italic border-l-4 border-slate-300 pl-4"><strong>Ejemplo:</strong> {item.example}</p>
                                </div>
                            ))}
                        </div>
                    </ReportSection>
                )}
            </div>

            {/* Page 2: Buyer Personas */}
            {data.personas.length > 0 && (
                 <div className="break-after-page">
                    <ReportSection title="Paso 2: Clientes ideales (buyer personas)" icon={<UserCircleIcon className="w-8 h-8 text-cyan-600"/>}>
                        <div className="space-y-8">
                            {data.personas.map((p, i) => (
                                <div key={i} className="p-6 border border-slate-200 rounded-lg shadow-sm bg-slate-50/50">
                                    <h3 className="text-2xl font-bold text-cyan-800">{p.name} - <span className="font-medium text-xl">{p.role}</span></h3>
                                    <p className="text-base text-slate-600 mt-1">{p.demographics.age}, {p.demographics.location}</p>
                                    <p className="mt-4 text-lg">{p.professionalBackground}</p>
                                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                                        <div>
                                            <strong className="block mb-2 text-slate-800">🎯 Metas:</strong>
                                            <ul className="list-disc list-inside space-y-2 text-slate-700">{p.goals.map((g, j) => <li key={j}>{g}</li>)}</ul>
                                        </div>
                                        <div>
                                            <strong className="block mb-2 text-slate-800">🧗 Desafíos:</strong>
                                            <ul className="list-disc list-inside space-y-2 text-slate-700">{p.challenges.map((c, j) => <li key={j}>{c}</li>)}</ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ReportSection>
                 </div>
            )}
            
            {/* Page 3: Detailed Strategy */}
            {persona && (listeningGuide || pilotOffers || scalingStrategies) && (
                 <div>
                    <ReportSection title={`Estrategia detallada para: ${persona.name}`} icon={<RocketIcon className="w-8 h-8 text-emerald-600"/>}>
                        {listeningGuide && (
                             <div className="mb-8 p-6 border border-slate-200 rounded-lg shadow-sm bg-slate-50/50">
                                <h3 className="text-xl font-bold text-violet-800 mb-4 flex items-center"><BullhornIcon className="w-6 h-6 mr-3"/>Paso 3: Guía de escucha activa</h3>
                                <div className="space-y-4 text-lg">
                                    <div>
                                        <strong className="block mb-1 text-slate-800">Palabras clave a monitorear:</strong>
                                        <p className="text-slate-700">{listeningGuide.monitoringKeywords.join(', ')}</p>
                                    </div>
                                    <div>
                                        <strong className="block mt-3 mb-1 text-slate-800">Plantilla de encuesta - {listeningGuide.surveyTemplate.title}:</strong>
                                        <ul className="list-decimal list-inside space-y-1 text-slate-700">{listeningGuide.surveyTemplate.questions.map((q, i) => <li key={i}>{q}</li>)}</ul>
                                    </div>
                                    <div>
                                        <strong className="block mt-3 mb-1 text-slate-800">Preguntas de entrevista:</strong>
                                        <ul className="list-decimal list-inside space-y-1 text-slate-700">{listeningGuide.interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
                                    </div>
                                </div>
                            </div>
                        )}
                         {pilotOffers && (
                             <div className="mb-8 p-6 border border-slate-200 rounded-lg shadow-sm bg-slate-50/50">
                                <h3 className="text-xl font-bold text-rose-800 mb-4 flex items-center"><LightBulbIcon className="w-6 h-6 mr-3"/>Paso 4: Ofertas piloto</h3>
                                <div className="space-y-4">
                                {pilotOffers.map((offer, i) => (
                                    <div key={i} className="pt-2 border-t border-slate-200 first:border-t-0 first:pt-0">
                                        <h4 className="font-semibold text-xl">{offer.offerTitle}</h4>
                                        <p className="text-lg"><strong className="font-semibold text-slate-800">Resultado:</strong> {offer.outcome}</p>
                                        <p className="text-lg"><strong className="font-semibold text-slate-800">Modelo de precio:</strong> {offer.pricingModel}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                         {scalingStrategies && (
                             <div className="p-6 border border-slate-200 rounded-lg shadow-sm bg-slate-50/50">
                                <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center"><RocketIcon className="w-6 h-6 mr-3"/>Paso 5: Estrategias de escalado</h3>
                                <div className="space-y-4 text-lg">
                                    <div>
                                        <h4 className="font-semibold text-xl">Contenido SEO</h4>
                                        {scalingStrategies.seo.blogPosts.map((post, i) => (
                                            <p key={i} className="text-base ml-4 mt-1"><strong>Título:</strong> {post.title} (<i>Keywords: {post.keywords}</i>)</p>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-slate-200">
                                        <h4 className="font-semibold text-xl">Campaña publicitaria ({scalingStrategies.ads.platform})</h4>
                                        <p className="text-base ml-4 mt-1"><strong>Audiencia:</strong> {scalingStrategies.ads.audience}</p>
                                        <p className="text-base ml-4 mt-1"><strong>Copy:</strong> "{scalingStrategies.ads.copy}"</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200">
                                        <h4 className="font-semibold text-xl">Colaboración con micro-influencers</h4>
                                        <p className="text-base ml-4 mt-1"><strong>Perfil ideal:</strong> {scalingStrategies.influencers.profile}</p>
                                        <p className="text-base ml-4 mt-1"><strong>Idea:</strong> {scalingStrategies.influencers.idea}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </ReportSection>
                )}
            
            <footer className="text-center text-sm text-gray-500 py-6 mt-12 border-t-2 border-gray-200">
                <p>Reporte generado con Detective de Demanda y potenciado por la API de Gemini.</p>
            </footer>
        </div>
    );
};