
import React from 'react';
import { PhotoIcon } from './icons/PhotoIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
  sketchTitle: string;
  onTitleChange: (newTitle: string) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading, error, sketchTitle, onTitleChange }) => {
  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = 'sketch.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Placeholder = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
      <PhotoIcon className="w-16 h-16 text-slate-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-600">您的草图将在此处显示</h3>
      <p className="text-sm text-slate-500 mt-1">
        提供文本并点击生成后，生成的草图将在此处显示。
      </p>
    </div>
  );

  const Loading = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-100 rounded-2xl">
      <SpinnerIcon className="w-16 h-16 text-blue-600 animate-spin mb-4" />
      <h3 className="text-lg font-semibold text-slate-600">正在绘制您的想法...</h3>
      <p className="text-sm text-slate-500 mt-1">这可能需要一些时间。</p>
    </div>
  );
  
  const ErrorDisplay = () => {
    const getErrorInfo = () => {
      if (!error) {
        return {
          title: '错误',
          message: '发生了未知错误。',
          showRawError: false
        };
      }
  
      const lowerCaseError = error.toLowerCase();
  
      if (lowerCaseError.includes("couldn't generate an image") || lowerCaseError.includes("safety") || lowerCaseError.includes("安全")) {
        return {
          title: "内容合规性问题",
          message: "AI 无法根据您的提示创建图像，这可能是由于安全准则所致。请尝试换一种说法。",
          showRawError: false,
        };
      }
      
      if (lowerCaseError.includes("network error") || lowerCaseError.includes("failed to fetch") || lowerCaseError.includes("网络")) {
        return {
          title: "网络连接错误",
          message: "无法连接到草图服务。请检查您的网络连接并重试。",
          showRawError: false,
        };
      }
  
      if (lowerCaseError.includes("did not return an image") || lowerCaseError.includes("未返回图像")) {
        return {
            title: "图像生成失败",
            message: "AI 未能针对此提示返回有效图像。请尝试稍微修改您的文本后重试。",
            showRawError: true,
        }
      }
  
      return {
        title: "哎呀！出错了。",
        message: "发生意外错误。如果问题仍然存在，请查看以下详细信息。",
        showRawError: true,
      };
    };
  
    const { title, message, showRawError } = getErrorInfo();

    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-red-50 rounded-2xl border-2 border-dashed border-red-300">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-700">{title}</h3>
        <p className="text-sm text-red-600 mt-1 max-w-md">{message}</p>
        {showRawError && (
          <p className="text-xs text-red-500 mt-4 bg-red-100 p-2 rounded-md font-mono max-w-full overflow-x-auto">
            {error}
          </p>
        )}
      </div>
    );
  };


  return (
    <div className="w-full h-full flex items-center justify-center">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorDisplay />
      ) : image ? (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 w-full flex flex-col gap-4">
            <input
              type="text"
              value={sketchTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="无标题草图"
              className="w-full text-xl font-bold text-slate-800 text-center bg-transparent focus:bg-slate-100 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-label="编辑草图标题"
            />
            <img
                src={image}
                alt="生成的草图"
                className="w-full h-auto object-contain rounded-lg"
            />
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label="下载草图"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>下载草图</span>
            </button>
        </div>
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

export default ImageDisplay;
