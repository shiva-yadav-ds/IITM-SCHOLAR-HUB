// Define CourseGrade interface for CGPA calculation
export interface CourseGrade {
  courseCode: string;
  courseName: string;
  credits: number;
  score: number;
  grade: string;
  gradePoint: number;
}

// Parameters for calculating foundation level course scores
export interface FoundationParams {
  subject: string;
  gaa?: number;
  gaa1?: number;
  gaa2?: number;
  quiz1?: number;
  quiz2?: number;
  finalExam?: number;
  pe1?: number;
  pe2?: number;
  normalBonus?: number;
  extraActivityBonus?: number;
  sctBonus?: number;
  mockTestBonus?: number;
  [key: string]: string | number | undefined; // Allow any string key
}

/**
 * Apply rounding rule to scores:
 * - If decimal part is > 0.5, round up to next integer
 * - If decimal part is <= 0.5, keep the integer part
 * Examples:
 * 54.1 => 54
 * 54.49 => 54
 * 54.50 => 54
 * 54.51 => 55
 * 54.76 => 55
 */
function roundScore(score: number): number {
  const integerPart = Math.floor(score);
  const decimalPart = score - integerPart;

  if (decimalPart > 0.5) {
    return integerPart + 1;
  }
  return integerPart;
}

/**
 * Result interface for Foundation score calculations with bonus breakdown
 */
export interface FoundationScoreResult {
  scoreWithoutNormalBonus: number;
  scoreWithNormalBonus: number;
  qualifiesForNormalBonus: boolean;
  normalBonusApplied: number;
}

/**
 * Calculate foundation scores with and without normal bonus for transparency
 * Normal bonus (2 marks) is automatically applied when base score >= 40
 */
export function calculateFoundationScores(params: FoundationParams): FoundationScoreResult {
  const {
    subject,
    gaa = 0,
    gaa1 = 0,
    gaa2 = 0,
    quiz1 = 0,
    quiz2 = 0,
    finalExam = 0,
    extraActivityBonus = 0,
    sctBonus = 0,
    mockTestBonus = 0,
    pe1 = 0,
    pe2 = 0
  } = params;

  let baseScore = 0;
  let scoreWithOtherBonuses = 0;

  // For Python, formula is different compared to other courses
  if (subject === 'BSCCS1001') { // Python Programming
    baseScore = 0.1 * gaa1 + 0.1 * gaa2 + 0.1 * quiz1 +
      0.4 * finalExam + 0.25 * Math.max(pe1, pe2) + 0.15 * Math.min(pe1, pe2);

    scoreWithOtherBonuses = baseScore;
    // Add SCT and Mock test bonuses if passing (T >= 40)
    if (baseScore >= 40) {
      scoreWithOtherBonuses += Math.min(2, sctBonus);      // SCT bonus (up to 2 marks)
      scoreWithOtherBonuses += Math.min(2, mockTestBonus); // Mock test bonus (up to 2 marks)
    }
  }
  // For Statistics 1 and Statistics 2, there's extra activity bonus in addition to normal bonus
  else if (subject === 'BSCCS1002' || subject === 'BSCCS1007') { // Stats 1 or Stats 2
    // Base formula components
    const gaaComponent = 0.1 * gaa;
    const maxQuizScore = Math.max(quiz1, quiz2);
    const formula1 = 0.6 * finalExam + 0.2 * maxQuizScore;
    const formula2 = 0.4 * finalExam + 0.2 * quiz1 + 0.3 * quiz2;

    baseScore = gaaComponent + Math.max(formula1, formula2);
    scoreWithOtherBonuses = baseScore;

    // Add extra activity bonus if passing (T >= 40)
    if (baseScore >= 40) {
      scoreWithOtherBonuses += Math.min(5, extraActivityBonus); // Extra activity bonus (up to 5 marks)
    }
  }
  // For all other courses (Math 1, Math 2, English 1, English 2, Computational Thinking)
  else {
    // Base formula components
    const gaaComponent = 0.1 * gaa;
    const maxQuizScore = Math.max(quiz1, quiz2);
    const formula1 = 0.6 * finalExam + 0.2 * maxQuizScore;
    const formula2 = 0.4 * finalExam + 0.2 * quiz1 + 0.3 * quiz2;

    baseScore = gaaComponent + Math.max(formula1, formula2);
    scoreWithOtherBonuses = baseScore;
  }

  // Determine if student qualifies for normal bonus (score before normal bonus >= 40)
  const qualifiesForNormalBonus = scoreWithOtherBonuses >= 40;
  const normalBonusApplied = qualifiesForNormalBonus ? 2 : 0;

  // Calculate both scores
  const scoreWithoutNormalBonus = Math.min(100, scoreWithOtherBonuses);
  const scoreWithNormalBonus = Math.min(100, scoreWithOtherBonuses + normalBonusApplied);

  return {
    scoreWithoutNormalBonus: roundScore(scoreWithoutNormalBonus),
    scoreWithNormalBonus: roundScore(scoreWithNormalBonus),
    qualifiesForNormalBonus,
    normalBonusApplied
  };
}

