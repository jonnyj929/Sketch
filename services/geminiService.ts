
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY 环境变量未设置。");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

// This interface should ideally be shared from a types file, but defining it here is fine for this structure.
interface StyleParams {
  lineWeight?: '纤细' | '常规' | '粗重';
  saturation?: '低' | '中等' | '高';
}

const styleInstructions: { [key: string]: string } = {
  '彩色铅笔': '使用干净、极简的线条，并配合简单图标。整体感觉应像用彩色铅笔在白板或笔记本上绘制。',
  '铅笔': '使用干净、极简的铅笔线条，营造出素描草图的感觉，主要使用灰色和黑色调。',
  '木炭': '使用富有表现力的木炭笔触，营造出强烈的明暗对比和戏剧性效果，适合情感丰富的草图。',
};

function getStyleParamInstructions(styleParams: StyleParams): string {
  const instructions: string[] = [];

  if (styleParams.lineWeight && styleParams.lineWeight !== '常规') {
    const weightMap = {
      '纤细': '使用纤细、轻盈的线条。',
      '粗重': '使用粗重、有力的线条。',
    };
    instructions.push(weightMap[styleParams.lineWeight as keyof typeof weightMap]);
  }

  if (styleParams.saturation && styleParams.saturation !== '中等') {
    const saturationMap = {
      '低': '颜色饱和度应较低，呈现柔和、褪色的效果。',
      '高': '颜色饱和度应较高，色彩鲜艳明亮。',
    };
    instructions.push(saturationMap[styleParams.saturation as keyof typeof saturationMap]);
  }

  return instructions.filter(Boolean).join(' ');
}

export async function generateSketchFromText(text: string, title: string, aspectRatio: string, style: string, styleParams: StyleParams): Promise<string> {
  const visualStyle = styleInstructions[style] || styleInstructions['彩色铅笔'];
  const paramInstructions = getStyleParamInstructions(styleParams);
  try {
    const titleInstruction = title.trim()
      ? `使用提供的标题 "${title.trim()}" 作为这张图清晰、简短的主题，并以大号字体展示，作为视觉焦点。`
      : '从文本中提取一个清晰、简短的主题，并以大号字体展示，作为视觉焦点。';

    const contentToVisualize = title.trim()
      ? `标题：${title.trim()}\n内容：${text}`
      : text;

    const prompt = `
# 角色
你是一位专业的视觉笔记艺术家和信息设计师，并且是一位精通简体中文的书法家。

# 任务
根据提供的文本，创作一幅清晰、简洁、手绘风格的视觉笔记草图。图像应具有创意手绘字体、纤细圆润的线条、富有冲击力的艺术构图，并达到前卫、极简、高端、杰作的品质。目标是帮助读者快速掌握文本的内在逻辑和核心要点。

# 步骤
1. 阅读文本，提取“关键节点”（角色/行动/结果/条件），并按过程或因果关系进行组织。
2. ${titleInstruction} 一张草图不要包含太多信息，避免视觉混乱。
3. 用简洁的简体中文关键词命名其他关键节点。
4. 根据 #核心要求 创建图像。
5. 让结果更简洁。
6. 填充画布以确保视觉平衡，不要过度居中内容。
7. **最终检查**: 在输出最终图像前，仔细检查所有中文字符的准确性。确保没有错别字、漏字或任何形式的书写错误。这是最重要的步骤。

# 核心要求
- **视觉风格**: 严格遵循视觉笔记的手绘风格。所有元素都应具有手写感。${visualStyle} ${paramInstructions}
- **字体与文字**: 这是一个绝对要求：所有文字必须是清晰、准确、美观的简体中文。
  - **准确性**: 严格禁止任何错别字、变形字或无法辨认的字符。每个汉字都必须符合标准的简体中文写法。
  - **风格**: 使用一种简洁、艺术感强的手写字体，与整体插图风格和谐统一。
  - **可读性**: 确保文字清晰易读。
- **构图与布局**: 整体布局必须清晰、简洁、有逻辑，能自然地引导读者的视线。布局不一定严格遵循从左到右或从上到下的顺序，可以自由排布元素，元素间留有足够空间。严格避免箭头交叉，确保视觉不杂乱。
- **颜色**: 主要素描线条使用黑色以确保清晰度。可以使用其他颜色（如红色用于强调，绿色或黄色用于装饰），但整体保持简洁。背景必须是高对比度的纯白色。请勿使用渐变、阴影或照片/3D/写实风格。
- **尺寸**: 以 ${aspectRatio} 的宽高比生成图像。

# 输出目标
生成一幅极简手绘草图，清晰地解释原文的核心思想，让任何看到这张图的人都能快速理解其主要内容。

# 待可视化的原文
"${contentToVisualize}"
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });
    
    // Find the image part in the response
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      const base64Data = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      return `data:${mimeType};base64,${base64Data}`;
    } else {
      // Check for a text response, which might indicate a safety rejection or other issue.
      const textResponse = response.text?.trim();
      if (textResponse) {
        throw new Error(`模型无法生成图像并返回以下消息： "${textResponse}"`);
      }
      throw new Error("AI 模型未返回图像。请尝试换一种说法。");
    }
  } catch (error) {
    console.error("Error generating sketch with Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.toLowerCase().includes('failed to fetch')) {
            throw new Error("网络错误：无法连接到 AI 服务。请检查您的网络连接。");
        }
        // Re-throw specific, user-friendly errors from the try block or other Gemini errors.
        throw error;
    }
    // Fallback for non-Error objects
    throw new Error("与 Gemini API 通信时发生意外错误。");
  }
}
