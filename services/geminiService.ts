import { GoogleGenAI, Type } from "@google/genai";
import { StoryIdea } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

const getSystemInstruction = (task: 'ideas' | 'story') => {
    if (task === 'ideas') {
        return `You are a creative assistant for children's bedtime stories. Your audience is 3-10 years old. Generate story titles that are simple, captivating, and spark imagination.`;
    }
    return `You are a master storyteller for children aged 3 to 10. Write short, engaging, and simple paragraphs (about 3-5 sentences) that continue the story. Then, provide three distinct, short, and easy-to-understand choices for what happens next. One choice should be funny, one adventurous, and one gentle. The story must always be positive, age-appropriate, and free of scary elements. Ensure the story naturally concludes on a happy, calming note after about 5-7 steps. When it's time to end, provide a concluding paragraph and an empty array for choices. For the very first part of a new story, also provide a short, visual description of the main character(s) to ensure visual consistency in illustrations.`;
};

async function generateImage(prompt: string, characterDescription?: string): Promise<string> {
    let fullPrompt = `A beautiful, whimsical, storybook illustration for children in a soft and gentle art style, showing: ${prompt}. Use vibrant, warm colors, with a dreamy, magical atmosphere. No scary or dark elements.`;
    if (characterDescription) {
        fullPrompt += ` The main character(s) should be visually consistent and look like this: ${characterDescription}.`;
    }
    const response = await ai.models.generateImages({
        model: imageModel,
        prompt: fullPrompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
}

export async function getStoryIdeas(category: string): Promise<StoryIdea[]> {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: `Generate 3 one-sentence story ideas for a bedtime story in the '${category}' category.`,
        config: {
            systemInstruction: getSystemInstruction('ideas'),
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    ideas: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
    });

    try {
        const json = JSON.parse(response.text);
        const ideas: string[] = json.ideas || [];
        
        if (ideas.length === 0) {
            return [];
        }

        const imagePromises = ideas.map(idea => generateImage(idea));
        const imageUrls = await Promise.all(imagePromises);

        return ideas.map((idea, index) => ({
            title: idea,
            imageUrl: imageUrls[index]
        }));

    } catch (e) {
        console.error("Failed to parse story ideas JSON or generate images:", e);
        return [];
    }
}

async function generateStoryPart(prompt: string): Promise<{ storyPart: string; choices: string[]; characterDescription?: string; }> {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
            systemInstruction: getSystemInstruction('story'),
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    storyPart: { type: Type.STRING, description: "The next part of the story." },
                    choices: {
                        type: Type.ARRAY,
                        description: "Three choices for the user, or an empty array if the story is over.",
                        items: { type: Type.STRING }
                    },
                    characterDescription: { type: Type.STRING, description: "A visual description of the main character(s). This should ONLY be provided for the very first part of a new story." }
                }
            }
        }
    });

    try {
        return JSON.parse(response.text);
    } catch (e) {
        console.error("Failed to parse story part JSON:", e);
        return { storyPart: "The storyteller seems to have lost their words! Let's try another path.", choices: [] };
    }
}

export async function startStory(title: string): Promise<{ storyPart: string; choices: string[]; imageUrl: string; characterDescription?: string; }> {
    const storyPrompt = `Start a new bedtime story with the title: "${title}". Write an exciting and gentle introduction.`;

    const storyData = await generateStoryPart(storyPrompt);
    const imageUrl = await generateImage(title, storyData.characterDescription);

    return { ...storyData, imageUrl };
}

export async function continueStory(title: string, storySoFar: string, choice: string, characterDescription?: string): Promise<{ storyPart: string; choices: string[]; imageUrl: string }> {
    const storyPrompt = `The story is titled "${title}". Here's what has happened so far:\n${storySoFar}\n\nThe child chose to: "${choice}".\n\nNow, write the next part of the story based on this choice.`;
    
    const storyData = await generateStoryPart(storyPrompt);
    const imagePrompt = storyData.storyPart;

    const imageUrl = await generateImage(imagePrompt, characterDescription);

    return { ...storyData, imageUrl };
}

export async function finishStory(title: string, storySoFar: string, characterDescription?: string): Promise<{ storyPart: string; choices: string[]; imageUrl: string }> {
    const storyPrompt = `The story is titled "${title}". Here's what has happened so far:\n${storySoFar}\n\nNow, write a final, happy, and calming concluding paragraph to end the story. Do not provide any more choices.`;

    const storyData = await generateStoryPart(storyPrompt);
    const imagePrompt = storyData.storyPart;

    const imageUrl = await generateImage(imagePrompt, characterDescription);

    return { ...storyData, imageUrl, choices: [] };
}