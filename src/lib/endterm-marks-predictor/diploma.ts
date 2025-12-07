// Define constants for grade thresholds (same as foundation)
export const gradeThresholds = [
  { grade: 'S', min: 90, max: 100, points: 10 },
  { grade: 'A', min: 80, max: 89, points: 9 },
  { grade: 'B', min: 70, max: 79, points: 8 },
  { grade: 'C', min: 60, max: 69, points: 7 },
  { grade: 'D', min: 50, max: 59, points: 6 },
  { grade: 'E', min: 40, max: 49, points: 4 }
];

// Diploma level subjects
export const diplomaSubjects = [
  { value: 'MLF', label: 'Machine Learning Foundations', code: 'MLF' },
  { value: 'MLT', label: 'Machine Learning Techniques', code: 'MLT' },
  { value: 'MLP', label: 'Machine Learning Practice', code: 'MLP' },
  { value: 'BDM', label: 'Business Data Management', code: 'BDM' },
  { value: 'BA', label: 'Business Analytics', code: 'BA' },
  { value: 'TDS', label: 'Tools in Data Science', code: 'TDS' },
  { value: 'JAVA', label: 'Programming Concepts Using Java', code: 'JAVA' },
  { value: 'DBMS', label: 'Database Management System', code: 'DBMS' },
  { value: 'AD1', label: 'Application Development - 1', code: 'AD1' },
  { value: 'PDSA', label: 'Programming Data Structures and Algorithms', code: 'PDSA' },
  { value: 'SC', label: 'System Commands', code: 'SC' },
  { value: 'AD2', label: 'Application Development - 2', code: 'AD2' }
];

// Input interface for prediction
export interface DiplomaPredictorInput {
  subject: string;
  gaa?: number;
  gaa1?: number;
  gaa2?: number;
  gaa3?: number;
  ga?: number;
  gla?: number;
  quiz1?: number;
  quiz2?: number;
  quiz?: number;
  ope1?: number;
  ope2?: number;
  ope?: number;
  oppe?: number;
  op?: number;
  npe1?: number;
  npe2?: number;
  pe1?: number;
  pe2?: number;
  roe?: number;
  roe1?: number;
  a?: number;
  p1?: number;
  p2?: number;
  bpt?: number;
  [key: string]: string | number | undefined;
}

// Result interface for prediction (same as foundation)
export interface PredictionResult {
  grade: string;
  required: number;
  achievable: boolean;
}

/**
 * Get required fields based on selected subject
 */
export function getRequiredFields(subject: string): string[] {
  switch (subject) {
    case 'MLF': // Machine Learning Foundations
      return ['gaa', 'quiz1', 'quiz2'];
    case 'MLT': // Machine Learning Techniques
      return ['gaa', 'quiz1', 'quiz2'];
    case 'MLP': // Machine Learning Practice
      return ['gaa', 'quiz1', 'ope1', 'ope2', 'npe1', 'npe2'];
    case 'BDM': // Business Data Management
      return ['ga', 'quiz2', 'roe'];
    case 'BA': // Business Analytics
      return ['a', 'quiz'];
    case 'TDS': // Tools in Data Science
      return ['gaa', 'roe1', 'p1', 'p2'];
    case 'JAVA': // Programming Concepts Using Java
      return ['gaa', 'quiz1', 'quiz2', 'oppe'];
    case 'DBMS': // Database Management System
      return ['gaa1', 'gaa2', 'gaa3', 'quiz1', 'quiz2', 'op'];
    case 'AD1': // Application Development - 1
    case 'AD2': // Application Development - 2 (same fields as AD1)
      return ['gla', 'ga', 'quiz1', 'quiz2'];
    case 'PDSA': // Programming Data Structures and Algorithms using Python
      return ['gaa1', 'gaa2', 'quiz1', 'pe1', 'pe2'];
    case 'SC': // System Commands
      return ['gaa', 'bpt', 'oppe'];
    default:
      return [];
  }
}

/**
 * Check eligibility based on course requirements
 */
