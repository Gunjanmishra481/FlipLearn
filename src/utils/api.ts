import { Flashcard } from '../types';

// This function fetches additional flashcards from an external API
// You can replace the API URL with a real flashcard API if available
export async function fetchFlashcards(category: string): Promise<Flashcard[]> {
  try {
    // For demonstration purposes - in a real app, you'd use an actual API endpoint
    // Example API: `https://api.flashcards.com/cards?category=${category}`
    
    // Simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulated response based on category
        const dynamicCards: Record<string, Flashcard[]> = {
          "React": [
            {
              id: 100,
              question: "What is React Fiber?",
              answer: "A complete rewrite of React's core algorithm designed to improve animation, layout, and gestures with incremental rendering",
              category: "React",
              difficulty: "hard",
              confidenceLevel: 0
            },
            {
              id: 101,
              question: "What are React Hooks?",
              answer: "Functions that let you use state and other React features without writing a class component",
              category: "React",
              difficulty: "medium",
              confidenceLevel: 0
            }
          ],
          "JavaScript": [
            {
              id: 102,
              question: "What is the event loop in JavaScript?",
              answer: "A mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded",
              category: "JavaScript",
              difficulty: "hard",
              confidenceLevel: 0
            },
            {
              id: 103,
              question: "What is a pure function?",
              answer: "A function that always returns the same result given the same arguments and has no side effects",
              category: "JavaScript",
              difficulty: "medium",
              confidenceLevel: 0
            }
          ],
          "TypeScript": [
            {
              id: 104,
              question: "What are TypeScript decorators?",
              answer: "A special kind of declaration that can be attached to classes, methods, properties, or parameters to add metadata or modify behavior",
              category: "TypeScript",
              difficulty: "hard",
              confidenceLevel: 0
            },
            {
              id: 105,
              question: "What is the 'keyof' operator in TypeScript?",
              answer: "An operator that takes an object type and produces a string or numeric literal union of its keys",
              category: "TypeScript",
              difficulty: "hard",
              confidenceLevel: 0
            }
          ],
          "CSS": [
            {
              id: 106,
              question: "What are CSS custom properties (variables)?",
              answer: "Entity defined by developers that contain specific values to be reused throughout a document",
              category: "CSS",
              difficulty: "medium",
              confidenceLevel: 0
            },
            {
              id: 107,
              question: "What is CSS BEM methodology?",
              answer: "A naming convention for CSS classes to make them more transparent and informative (Block, Element, Modifier)",
              category: "CSS",
              difficulty: "medium",
              confidenceLevel: 0
            }
          ],
          "HTML": [
            {
              id: 108,
              question: "What is the purpose of the srcset attribute in img tags?",
              answer: "To specify multiple image sources for different screen sizes and resolutions",
              category: "HTML",
              difficulty: "medium",
              confidenceLevel: 0
            },
            {
              id: 109,
              question: "What is the role of the Web Accessibility Initiative (WAI) in HTML?",
              answer: "To develop strategies, guidelines, and resources to help make the web accessible to people with disabilities",
              category: "HTML",
              difficulty: "medium",
              confidenceLevel: 0
            }
          ]
        };

        // Return cards for the requested category or empty array if not found
        resolve(dynamicCards[category] || []);
      }, 1000); // Simulate network delay
    });
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    return [];
  }
} 