
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TextInput from './components/TextInput';
import TitleInput from './components/TitleInput';
import GenerateButton from './components/GenerateButton';
import ImageDisplay from './components/ImageDisplay';
import HistoryPanel from './components/HistoryPanel';
import AspectRatioSelector from './components/AspectRatioSelector';
import StyleSelector, { StyleParams } from './components/StyleSelector';
import { generateSketchFromText } from './services/geminiService';

const aspectRatios = ['9:16', '16:9', '1:1', '4:3', '9:21'];
const styles = ['彩色铅笔', '铅笔', '木炭'];

export interface HistoryEntry {
  id: number;
  inputText: string;
  sketchTitle: string;
  imageUrl: string;
  aspectRatio: string;
  style: string;
  styleParams: StyleParams;
}

const defaultStyleParams: StyleParams = {
  lineWeight: '常规',
  saturation: '中等',
};

function App() {
  const [inputText, setInputText] = useState('');
  const [sketchTitle, setSketchTitle] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>(aspectRatios[0]);
  const [selectedStyle, setSelectedStyle] = useState<string>(styles[0]);
  const [styleParams, setStyleParams] = useState<StyleParams>(defaultStyleParams);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('sketchHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sketchHistory', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  }, [history]);

  const handleGenerate = async () => {
    if (!inputText.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const imageUrl = await generateSketchFromText(inputText, sketchTitle, selectedAspectRatio, selectedStyle, styleParams);
      setGeneratedImage(imageUrl);

      // Add to history
      const newEntry: HistoryEntry = {
        id: Date.now(),
        inputText,
        sketchTitle,
        imageUrl,
        aspectRatio: selectedAspectRatio,
        style: selectedStyle,
        styleParams,
      };
      setHistory(prevHistory => [newEntry, ...prevHistory]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发生了未知错误。';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setInputText(entry.inputText);
    setSketchTitle(entry.sketchTitle);
    setGeneratedImage(entry.imageUrl);
    setSelectedAspectRatio(entry.aspectRatio);
    setSelectedStyle(entry.style);
    setStyleParams(entry.styleParams || defaultStyleParams); // Restore params with fallback
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Left Panel: Input */}
          <div className="lg:w-1/2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-700">您的文本</h2>
              <p className="text-sm text-slate-500 mt-1">输入您想要可视化的文本、内容或想法。</p>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <TextInput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如：一个团队正在合作一个项目，其中一个人灵光一闪..."
              />
               <TitleInput
                value={sketchTitle}
                onChange={(e) => setSketchTitle(e.target.value)}
                placeholder="为您的草图添加一个标题"
              />
              <StyleSelector
                styles={styles}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                styleParams={styleParams}
                onParamsChange={setStyleParams}
              />
              <AspectRatioSelector
                ratios={aspectRatios}
                selectedRatio={selectedAspectRatio}
                onRatioChange={setSelectedAspectRatio}
              />
            </div>
            <div className="p-6 border-t border-slate-200">
              <GenerateButton onClick={handleGenerate} isLoading={isLoading} />
            </div>
          </div>

          {/* Right Panel: Output */}
          <div className="lg:w-1/2 flex flex-col">
            <ImageDisplay
              image={generatedImage}
              isLoading={isLoading}
              error={error}
              sketchTitle={sketchTitle}
              onTitleChange={setSketchTitle}
            />
          </div>
        </div>
        
        <HistoryPanel
          history={history}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
        />

      </main>
      <footer className="text-center p-4 text-xs text-slate-400">
        <p>由 Gemini API 强力驱动。专为概念可视化设计。</p>
      </footer>
    </div>
  );
}

export default App;