function checkEligibility(input: DiplomaPredictorInput): { eligible: boolean, reason: string } {
  const { subject, gaa = 0, gaa1 = 0, gaa2 = 0, ga = 0, quiz1 = 0, quiz2 = 0, quiz = 0, a = 0 } = input;
  
  // Common eligibility rules for most courses
  let weeklyAssessmentAvg = 0;
  let hasAttendedQuiz = false;
  
  switch (subject) {
    case 'MLF':
    case 'MLT':
    case 'MLP':
    case 'JAVA':
    case 'SC':
      weeklyAssessmentAvg = gaa;
      hasAttendedQuiz = (quiz1 > 0 || quiz2 > 0);
      break;
    case 'PDSA':
      weeklyAssessmentAvg = (gaa1 + gaa2) / 2;
      hasAttendedQuiz = (quiz1 > 0);
      break;
    case 'DBMS':
      weeklyAssessmentAvg = gaa1;
      hasAttendedQuiz = (quiz1 > 0 || quiz2 > 0);
      break;
    case 'BDM':
      weeklyAssessmentAvg = ga;
      hasAttendedQuiz = (quiz2 > 0);
      break;
    case 'BA':
      weeklyAssessmentAvg = a;
      hasAttendedQuiz = (quiz > 0);
      break;
    case 'TDS':
      weeklyAssessmentAvg = gaa;
      hasAttendedQuiz = true; // No quiz mentioned in rules
      break;
    case 'AD1':
    case 'AD2':
      weeklyAssessmentAvg = ga;
      hasAttendedQuiz = (quiz1 > 0 || quiz2 > 0);
      break;
    default:
      return { eligible: false, reason: 'Unknown subject' };
  }
  
  // Check if weekly assessment average is at least 40/100
  if (weeklyAssessmentAvg < 40) {
    return { eligible: false, reason: 'Weekly assessment average must be at least 40/100' };
  }
  
  // Check if student has attended at least one quiz (if required)
  if (!hasAttendedQuiz) {
    return { eligible: false, reason: 'Must attend at least one quiz' };
  }
  
  return { eligible: true, reason: '' };
}

/**
 * Calculate required final exam score for Machine Learning Foundations
 */
function calculateMLF(gaa: number, quiz1: number, quiz2: number, targetScore: number): number {
  // T = 0.1×GAA + max(0.6×F + 0.2×max(Qz1, Qz2), 0.4×F + 0.2×Qz1 + 0.3×Qz2)
  // Same as standard formula in foundation courses
  
  const maxQuiz = Math.max(quiz1, quiz2);
  const gaaComponent = 0.1 * gaa;
  
  // Formula 1: T = 0.1×GAA + 0.6×F + 0.2×max(Qz1, Qz2)
  const formula1 = (targetScore - gaaComponent - 0.2 * maxQuiz) / 0.6;
  
  // Formula 2: T = 0.1×GAA + 0.4×F + 0.2×Qz1 + 0.3×Qz2
  const formula2 = (targetScore - gaaComponent - 0.2 * quiz1 - 0.3 * quiz2) / 0.4;
  
  return Math.min(formula1, formula2);
}

/**
 * Calculate required final exam score for Machine Learning Techniques
 */
function calculateMLT(gaa: number, quiz1: number, quiz2: number, targetScore: number): number {
  // T = 0.1×GAA + 0.4×F + max(0.25×Qz1 + 0.25×Qz2, 0.4×max(Qz1, Qz2))
  
  const gaaComponent = 0.1 * gaa;
  
  // Calculate the quiz component using max
  const quizComponent1 = 0.25 * quiz1 + 0.25 * quiz2;
  const quizComponent2 = 0.4 * Math.max(quiz1, quiz2);
  const quizComponent = Math.max(quizComponent1, quizComponent2);
  
  // T = 0.1×GAA + 0.4×F + quizComponent
  // T - 0.1×GAA - quizComponent = 0.4×F
  // F = (T - 0.1×GAA - quizComponent) / 0.4
  
  return (targetScore - gaaComponent - quizComponent) / 0.4;
}

/**
 * Calculate required final exam score for Machine Learning Practice
 */
