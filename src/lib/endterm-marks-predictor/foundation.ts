// Define constants for grade thresholds
export const gradeThresholds = [
  { grade: 'S', min: 90, max: 100, points: 10 },
  { grade: 'A', min: 80, max: 89, points: 9 },
  { grade: 'B', min: 70, max: 79, points: 8 },
  { grade: 'C', min: 60, max: 69, points: 7 },
  { grade: 'D', min: 50, max: 59, points: 6 },
  { grade: 'E', min: 40, max: 49, points: 4 }
];

// Foundation level subjects
export const foundationSubjects = [
  { value: 'BSCCS1004', label: 'Mathematics for Data Science 1', code: 'BSCCS1004' },
  { value: 'BSCCS1005', label: 'English 1', code: 'BSCCS1005' },
  { value: 'BSCCS1003', label: 'Computational Thinking', code: 'BSCCS1003' },
  { value: 'BSCCS1002', label: 'Statistics for Data Science 1', code: 'BSCCS1002' },
  { value: 'BSCCS1001', label: 'Intro to Python Programming', code: 'BSCCS1001' },
  { value: 'BSCCS1006', label: 'Mathematics for Data Science 2', code: 'BSCCS1006' },
  { value: 'BSCCS1007', label: 'Statistics for Data Science 2', code: 'BSCCS1007' },
  { value: 'BSCCS1008', label: 'English 2', code: 'BSCCS1008' }
];

// Input interface for prediction
export interface FoundationPredictorInput {
  subject: string;
  gaa?: number;
  gaa1?: number;
  gaa2?: number;
  quiz1?: number;
  quiz2?: number;
  pe1?: number;
  pe2?: number;
  extraActivityBonus?: number;
  targetGrade?: string;
  [key: string]: string | number | undefined;
}

// Result interface for prediction
export interface PredictionResult {
  grade: string;
  required: number;
  achievable: boolean;
}

/**
 * Get required fields based on selected subject
 */
export function getRequiredFields(subject: string): string[] {
  if (subject === 'BSCCS1001') { // Python
    return ['gaa1', 'gaa2', 'quiz1', 'pe1', 'pe2'];
  } else if (subject === 'BSCCS1002' || subject === 'BSCCS1007') { // Stats 1 or Stats 2
    return ['gaa', 'quiz1', 'quiz2'];
  } else {
    return ['gaa', 'quiz1', 'quiz2'];
  }
}

/**
 * Check eligibility for Mathematics for Data Science 1, English 1, Computational Thinking, etc.
 */
function checkStandardEligibility(gaa: number, quiz1?: number, quiz2?: number): { eligible: boolean, reason: string } {
  // Check if best 5 out of first 7 weeks' GAA >= 40 
  // (we're simplifying here to just check if GAA >= 40)
  if (gaa < 40) {
    return { eligible: false, reason: 'Best 5 out of first 7 weeks\' GAA must be at least 40/100' };
  }
  
  // Check if attended at least one quiz
  if ((quiz1 === 0 || quiz1 === undefined) && (quiz2 === 0 || quiz2 === undefined)) {
    return { eligible: false, reason: 'Must attend at least one quiz' };
  }
  
  return { eligible: true, reason: '' };
}

/**
 * Check eligibility for Python Programming
 */
function checkPythonEligibility(gaa1: number, gaa2: number, quiz1?: number, pe1?: number, pe2?: number): { eligible: boolean, reason: string } {
  // Check if best 5 out of first 7 weeks' assessments (average of objective and programming) >= 40
  const avgAssessments = (gaa1 + gaa2) / 2;
  if (avgAssessments < 40) {
    return { eligible: false, reason: 'Average of first 7 weeks\' assessments must be at least 40/100' };
  }
  
  // Check if attended at least one quiz
  if (quiz1 === 0 || quiz1 === undefined) {
    return { eligible: false, reason: 'Must attend Quiz 1' };
  }
  
  // Check if attempted at least one of the programming exams
  if ((pe1 === 0 || pe1 === undefined) && (pe2 === 0 || pe2 === undefined)) {
    return { eligible: false, reason: 'Must attempt at least one programming exam' };
  }
  
  return { eligible: true, reason: '' };
}

/**
 * Calculate required final exam score for Mathematics for Data Science 1, English 1, Computational Thinking, etc.
 */
function calculateStandard(gaa: number, quiz1: number, quiz2: number, targetScore: number): number {
  // Base formula: T = 0.1×GAA + max(0.6×F + 0.2×max(Qz1, Qz2), 0.4×F + 0.2×Qz1 + 0.3×Qz2)
  const maxQuiz = Math.max(quiz1, quiz2);
  const gaaComponent = 0.1 * gaa;
  
  // To solve for F (final exam), we need to determine which of the max() formulas would give a better result
  // Calculate the minimum required F for both formulas and take the smaller one
  
  // Formula 1: T = 0.1×GAA + 0.6×F + 0.2×max(Qz1, Qz2)
  // T - 0.1×GAA - 0.2×max(Qz1, Qz2) = 0.6×F
  // F = (T - 0.1×GAA - 0.2×max(Qz1, Qz2)) / 0.6
  const formula1 = (targetScore - gaaComponent - 0.2 * maxQuiz) / 0.6;
  
  // Formula 2: T = 0.1×GAA + 0.4×F + 0.2×Qz1 + 0.3×Qz2
  // T - 0.1×GAA - 0.2×Qz1 - 0.3×Qz2 = 0.4×F
  // F = (T - 0.1×GAA - 0.2×Qz1 - 0.3×Qz2) / 0.4
  const formula2 = (targetScore - gaaComponent - 0.2 * quiz1 - 0.3 * quiz2) / 0.4;
  
  // Take the minimum of the two required scores
  // (the formula that requires a lower final exam score)
  return Math.min(formula1, formula2);
}

