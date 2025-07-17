import { GoogleGenAI, Type } from "@google/genai";
import type { StrengthAnalysis, BuyerPersona } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStrengths = async (profileText: string) => {
    const prompt = `Eres un estratega profesional y experto en marketing de clase mundial. Analiza el siguiente perfil profesional/CV. Identifica las 3-5 fortalezas clave. Para cada fortaleza, tradúcela a un problema específico y comercializable que resuelve para una empresa o individuo. Proporciona un ejemplo claro y convincente para cada una.
    
    Perfil Profesional:
    ---
    ${profileText}
    ---
    
    Tu respuesta debe ser un array JSON.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        strength: { type: Type.STRING, description: "La habilidad o fortaleza principal." },
                        problemSolved: { type: Type.STRING, description: "El problema de negocio o de cliente específico que esta fortaleza aborda." },
                        example: { type: Type.STRING, description: "Un ejemplo concreto de esto en acción." }
                    },
                    required: ["strength", "problemSolved", "example"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse strengths JSON:", e);
        throw new Error("No se pudo interpretar la respuesta de la IA. Por favor, inténtalo de nuevo.");
    }
};

export const generatePersonas = async (strengths: StrengthAnalysis[]) => {
    const problemsText = strengths.map(s => s.problemSolved).join(", ");
    const prompt = `Basado en un profesional que es hábil resolviendo estos problemas: "${problemsText}", crea 2 buyer personas detallados y de ultra-nicho para clientes potenciales que necesitan desesperadamente estas soluciones.
    
    Para cada persona, debes proporcionar:
    1.  Un nombre plausible y un rol de trabajo específico.
    2.  Demografía: Un rango de edad realista y una ubicación de negocio probable (ej. "Centro tecnológico como Austin, TX" o "Empresas de logística en Valencia, España").
    3.  Antecedentes Profesionales: Un breve resumen de su trayectoria profesional.
    4.  Metas: 2-3 objetivos profesionales principales que intentan alcanzar.
    5.  Desafíos: 2-3 puntos de dolor o desafíos importantes que enfrentan y que se relacionan con los problemas que puedes resolver.
    6.  Stack Tecnológico: 3-5 tecnologías, software o herramientas que usan a diario.
    7.  Canales Digitales: 3-5 lugares específicos donde pasan el tiempo en línea (ej. 'r/SaaS' en Reddit, el podcast 'Nación Digital', influencers específicos de LinkedIn que siguen).

    Tu respuesta debe ser un array JSON de objetos de persona.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        demographics: {
                            type: Type.OBJECT,
                            properties: {
                                age: { type: Type.STRING },
                                location: { type: Type.STRING }
                            },
                            required: ["age", "location"]
                        },
                        professionalBackground: { type: Type.STRING },
                        goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                        challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
                        techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                        digitalChannels: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["name", "role", "demographics", "professionalBackground", "goals", "challenges", "techStack", "digitalChannels"]
                }
            }
        }
    });
    
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse personas JSON:", e);
        throw new Error("No se pudo interpretar la respuesta de la IA. Por favor, inténtalo de nuevo.");
    }
};