function calculateMLP(gaa: number, quiz1: number, ope1: number, ope2: number, npe1: number, npe2: number, targetScore: number): number {
  // T = 0.1×GAA + 0.35×F + 0.20×OPE1 + 0.20×OPE2 + 0.15×Qz1 + NPE Bonus
  // NPE Bonus = 0.025×NPE1 + 0.025×NPE2
  
  const gaaComponent = 0.1 * gaa;
  const quiz1Component = 0.15 * quiz1;
  const ope1Component = 0.20 * ope1;
  const ope2Component = 0.20 * ope2;
  const npeBonus = 0.025 * npe1 + 0.025 * npe2;
  
  // T = 0.1×GAA + 0.35×F + 0.20×OPE1 + 0.20×OPE2 + 0.15×Qz1 + NPE Bonus
  // T - 0.1×GAA - 0.20×OPE1 - 0.20×OPE2 - 0.15×Qz1 - NPE Bonus = 0.35×F
  // F = (T - 0.1×GAA - 0.20×OPE1 - 0.20×OPE2 - 0.15×Qz1 - NPE Bonus) / 0.35
  
  return (targetScore - gaaComponent - ope1Component - ope2Component - quiz1Component - npeBonus) / 0.35;
}

/**
 * Calculate required final exam score for Business Data Management
 */
function calculateBDM(ga: number, quiz2: number, roe: number, targetScore: number): number {
  // T = 0.3×GA + 0.20×Qz2 + 0.2×ROE + 0.3×F
  
  const gaComponent = 0.3 * ga;
  const quiz2Component = 0.2 * quiz2;
  const roeComponent = 0.2 * roe;
  
  // T = 0.3×GA + 0.20×Qz2 + 0.2×ROE + 0.3×F
  // T - 0.3×GA - 0.20×Qz2 - 0.2×ROE = 0.3×F
  // F = (T - 0.3×GA - 0.20×Qz2 - 0.2×ROE) / 0.3
  
  return (targetScore - gaComponent - quiz2Component - roeComponent) / 0.3;
}

/**
 * Calculate required final exam score for Business Analytics
 */
function calculateBA(a: number, quiz: number, targetScore: number): number {
  // T = 0.3×A + 0.2×Qz + 0.5×F
  
  const aComponent = 0.3 * a;
  const quizComponent = 0.2 * quiz;
  
  // T = 0.3×A + 0.2×Qz + 0.5×F
  // T - 0.3×A - 0.2×Qz = 0.5×F
  // F = (T - 0.3×A - 0.2×Qz) / 0.5
  
  return (targetScore - aComponent - quizComponent) / 0.5;
}

/**
 * Calculate required final exam score for Tools in Data Science
 */
function calculateTDS(gaa: number, roe1: number, p1: number, p2: number, targetScore: number): number {
  // T = 0.15×GAA + 0.2×ROE1 + 0.2×P1 + 0.2×P2 + 0.25×F
  
  const gaaComponent = 0.15 * gaa;
  const roe1Component = 0.2 * roe1;
  const p1Component = 0.2 * p1;
  const p2Component = 0.2 * p2;
  
  // T = 0.15×GAA + 0.2×ROE1 + 0.2×P1 + 0.2×P2 + 0.25×F
  // T - 0.15×GAA - 0.2×ROE1 - 0.2×P1 - 0.2×P2 = 0.25×F
  // F = (T - 0.15×GAA - 0.2×ROE1 - 0.2×P1 - 0.2×P2) / 0.25
  
  return (targetScore - gaaComponent - roe1Component - p1Component - p2Component) / 0.25;
}

/**
 * Calculate required final exam score for Programming Concepts Using Java
 */
function calculateJAVA(gaa: number, quiz1: number, quiz2: number, oppe: number, targetScore: number): number {
  // T = 0.1×GAA + 0.4×F + 0.2×OPPE + max(0.2×max(Qz1, Qz2), 0.15×Qz1 + 0.25×Qz2)
  
  const gaaComponent = 0.1 * gaa;
  const oppeComponent = 0.2 * oppe;
  
  // Calculate the quiz component using max
  const quizComponent1 = 0.2 * Math.max(quiz1, quiz2);
  const quizComponent2 = 0.15 * quiz1 + 0.25 * quiz2;
  const quizComponent = Math.max(quizComponent1, quizComponent2);
  
  // T = 0.1×GAA + 0.4×F + 0.2×OPPE + quizComponent
  // T - 0.1×GAA - 0.2×OPPE - quizComponent = 0.4×F
  // F = (T - 0.1×GAA - 0.2×OPPE - quizComponent) / 0.4
  
  return (targetScore - gaaComponent - oppeComponent - quizComponent) / 0.4;
}

/**
 * Calculate required final exam score for Database Management System
 */
