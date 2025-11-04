export type AIProvider = 'google' | 'mistral';
export type AppName = 'assistant' | 'insightEngine' | 'playground';

interface AIConfig {
    provider: AIProvider;
    model: string;
}

// Add any new supported models to these lists.
const SUPPORTED_GOOGLE_MODELS = ['gemini-2.5-pro', 'gemini-flash-latest'];
const SUPPORTED_MISTRAL_MODELS = ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest'];

const DEFAULTS: Record<AppName, string> = {
    assistant: 'gemini-flash-latest',
    insightEngine: 'gemini-2.5-pro',
    playground: 'gemini-flash-latest',
};

const ENV_VARS: Record<AppName, string | undefined> = {
    assistant: process.env.ASSISTANT_AI_MODEL,
    insightEngine: process.env.INSIGHT_ENGINE_AI_MODEL,
    playground: process.env.PLAYGROUND_AI_MODEL,
};

const getProvider = (modelName: string): AIProvider | null => {
    if (SUPPORTED_GOOGLE_MODELS.includes(modelName)) return 'google';
    if (SUPPORTED_MISTRAL_MODELS.includes(modelName)) return 'mistral';
    // Fallback check for user-defined models that might not be in the list yet
    if (modelName.toLowerCase().includes('mistral')) return 'mistral';
    if (modelName.toLowerCase().includes('gemini')) return 'google';
    return null;
}

/**
 * Gets the configured AI provider and model for a specific application.
 * It checks environment variables first. If the model is supported, it's used.
 * Otherwise, it falls back to a hardcoded default for that app.
 * @param app The name of the application ('assistant', 'insightEngine', 'playground').
 * @returns An object containing the AI provider and model name.
 */
export const getModelAndProviderForApp = (app: AppName): AIConfig => {
    const envModel = ENV_VARS[app];
    
    if (envModel) {
        const provider = getProvider(envModel);
        if (provider) {
            console.log(`Using model from environment for ${app}: ${envModel} (${provider})`);
            return { provider, model: envModel };
        }
        console.warn(`Model "${envModel}" from environment for ${app} is not supported. Falling back to default.`);
    }

    const defaultModel = DEFAULTS[app];
    const defaultProvider = getProvider(defaultModel)!; // Defaults are always supported and have a known provider

    return { provider: defaultProvider, model: defaultModel };
};