export const generateListeningGuide = async (persona: BuyerPersona) => {
    const prompt = `Para el buyer persona detallado a continuación, genera una guía práctica de 'escucha activa'.
    
    Persona:
    - Nombre: ${persona.name}
    - Rol: ${persona.role}
    - Desafíos: ${persona.challenges.join(", ")}
    - Canales Digitales: ${persona.digitalChannels.join(", ")}

    Tu tarea es proporcionar:
    1.  Una lista de 5-10 palabras clave y frases 'long-tail' específicas para monitorear en sus canales digitales. Deben ser las palabras exactas que usarían para describir sus problemas.
    2.  Una plantilla para una mini-encuesta online de 3 preguntas para validar rápidamente la urgencia de su problema y sus soluciones actuales. IMPORTANTE: El título de la encuesta debe usar mayúscula solo en la primera palabra.
    3.  Una lista de 5 preguntas poderosas y abiertas para una breve llamada de descubrimiento o entrevista de 15 minutos para descubrir su disposición a pagar.

    Tu respuesta debe ser un único objeto JSON.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    monitoringKeywords: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Palabras clave para rastrear en comunidades online."
                    },
                    surveyTemplate: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Un título atractivo para la encuesta (usando mayúscula solo en la primera palabra)." },
                            questions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 preguntas concisas." }
                        },
                        required: ["title", "questions"]
                    },
                    interviewQuestions: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "5 preguntas abiertas para una entrevista de validación."
                    }
                },
                required: ["monitoringKeywords", "surveyTemplate", "interviewQuestions"]
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse listening guide JSON:", e);
        throw new Error("No se pudo interpretar la respuesta de la IA. Por favor, inténtalo de nuevo.");
    }
};

export const generatePilotOffers = async (problem: string, persona: BuyerPersona) => {
    const prompt = `Necesito crear una oferta de servicio piloto.
    
    El problema que resuelvo es: "${problem}"
    Mi cliente objetivo es: ${persona.name}, un/a ${persona.role}. Sus principales desafíos son: ${persona.challenges.join(", ")}.

    Genera 2 ofertas de servicio piloto distintas e irresistibles. Cada oferta debe ser:
    - Un compromiso corto, de una semana.
    - Enfocada en entregar un resultado específico y tangible que proporcione una victoria rápida relacionada con su problema principal.
    - Con un modelo de baja inversión para reducir la fricción (ej. una pequeña tarifa fija, o gratis a cambio de un testimonio detallado).
    - IMPORTANTE: El título de cada oferta debe usar mayúscula solo en la primera palabra.

    Tu respuesta debe ser un array JSON de 2 objetos de oferta.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        offerTitle: { type: Type.STRING, description: "Un título atractivo para la oferta piloto (usando mayúscula solo en la primera palabra)." },
                        outcome: { type: Type.STRING, description: "El resultado específico y tangible que obtendrá el cliente." },
                        pricingModel: { type: Type.STRING, description: "La sugerencia de precio de baja fricción." }
                    },
                    required: ["offerTitle", "outcome", "pricingModel"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse pilot offers JSON:", e);
        throw new Error("No se pudo interpretar la respuesta de la IA. Por favor, inténtalo de nuevo.");
    }
};

export const generateScalingStrategies = async (problem: string, persona: BuyerPersona) => {
    const prompt = `Genera estrategias concretas para escalar la visibilidad de un servicio.

    El servicio resuelve este problema: "${problem}"
    El cliente objetivo es: ${persona.name}, un/a ${persona.role}. Pasa el tiempo en estos canales digitales: ${persona.digitalChannels.join(", ")}.

    Proporciona estrategias para:
    1.  Contenido SEO hiper-específico: Sugiere 2 títulos de artículos de blog con palabras clave 'long-tail' objetivo. IMPORTANTE: Cada título debe usar mayúscula solo en la primera palabra.
    2.  Campaña de Anuncios Segmentada: Sugiere una plataforma (ej. LinkedIn, Twitter), describe los criterios de la audiencia objetivo y escribe un texto de anuncio corto y potente.
    3.  Colaboración con Micro-influencers: Describe el perfil ideal del influencer (ej. "Un presentador de podcast centrado en...") y una idea de colaboración sencilla.

    Tu respuesta debe ser un único objeto JSON.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    seo: {
                        type: Type.OBJECT,
                        properties: {
                            blogPosts: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        keywords: { type: Type.STRING }
                                    },
                                    required: ["title", "keywords"]
                                }
                            }
                        },
                        required: ["blogPosts"]
                    },
                    ads: {
                        type: Type.OBJECT,
                        properties: {
                            platform: { type: Type.STRING },
                            audience: { type: Type.STRING },
                            copy: { type: Type.STRING }
                        },
                        required: ["platform", "audience", "copy"]
                    },
                    influencers: {
                        type: Type.OBJECT,
                        properties: {
                            profile: { type: Type.STRING },
                            idea: { type: Type.STRING }
                        },
                        required: ["profile", "idea"]
                    }
                },
                required: ["seo", "ads", "influencers"]
            }
        }
    });
    
    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse scaling strategies JSON:", e);
        throw new Error("No se pudo interpretar la respuesta de la IA. Por favor, inténtalo de nuevo.");
    }
};