function calculateDBMS(gaa1: number, gaa2: number, gaa3: number, quiz1: number, quiz2: number, op: number, targetScore: number): number {
  // T = 0.04×GAA1 + 0.03×GAA2 + 0.03×GAA3 + 0.2×OP + max(0.45×F + 0.15×max(Qz1, Qz2), 0.4×F + 0.10×Qz1 + 0.20×Qz2)
  
  const gaa1Component = 0.04 * gaa1;
  const gaa2Component = 0.03 * gaa2;
  const gaa3Component = 0.03 * gaa3;
  const opComponent = 0.2 * op;
  const maxQuiz = Math.max(quiz1, quiz2);
  
  // To solve for F, need to determine which max formula gives the lower required score
  
  // Formula 1: T = 0.04×GAA1 + 0.03×GAA2 + 0.03×GAA3 + 0.2×OP + 0.45×F + 0.15×max(Qz1, Qz2)
  // T - 0.04×GAA1 - 0.03×GAA2 - 0.03×GAA3 - 0.2×OP - 0.15×max(Qz1, Qz2) = 0.45×F
  // F = (T - 0.04×GAA1 - 0.03×GAA2 - 0.03×GAA3 - 0.2×OP - 0.15×max(Qz1, Qz2)) / 0.45
  const formula1 = (targetScore - gaa1Component - gaa2Component - gaa3Component - opComponent - 0.15 * maxQuiz) / 0.45;
  
  // Formula 2: T = 0.04×GAA1 + 0.03×GAA2 + 0.03×GAA3 + 0.2×OP + 0.4×F + 0.10×Qz1 + 0.20×Qz2
  // T - 0.04×GAA1 - 0.03×GAA2 - 0.03×GAA3 - 0.2×OP - 0.10×Qz1 - 0.20×Qz2 = 0.4×F
  // F = (T - 0.04×GAA1 - 0.03×GAA2 - 0.03×GAA3 - 0.2×OP - 0.10×Qz1 - 0.20×Qz2) / 0.4
  const formula2 = (targetScore - gaa1Component - gaa2Component - gaa3Component - opComponent - 0.10 * quiz1 - 0.20 * quiz2) / 0.4;
  
  return Math.min(formula1, formula2);
}

/**
 * Calculate required final exam score for Application Development courses (AD1 & AD2)
 */
function calculateAD(gla: number, ga: number, quiz1: number, quiz2: number, targetScore: number): number {
  // T = 0.15×GLA + 0.05×GA + max(0.35×F + 0.25×Qz1 + 0.3×Qz2, 0.4×F + 0.3×max(Qz1, Qz2))
  
  const glaComponent = 0.15 * gla;
  const gaComponent = 0.05 * ga;
  const maxQuiz = Math.max(quiz1, quiz2);
  
  // Formula 1: T = 0.15×GLA + 0.05×GA + 0.35×F + 0.25×Qz1 + 0.3×Qz2
  // T - 0.15×GLA - 0.05×GA - 0.25×Qz1 - 0.3×Qz2 = 0.35×F
  // F = (T - 0.15×GLA - 0.05×GA - 0.25×Qz1 - 0.3×Qz2) / 0.35
  const formula1 = (targetScore - glaComponent - gaComponent - 0.25 * quiz1 - 0.3 * quiz2) / 0.35;
  
  // Formula 2: T = 0.15×GLA + 0.05×GA + 0.4×F + 0.3×max(Qz1, Qz2)
  // T - 0.15×GLA - 0.05×GA - 0.3×max(Qz1, Qz2) = 0.4×F
  // F = (T - 0.15×GLA - 0.05×GA - 0.3×max(Qz1, Qz2)) / 0.4
  const formula2 = (targetScore - glaComponent - gaComponent - 0.3 * maxQuiz) / 0.4;
  
  return Math.min(formula1, formula2);
}

/**
 * Calculate required final exam score for Programming Data Structures and Algorithms
 */
