/**
 * Formula weightage utility functions for marks prediction
 */

/**
 * Get component weights based on subject code
 * @param subjectCode - The subject code
 * @returns Record of component weights
 */
export function getFormulaWeightage(subjectCode: string): Record<string, number> {
  // Python Programming
  if (subjectCode === 'BSCCS1001') {
    return {
      gaa1: 10, // GAA1 (Objective assignments) - 10%
      gaa2: 10, // GAA2 (Programming assignments) - 10%
      quiz1: 10, // Quiz 1 - 10%
      pe1: 25, // Best Programming Exam - 25% (assuming PE1 is higher)
      pe2: 15, // Min Programming Exam - 15% (assuming PE2 is lower)
      final: 40 // Final Exam - 40%
    };
  }
  
  // Statistics courses
  else if (subjectCode === 'BSCCS1002' || subjectCode === 'BSCCS1007') {
    return {
      gaa: 10, // GAA - 10%
      quiz1: 20, // Quiz 1 - 20% (assuming Quiz 1 is used)
      quiz2: 30, // Quiz 2 - 30% (assuming both Quiz 1 and Quiz 2 are used)
      final: 40 // Final Exam - 40%
    };
  }
  
  // Standard courses (Mathematics, Computational Thinking, etc.)
  else {
    return {
      gaa: 10, // GAA - 10%
      quiz1: 20, // Quiz 1 - 20% (assuming Quiz 1 is used)
      quiz2: 30, // Quiz 2 - 30% (assuming both Quiz 1 and Quiz 2 are used)
      final: 40 // Final Exam - 40%
    };
  }
}

/**
 * Calculate the total achieved score based on formula weightage
 * @param components - Input components with values
 * @param weightage - Weightage of each component
 * @returns Total achieved score
 */
export function calculateAchievedScore(
  components: Record<string, number>,
  weightage: Record<string, number>
): number {
  let totalScore = 0;
  
  // Iterate through components and apply weightage
  Object.keys(components).forEach(key => {
    if (weightage[key]) {
      totalScore += (components[key] * weightage[key]) / 100;
    }
  });
  
  return totalScore;
}

/**
 * Get the description of formula for a particular subject
 * @param subjectCode - The subject code
 * @returns Formula description
 */
export function getFormulaDescription(subjectCode: string): string {
  // Python Programming
  if (subjectCode === 'BSCCS1001') {
    return 'T = 0.1×GAA1 + 0.1×GAA2 + 0.1×Qz1 + 0.4×F + 0.25×max(PE1, PE2) + 0.15×min(PE1, PE2)';
  }
  
  // Statistics courses and standard courses
  else {
    return 'T = 0.1×GAA + max(0.6×F + 0.2×max(Qz1, Qz2), 0.4×F + 0.2×Qz1 + 0.3×Qz2)';
  }
} 