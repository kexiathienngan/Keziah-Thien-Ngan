import { GoogleGenAI, Type } from "@google/genai";
import { ChallengeData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const JSON_OUTPUT_INSTRUCTIONS = `Quan trọng: Chỉ trả về một đối tượng JSON hợp lệ, không có văn bản giải thích nào khác.`;

export async function getVerseAndCreateChallenge(userInput: string, difficultyLevel: number = 1): Promise<ChallengeData> {
  try {
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        verseText: {
          type: Type.STRING,
          description: "Toàn bộ văn bản của câu Kinh Thánh được yêu cầu, theo bản dịch Phổ Thông.",
        },
        reference: {
            type: Type.STRING,
            description: "Địa chỉ tham chiếu của câu Kinh Thánh (ví dụ: Giăng 3:16)."
        },
        challenge: {
          type: Type.STRING,
          description: "Câu Kinh Thánh đã được sửa đổi với các từ khóa được thay thế bằng '[...]'.",
        },
        answers: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "Một mảng các từ đã bị xóa, theo thứ tự xuất hiện.",
        },
        orderedChunks: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "Một mảng các cụm từ logic của câu Kinh Thánh, theo đúng thứ tự.",
        },
        multipleChoiceOptions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              distractors: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["answer", "distractors"]
          },
          description: "Một mảng các đối tượng cho game trắc nghiệm. Mỗi đối tượng chứa một 'answer' đúng và một mảng 2-3 'distractors' (từ gây nhiễu)."
        },
        firstLetters: {
          type: Type.STRING,
          description: "Một chuỗi chứa chữ cái đầu của mỗi từ trong câu gốc, ví dụ: 'V Đ C T y t t g...'"
        }
      },
      required: ["verseText", "reference", "challenge", "answers", "orderedChunks", "multipleChoiceOptions", "firstLetters"],
    };
    
    const difficultyMap: {[key: number]: string} = {
      1: "khoảng 25%", // easy
      2: "khoảng 40%", // medium
      3: "khoảng 60%", // hard
    }
    const blankPercentage = difficultyMap[difficultyLevel] || "khoảng 25%";

    const prompt = `
      Bạn là một trợ lý tạo trò chơi học thuộc Kinh Thánh.
      Người dùng đã yêu cầu câu gốc liên quan đến: "${userInput}".
      
      Nhiệm vụ của bạn:
      1.  **Tìm câu gốc**: Tìm câu Kinh Thánh phù hợp nhất, sử dụng bản dịch Tiếng Việt Phổ Thông.
      2.  **Tạo thử thách Điền từ**: Xóa khoảng ${blankPercentage} số từ quan trọng (danh từ, động từ) và thay bằng "[...]".
      3.  **Tạo dữ liệu Sắp xếp câu**: Chia nhỏ câu gốc thành 5-8 cụm từ logic, giữ nguyên thứ tự.
      4.  **Tạo dữ liệu Trắc nghiệm**: Với mỗi từ đã bị xóa trong 'answers', tạo một đối tượng chứa từ đúng ('answer') và một mảng 2-3 từ gây nhiễu hợp lý ('distractors'). Từ gây nhiễu có thể là từ đồng nghĩa, trái nghĩa, hoặc có vẻ liên quan.
      5.  **Tạo dữ liệu Gõ chữ cái đầu**: Tạo một chuỗi chứa chữ cái đầu của mỗi từ trong câu gốc, cách nhau bằng khoảng trắng.
      6.  **Trả về JSON**: Trả về kết quả dưới dạng một đối tượng JSON duy nhất chứa: verseText, reference, challenge, answers, orderedChunks, multipleChoiceOptions, và firstLetters.
      
      ${JSON_OUTPUT_INSTRUCTIONS}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    // Basic validation
    if (data.answers.length !== data.multipleChoiceOptions.length) {
      console.warn("Mismatch between answers and multiple choice options length.");
      // Handle this mismatch, maybe by generating simple distractors on the fly or failing gracefully
    }

    return {
      originalVerse: data.verseText,
      reference: data.reference,
      challengeTemplate: data.challenge.split('[...]'),
      answers: data.answers,
      orderedChunks: data.orderedChunks,
      multipleChoiceOptions: data.multipleChoiceOptions,
      firstLetters: data.firstLetters,
    };
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    throw new Error("Rất tiếc, tôi không thể tìm thấy câu gốc đó. Vui lòng thử lại với một địa chỉ hoặc chủ đề khác.");
  }
}