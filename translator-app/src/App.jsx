import { useState } from "react";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Added Kannada, Telugu, Tamil + more Indian languages
  const languages = [
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "es", name: "Spanish (Español)" },
    { code: "fr", name: "French (Français)" },
    { code: "de", name: "German (Deutsch)" },
    { code: "it", name: "Italian (Italiano)" },
    { code: "pt", name: "Portuguese (Português)" },
    { code: "ru", name: "Russian (Русский)" },
    { code: "zh", name: "Chinese (中文)" },
    { code: "ja", name: "Japanese (日本語)" },
    { code: "ko", name: "Korean (한국어)" },
    { code: "ar", name: "Arabic (العربية)" },
    { code: "tr", name: "Turkish (Türkçe)" },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText("Please enter some text to translate");
      return;
    }

    setLoading(true);
    setTranslatedText("");

    try {
      const response = await axios.get("https://api.mymemory.translated.net/get", {
        params: {
          q: inputText,
          langpair: `en|${targetLang}`,
          mt: "1",
          de: "a@b.com",
        },
      });

      const result = response.data.responseData?.translatedText || "No translation found";
      setTranslatedText(result);
    } catch (error) {
      console.error(error);
      setTranslatedText("Translation failed – check your internet connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/493797345/photo/thank-you.jpg?s=1024x1024&w=is&k=20&c=8mYtIGUjodcDRMb6sasBQIjNRfTOOjXA18ruNvxv1aQ=')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-center text-white mb-10 drop-shadow-2xl">
            Text Translator
          </h1>

          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/30">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Input Side */}
              <div className="space-y-6">
                <textarea
                  className="w-full h-64 p-6 bg-white/90 backdrop-blur rounded-2xl border border-white/50 text-lg resize-none focus:outline-none focus:ring-4 focus:ring-indigo-400 shadow-lg"
                  placeholder="Type or paste your English text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />

                <select
                  className="w-full p-4 bg-white/90 backdrop-blur rounded-xl border border-white/50 text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-5 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl text-xl disabled:opacity-70"
                >
                  {loading ? "Translating..." : "Translate Now"}
                </button>
              </div>

              {/* Output Side */}
              <div className="flex flex-col">
                <div className="flex-1 bg-white/90 backdrop-blur rounded-2xl p-8 border border-white/50 min-h-64 flex items-start justify-start shadow-lg">
                  <p className="text-xl text-gray-800 leading-relaxed">
                    {translatedText || "Your translation will appear here..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;