function calculatePDSA(gaa1: number, gaa2: number, quiz1: number, pe1: number, pe2: number, targetScore: number): number {
  // T = 0.1×GAA1 + 0.1×GAA2 + 0.1×Qz1 + 0.4×F + 0.25×max(PE1, PE2) + 0.15×min(PE1, PE2)
  
  const gaa1Component = 0.1 * gaa1;
  const gaa2Component = 0.1 * gaa2;
  const quiz1Component = 0.1 * quiz1;
  const maxPE = Math.max(pe1, pe2);
  const minPE = Math.min(pe1, pe2);
  const peMaxComponent = 0.25 * maxPE;
  const peMinComponent = 0.15 * minPE;
  
  // T = 0.1×GAA1 + 0.1×GAA2 + 0.1×Qz1 + 0.4×F + 0.25×max(PE1, PE2) + 0.15×min(PE1, PE2)
  // T - 0.1×GAA1 - 0.1×GAA2 - 0.1×Qz1 - 0.25×max(PE1, PE2) - 0.15×min(PE1, PE2) = 0.4×F
  // F = (T - 0.1×GAA1 - 0.1×GAA2 - 0.1×Qz1 - 0.25×max(PE1, PE2) - 0.15×min(PE1, PE2)) / 0.4
  
  return (targetScore - gaa1Component - gaa2Component - quiz1Component - peMaxComponent - peMinComponent) / 0.4;
}

/**
 * Calculate required final exam score for System Commands
 */
function calculateSC(gaa: number, bpt: number, oppe: number, targetScore: number): number {
  // T = 0.1×GAA + 0.4×F + 0.3×OPPE + 0.2×BPT
  
  const gaaComponent = 0.1 * gaa;
  const bptComponent = 0.2 * bpt;
  const oppeComponent = 0.3 * oppe;
  
  // T = 0.1×GAA + 0.4×F + 0.3×OPPE + 0.2×BPT
  // T - 0.1×GAA - 0.3×OPPE - 0.2×BPT = 0.4×F
  // F = (T - 0.1×GAA - 0.3×OPPE - 0.2×BPT) / 0.4
  
  return (targetScore - gaaComponent - oppeComponent - bptComponent) / 0.4;
}

/**
 * Calculate predictions for all grades
 */
export function calculatePredictions(input: DiplomaPredictorInput): PredictionResult[] {
  const { subject } = input;
  
  // Check eligibility
  const eligibility = checkEligibility(input);
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
    
    // Call the appropriate calculation function based on subject
    switch (subject) {
      case 'MLF':
        requiredFinalScore = calculateMLF(
          input.gaa || 0,
          input.quiz1 || 0,
          input.quiz2 || 0,
          targetScore
        );
        break;
      case 'MLT':
        requiredFinalScore = calculateMLT(
          input.gaa || 0,
          input.quiz1 || 0,
          input.quiz2 || 0,
          targetScore
        );
        break;
      case 'MLP':
        requiredFinalScore = calculateMLP(
          input.gaa || 0,
          input.quiz1 || 0,
          input.ope1 || 0,
          input.ope2 || 0,
          input.npe1 || 0,
          input.npe2 || 0,
          targetScore
        );
        break;
      case 'BDM':
        requiredFinalScore = calculateBDM(
          input.ga || 0,
          input.quiz2 || 0,
          input.roe || 0,
          targetScore
        );
        break;
      case 'BA':
        requiredFinalScore = calculateBA(
          input.a || 0,
          input.quiz || 0,
          targetScore
        );
        break;
      case 'TDS':
        requiredFinalScore = calculateTDS(
          input.gaa || 0,
          input.roe1 || 0,
          input.p1 || 0,
          input.p2 || 0,
          targetScore
        );
        break;
      case 'JAVA':
        requiredFinalScore = calculateJAVA(
          input.gaa || 0,
          input.quiz1 || 0,
          input.quiz2 || 0,
          input.oppe || 0,
          targetScore
        );
        break;
      case 'DBMS':
        requiredFinalScore = calculateDBMS(
          input.gaa1 || 0,
          input.gaa2 || 0,
          input.gaa3 || 0,
          input.quiz1 || 0,
          input.quiz2 || 0,
          input.op || 0,
          targetScore
        );
        break;
      case 'AD1':
      case 'AD2':
        requiredFinalScore = calculateAD(
          input.gla || 0,
          input.ga || 0,
          input.quiz1 || 0,
          input.quiz2 || 0,
          targetScore
        );
        break;
      case 'PDSA':
        requiredFinalScore = calculatePDSA(
          input.gaa1 || 0,
          input.gaa2 || 0,
          input.quiz1 || 0,
          input.pe1 || 0,
          input.pe2 || 0,
          targetScore
        );
        break;
      case 'SC':
        requiredFinalScore = calculateSC(
          input.gaa || 0,
          input.bpt || 0,
          input.oppe || 0,
          targetScore
        );
        break;
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