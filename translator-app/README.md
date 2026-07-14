# TransVerse - Real-Time Text Translator

TransVerse is a premium, high-performance web application designed for seamless, real-time text translation. Built on a modular React 19 stack, it interfaces with the third-party MyMemory Translation API to offer instant multilingual translations.

To optimize network traffic and eliminate silent truncation, the app implements debounced live queries, in-memory caching, request cancellation (`AbortController`), and user-facing boundary limits.

---

## 🌟 Key Features

*   **Real-time Debounced Translation:** Translations are triggered automatically 500ms after you stop typing to avoid hammering the API.
*   **Intelligent Caching:** Identical text queries and language combinations are cached in memory to return instantaneous results on repeated typing.
*   **Request Cancellation:** Active requests are aborted mid-flight using native `AbortController` signals if the user types quickly or changes target languages, preventing stale responses from overwriting newer ones.
*   **Automatic Retries:** Incorporates 1-time automated retries on network failures/timeouts to improve API resilience.
*   **Swap Languages (Source ⇄ Target):** Instantly swap source and target languages with a simple click, including a rotating button animation.
*   **Text-to-Speech (TTS):** Integrated Web Speech API (`speechSynthesis`) reads translated text aloud with native pronunciation mapped to the correct target locale.
*   **Translation History:** Keeps track of the last 5 translations in local state and persistent `localStorage`, permitting click-to-restore.
*   **Character Budget:** Visual character indicator counts down the 500-character free tier API limit, flashing orange/red warnings.
*   **Robust Error Feedback:** Translates rate limits (429), timeouts, invalid language pairs, and network drops into clear, localized warning alerts.
*   **Screen Reader Accessibility:** Complete with `aria-live="polite"` output blocks, explicit form connections, and full button aria-labels.

---

## 🛠️ Tech Stack & Design

*   **Core Logic:** JavaScript, React 19, React Hooks
*   **Build Tool & Dev Server:** Vite
*   **HTTP Client:** Axios (timeout config, AbortController)
*   **Styles & Theme:** Tailwind CSS v3 (Custom Glassmorphism overlay + CSS mesh gradients)
*   **Unit & Integration Tests:** Vitest, React Testing Library, jsdom
*   **API Service:** MyMemory Translation API

---

## 📐 Architecture & Modular Design

The code is refactored into focused, single-responsibility modules to maximize testability and follow clean architectural design:

```
src/
├── api/
│   └── translate.js       # API client config, Axios timeouts, retries, and error mapper
├── components/
│   ├── HistoryList.jsx    # Renders and restores the last 5 translations
│   ├── LanguageSelector   # Handles accessible select menus
│   ├── TranslatorInput    # Custom textarea, clear triggers, and character limits
│   └── TranslatorOutput   # Output card, skeleton loaders, Copy, and TTS actions
├── constants/
│   └── languages.js       # Predefined list of supported language options
├── hooks/
│   └── useTranslate.js    # Custom hook binding debounce, cache, state, and localStorage
├── App.jsx                # Layout Shell connecting hook and modular components
├── main.jsx               # Entrypoint bootstrap
└── setupTests.js          # Vitest DOM matching config
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure you have Node.js (v18 or higher) installed.

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Spoorthi-space/Text-Translator.git
cd Text-Translator/translator-app

# Install package dependencies
npm install
```

### 3. Setup Environment Variables
Create a `.env` file at the root of the `translator-app` directory (refer to `.env.example`):
```env
VITE_MYMEMORY_EMAIL=your-email@example.com
```

### 4. Run Locally
Start the local development server:
```bash
npm run dev
```

### 5. Run Tests
Verify application functionality with the Vitest suite:
```bash
npm run test
```

### 6. Build for Production
Bundle the production application assets:
```bash
npm run build
```

---

## 🧪 Testing Coverage
A robust test suite is available under `src/components/__tests__/Translator.test.jsx` verifying:
*   Standard UI component rendering.
*   Debounced API call executions after typing ceases.
*   Correct representation of translated outputs.
*   Error display on empty inputs or network drops.

---

## 🔮 Future Roadmap (What I'd Improve Next)
1.  **Offline Support:** Implement IndexedDB caching via local forage to permit cached lookups even during network drops.
2.  **Voice Recognition:** Integrate the Web Speech Recognition API (`SpeechRecognition`) to allow speech-to-text input.
3.  **Language Detection:** Auto-detect the source language using MyMemory's detection parameters so users don't have to specify it manually.
