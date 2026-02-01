import { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import Header from "@/react-app/components/Header";
import { SidebarNavigation, MenuButton } from "@/react-app/components/SidebarNavigation";

interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
}

export default function ChatPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/faqs');
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = await response.json();
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (faq: FAQ) => {
    setSelectedQuestion(faq.id);
    setSelectedAnswer(faq.respuesta);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="CasaSim" />
      
      {/* FAQ Content Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
            <p className="text-gray-600">Preguntas frecuentes sobre CasaSim</p>
          </div>

          {/* FAQ List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              <p>No hay preguntas frecuentes disponibles en este momento.</p>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {faqs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => handleQuestionClick(faq)}
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-200 ${
                    selectedQuestion === faq.id
                      ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-white text-gray-800 hover:bg-blue-50 hover:shadow-md border border-gray-200'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="mr-3 text-lg">❓</span>
                    <span className="font-medium leading-relaxed">{faq.pregunta}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Answer Display */}
          {selectedAnswer && (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-xl border-2 border-blue-100 backdrop-blur-sm">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-xl">💡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 pt-1">Respuesta</h3>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedAnswer}</p>
            </div>
          )}
        </div>
      </div>

      <MenuButton onClick={() => setIsSidebarOpen(true)} />
      <SidebarNavigation 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}
