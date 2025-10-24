// src/services/aiAnalysis.js
export async function analyzeImageWithAI(localImagePath) {
  // TODO: заменить на реальный вызов Perfect Corp API.
  // Пока возвращаем фейковые метрики для разработки фронта.
  return {
    acne: Math.floor(Math.random() * 100),
    wrinkles: Math.floor(Math.random() * 100),
    redness: Math.floor(Math.random() * 100),
    darkSpots: Math.floor(Math.random() * 100),
    pores: Math.floor(Math.random() * 100),
    summary: "Mild redness on cheeks; visible pores in T-zone; signs of dehydration."
  };
}