/**
 * Calculate required final exam score for Statistics for Data Science 1
 */
function calculateStatistics(gaa: number, quiz1: number, quiz2: number, targetScore: number): number {
  // For Statistics: T = 0.1×GAA + max(0.6×F + 0.2×max(Qz1, Qz2), 0.4×F + 0.2×Qz1 + 0.3×Qz2)
  // Same as standard calculation, no bonus
  
  const maxQuiz = Math.max(quiz1, quiz2);
  const gaaComponent = 0.1 * gaa;
  
  // Formula 1
  const formula1 = (targetScore - gaaComponent - 0.2 * maxQuiz) / 0.6;
  
  // Formula 2
  const formula2 = (targetScore - gaaComponent - 0.2 * quiz1 - 0.3 * quiz2) / 0.4;
  
  return Math.min(formula1, formula2);
}

/**
 * Calculate required final exam score for Python Programming
 */
function calculatePython(gaa1: number, gaa2: number, quiz1: number, pe1: number, pe2: number, targetScore: number): number {
  // For Python: T = 0.1×GAA1 + 0.1×GAA2 + 0.1×Qz1 + 0.4×F + 0.25×max(PE1, PE2) + 0.15×min(PE1, PE2)
  
  const gaa1Component = 0.1 * gaa1;
  const gaa2Component = 0.1 * gaa2;
  const quiz1Component = 0.1 * quiz1;
  const maxPE = Math.max(pe1, pe2);
  const minPE = Math.min(pe1, pe2);
  const peMaxComponent = 0.25 * maxPE;
  const peMinComponent = 0.15 * minPE;
  
  // T - 0.1×GAA1 - 0.1×GAA2 - 0.1×Qz1 - 0.25×max(PE1, PE2) - 0.15×min(PE1, PE2) = 0.4×F
  // F = (T - 0.1×GAA1 - 0.1×GAA2 - 0.1×Qz1 - 0.25×max(PE1, PE2) - 0.15×min(PE1, PE2)) / 0.4
  
  return (targetScore - gaa1Component - gaa2Component - quiz1Component - peMaxComponent - peMinComponent) / 0.4;
}

/**
 * Get the formula as a string for display purposes
 */
export function getFormula(subject: string): string {
  if (subject === 'BSCCS1001') { // Python
    return 'T = 0.1×GAA1 + 0.1×GAA2 + 0.1×Qz1 + 0.4×F + 0.25×max(PE1, PE2) + 0.15×min(PE1, PE2)';
  } else if (subject === 'BSCCS1002' || subject === 'BSCCS1007') { // Stats 1 or Stats 2
    return 'T = 0.1×GAA + max(0.6×F + 0.2×max(Qz1, Qz2), 0.4×F + 0.2×Qz1 + 0.3×Qz2)';
  } else {
    return 'T = 0.1×GAA + max(0.6×F + 0.2×max(Qz1, Qz2), 0.4×F + 0.2×Qz1 + 0.3×Qz2)';
  }
}

/**
 * Calculate predictions for all grades
 */
export function calculatePredictions(input: FoundationPredictorInput): PredictionResult[] {
  const { subject, gaa = 0, gaa1 = 0, gaa2 = 0, quiz1 = 0, quiz2 = 0, pe1 = 0, pe2 = 0 } = input;
  
  let eligibility = { eligible: true, reason: '' };
  
  // Check eligibility based on subject
  if (subject === 'BSCCS1001') { // Python
    eligibility = checkPythonEligibility(gaa1, gaa2, quiz1, pe1, pe2);
  } else {
    eligibility = checkStandardEligibility(gaa, quiz1, quiz2);
  }
  
  // If not eligible, mark all grades as not achievable
  if (!eligibility.eligible) {
    return gradeThresholds.map(grade => ({
      grade: grade.grade,
      required: 0,
      achievable: false
    }));
  }
  
  // Calculate required score for each grade
  return gradeThresholds.map(grade => {
    const targetScore = grade.min; // Target the minimum score needed for this grade
    let requiredFinalScore = 0;
    
    if (subject === 'BSCCS1001') { // Python
      requiredFinalScore = calculatePython(gaa1, gaa2, quiz1, pe1, pe2, targetScore);
    } else if (subject === 'BSCCS1002' || subject === 'BSCCS1007') { // Stats 1 or Stats 2
      requiredFinalScore = calculateStatistics(gaa, quiz1, quiz2, targetScore);
    } else { // Standard calculation for other subjects
      requiredFinalScore = calculateStandard(gaa, quiz1, quiz2, targetScore);
    }
    
    // Round to nearest integer and cap between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(requiredFinalScore)));
    
    // Check if the required score is achievable (less than or equal to 100)
    const achievable = requiredFinalScore <= 100;
    
    return {
      grade: grade.grade,
      required: finalScore,
      achievable
    };
  });
} 