/**
 * Calculate total score for foundation level course based on subject type
 * This returns the final score WITH normal bonus applied automatically
 */
export function calculateFoundationTotal(params: FoundationParams): number {
  const result = calculateFoundationScores(params);
  return result.scoreWithNormalBonus;
}

/**
 * Calculate grade and grade points based on score
 */
export function calculateGradeAndPoints(score: number): { grade: string; gradePoint: number } {
  // Apply rounding rule to the score
  const roundedScore = roundScore(score);

  if (roundedScore >= 90) return { grade: 'S', gradePoint: 10 };
  if (roundedScore >= 80) return { grade: 'A', gradePoint: 9 };
  if (roundedScore >= 70) return { grade: 'B', gradePoint: 8 };
  if (roundedScore >= 60) return { grade: 'C', gradePoint: 7 };
  if (roundedScore >= 50) return { grade: 'D', gradePoint: 6 };
  if (roundedScore >= 40) return { grade: 'E', gradePoint: 4 };
  return { grade: 'U', gradePoint: 0 };
}

/**
 * Calculate CGPA for foundation level courses
 * CGPA = ∑(Grade Points × Credits) / ∑Credits
 */
export function calculateFoundationCGPA(courses: CourseGrade[]): number {
  if (courses.length === 0) return 0;

  let totalCredits = 0;
  let totalGradePoints = 0;

  courses.forEach((course) => {
    totalCredits += course.credits;
    totalGradePoints += course.credits * course.gradePoint;
  });

  return totalGradePoints / totalCredits;
}

/**
 * Foundation level subjects with their credits
 */
export const foundationSubjects = [
  { value: 'BSCCS1001', label: 'Intro to Python Programming', credits: 4 },
  { value: 'BSCCS1002', label: 'Statistics for Data Science 1', credits: 4 },
  { value: 'BSCCS1003', label: 'Computational Thinking', credits: 4 },
  { value: 'BSCCS1004', label: 'Mathematics for Data Science 1', credits: 4 },
  { value: 'BSCCS1005', label: 'English 1', credits: 4 },
  { value: 'BSCCS1006', label: 'Mathematics for Data Science 2', credits: 4 },
  { value: 'BSCCS1007', label: 'Statistics for Data Science 2', credits: 4 },
  { value: 'BSCCS1008', label: 'English 2', credits: 4 }
];

/**
 * Get course details based on subject code
 */
export function getSubjectDetails(subject: string): { name: string; code: string } {
  const subjectInfo = foundationSubjects.find(s => s.value === subject);

  if (!subjectInfo) {
    return { name: "", code: subject };
  }

  return {
    name: subjectInfo.label,
    code: subjectInfo.value
  };
}

/**
 * Get required input fields based on course
 */
export function getRequiredFields(subject: string): string[] {
  if (subject === 'BSCCS1001') { // Python
    // Removed normalBonus - it's now auto-calculated
    return ['gaa1', 'gaa2', 'quiz1', 'pe1', 'pe2', 'finalExam', 'sctBonus', 'mockTestBonus'];
  } else if (subject === 'BSCCS1002' || subject === 'BSCCS1007') { // Stats 1 or Stats 2
    // Removed normalBonus - it's now auto-calculated
    return ['gaa', 'quiz1', 'quiz2', 'finalExam', 'extraActivityBonus'];
  } else {
    // Removed normalBonus - it's now auto-calculated
    return ['gaa', 'quiz1', 'quiz2', 'finalExam'];
  }
}

// Round up scores to the nearest integer
export function roundUpScore(score: number): number {
  return Math.ceil(score);
} 