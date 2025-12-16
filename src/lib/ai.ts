import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface TripParams {
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: string;
  travelType: string;
  activities: string[];
  language: string;
}

export interface DayItinerary {
  day: number;
  date: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface TripItinerary {
  title: string;
  overview: string;
  days: DayItinerary[];
  budgetTips: string[];
  localAdvice: string[];
  safetyTips: string[];
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  ar: 'Arabic',
};

export async function generateItinerary(params: TripParams): Promise<TripItinerary> {
  const { destination, startDate, endDate, budget, travelType, activities, language } = params;

  // Calculate number of days
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const languageName = LANGUAGE_NAMES[language] || 'English';

  const prompt = `You are an expert travel planner. Create a detailed ${days}-day travel itinerary for ${destination}.

IMPORTANT: Respond ONLY in ${languageName}. The entire response must be in ${languageName}.

Trip Details:
- Destination: ${destination}
- Duration: ${days} days (${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()})
- Budget: ${budget}
- Travel Type: ${travelType}
- Preferred Activities: ${activities.join(', ')}

Please provide a response in the following JSON format:
{
  "title": "Trip title in ${languageName}",
  "overview": "Brief overview of the trip in ${languageName} (2-3 sentences)",
  "days": [
    {
      "day": 1,
      "date": "Date",
      "morning": "Morning activities and suggestions for places or foods in ${languageName} (detailed, 3-4 sentences)",
      "afternoon": "Afternoon activities and suggestions for places or foods in ${languageName} (detailed, 3-4 sentences)",
      "evening": "Evening activities and suggestions for places or foods in ${languageName} (detailed, 3-4 sentences)"
    }
    // ... continue for all ${days} days
  ],
  "budgetTips": [
    "Budget tip 1 in ${languageName}",
    "Budget tip 2 in ${languageName}",
    "Budget tip 3 in ${languageName}",
    "Budget tip 4 in ${languageName}",
    "Budget tip 5 in ${languageName}"
  ],
  "localAdvice": [
    "Local advice 1 in ${languageName}",
    "Local advice 2 in ${languageName}",
    "Local advice 3 in ${languageName}",
    "Local advice 4 in ${languageName}",
    "Local advice 5 in ${languageName}"
  ],
  "safetyTips": [
    "Safety tip 1 in ${languageName}",
    "Safety tip 2 in ${languageName}",
    "Safety tip 3 in ${languageName}",
    "Safety tip 4 in ${languageName}",
    "Safety tip 5 in ${languageName}"
  ]
}

Requirements:
- ALL content must be in ${languageName}
- Be specific and practical
- Include actual place names, restaurants, and attractions
- Tailor suggestions to the budget level (${budget})
- Consider the travel type (${travelType})
- Include the preferred activities: ${activities.join(', ')}
- Provide realistic timing and logistics
- Use natural, conversational language
- For Arabic responses, use proper right-to-left text

Return ONLY the JSON object, no additional text.`;

  try {
    console.log('=== Groq API Call ===');
    console.log('API Key exists:', !!process.env.GROQ_API_KEY);
    console.log('API Key length:', process.env.GROQ_API_KEY?.length);
    console.log('Model:', 'llama-3.3-70b-versatile');
    console.log('Language:', languageName);
    console.log('Days:', days);
    
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert travel planner. Always respond in valid JSON format. Respond only in the requested language: ${languageName}.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    console.log('Groq API response received');
    console.log('Choices:', completion.choices?.length);
    
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    console.log('Content length:', content.length);
    
    const itinerary: TripItinerary = JSON.parse(content);

    // Validate the response structure
    if (!itinerary.title || !itinerary.overview || !itinerary.days || !Array.isArray(itinerary.days)) {
      console.error('Invalid itinerary structure:', { 
        hasTitle: !!itinerary.title, 
        hasOverview: !!itinerary.overview, 
        hasDays: !!itinerary.days,
        isArray: Array.isArray(itinerary.days)
      });
      throw new Error('Invalid itinerary format');
    }

    // Ensure we have the correct number of days
    if (itinerary.days.length !== days) {
      console.warn(`Expected ${days} days but got ${itinerary.days.length}, adjusting...`);
      // Don't throw, just warn and continue
    }

    // Ensure all required fields exist with defaults if missing
    itinerary.budgetTips = itinerary.budgetTips || [];
    itinerary.localAdvice = itinerary.localAdvice || [];
    itinerary.safetyTips = itinerary.safetyTips || [];

    console.log('Itinerary validated successfully');
    return itinerary;
  } catch (error) {
    console.error('=== Error generating itinerary ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown');
    console.error('Full error:', error);
    
    if (error instanceof Error && error.message.includes('GROQ_API_KEY')) {
      throw new Error('API configuration error. Please check your GROQ_API_KEY.');
    }
    
    throw new Error(`Failed to generate itinerary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
