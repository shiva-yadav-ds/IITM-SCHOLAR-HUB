import { CourseGrade, calculateGradeAndPoints, roundUpScore } from "./foundation";

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
 * Parameters for calculating diploma level course scores
 */
export interface DiplomaParams {
  subject: string;
  gaa?: number;
  gaa1?: number;
  gaa2?: number;
  gaa3?: number;
  quiz1?: number;
  quiz2?: number;
  finalExam?: number;
  normalBonus?: number;
  programmingBonus?: number;
  ope1?: number;
  ope2?: number;
  npe1?: number;
  npe2?: number;
  ga?: number;
  roe?: number;
  // Business Analytics fields
  a?: number;  // Sum of best 2 out of 3 assignments
  extraActivityBonus?: number;
  // Tools in Data Science fields
  roe1?: number;
  p1?: number;
  p2?: number;
  // PDSA fields
  op?: number;
  // App Dev 1 fields
  gla?: number;
  // Java fields
  pe1?: number;
  pe2?: number;
  // System Commands fields
  bpta?: number;
  ope?: number;
  // DBMS fields (most already covered above)
  [key: string]: string | number | undefined; // Allow any string key with number values
}

/**
 * Calculate total score for diploma level course
 */
export function calculateDiplomaTotal(params: DiplomaParams): number {
  const { 
    subject, 
    gaa = 0, 
    gaa1 = 0,
    gaa2 = 0,
    gaa3 = 0,
    quiz1 = 0, 
    quiz2 = 0, 
    finalExam = 0, 
    normalBonus = 0, 
    programmingBonus = 0,
    ope1 = 0,
    ope2 = 0,
    npe1 = 0,
    npe2 = 0,
    ga = 0,
    gla = 0,
    roe = 0,
    a = 0,
    extraActivityBonus = 0,
    roe1 = 0,
    p1 = 0,
    p2 = 0,
    op = 0,
    pe1 = 0,
    pe2 = 0,
    bpta = 0,
    ope = 0
  } = params;
  
  let total = 0;
  
  if (subject === 'ml_foundations') {
    // T = 0.1×GAA + max(0.6F + 0.2max(Qz1, Qz2), 0.4F + 0.2Qz1 + 0.3Qz2) + Normal Bonus
    const option1 = 0.6 * finalExam + 0.2 * Math.max(quiz1, quiz2);
    const option2 = 0.4 * finalExam + 0.2 * quiz1 + 0.3 * quiz2;
    
    total = 0.1 * gaa + Math.max(option1, option2);
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  } 
  else if (subject === 'ml_techniques') {
    // T = 0.1×GAA + 0.4F + max(0.25Qz1 + 0.25Qz2, 0.4max(Qz1, Qz2)) + Programming Bonus + Normal Bonus
    const option1 = 0.25 * quiz1 + 0.25 * quiz2;
    const option2 = 0.4 * Math.max(quiz1, quiz2);
    
    total = 0.1 * gaa + 0.4 * finalExam + Math.max(option1, option2);
    
    // Add bonuses if total is passing (≥40)
    if (total >= 40) {
      total += programmingBonus + normalBonus;
    }
  }
  else if (subject === 'ml_practice') {
    // T = 0.1GAA + 0.35F + 0.20OPE1 + 0.20OPE2 + 0.15Qz1 + NPE Bonus + Normal Bonus
    const npeBonus = 0.025 * npe1 + 0.025 * npe2;
    
    total = 0.1 * gaa + 0.35 * finalExam + 0.20 * ope1 + 0.20 * ope2 + 0.15 * quiz1;
    
    // Add bonuses if total is passing (≥40)
    if (total >= 40) {
      total += npeBonus + normalBonus;
    }
  }
  else if (subject === 'business_data_management') {
    // T = 0.3GA + 0.2Qz2 + 0.2ROE + 0.3F + Normal Bonus
    total = 0.3 * ga + 0.2 * quiz2 + 0.2 * roe + 0.3 * finalExam;
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  else if (subject === 'business_analytics') {
    // T = 0.3A + 0.2Qz + 0.4F + Extra Activity Bonus + Normal Bonus
    // Qz = 0.7×max(Qz1,Qz2) + 0.3×min(Qz1,Qz2)
    const quizScore = 0.7 * Math.max(quiz1, quiz2) + 0.3 * Math.min(quiz1, quiz2);
    
    total = 0.3 * a + 0.2 * quizScore + 0.4 * finalExam;
    
    // Add bonuses if total is passing (≥40)
    if (total >= 40) {
      total += extraActivityBonus + normalBonus;
    }
  }
  else if (subject === 'tools_in_data_science') {
    // T = 0.15GAA + 0.2ROE1 + 0.2P1 + 0.2P2 + 0.25F + Normal Bonus
    total = 0.15 * gaa + 0.2 * roe1 + 0.2 * p1 + 0.2 * p2 + 0.25 * finalExam;
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  else if (subject === 'pdsa') {
    // T = 0.1GAA + 0.4F + 0.2OP + max(0.2max(Qz1,Qz2), 0.15Qz1 + 0.15Qz2) + Normal Bonus
    const quizOption1 = 0.2 * Math.max(quiz1, quiz2);
    const quizOption2 = 0.15 * quiz1 + 0.15 * quiz2;
    
    total = 0.1 * gaa + 0.4 * finalExam + 0.2 * op + Math.max(quizOption1, quizOption2);
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  else if (subject === 'dbms') {
    // T = 0.04GAA1 + 0.03GAA2 + 0.03GAA3 + 0.2OPE1 + max(0.45F + 0.15max(Qz1,Qz2), 0.4F + 0.10Qz1 + 0.20Qz2) + Normal Bonus
    const option1 = 0.45 * finalExam + 0.15 * Math.max(quiz1, quiz2);
    const option2 = 0.4 * finalExam + 0.10 * quiz1 + 0.20 * quiz2;
    
    total = 0.04 * gaa1 + 0.03 * gaa2 + 0.03 * gaa3 + 0.2 * ope1 + Math.max(option1, option2);
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  else if (subject === 'app_dev_1') {
    // T = 0.15GLA + 0.05GA + max(0.35F + 0.2Qz1 + 0.25Qz2, 0.4F + 0.3max(Qz1,Qz2)) + Normal Bonus
    const option1 = 0.35 * finalExam + 0.2 * quiz1 + 0.25 * quiz2;
    const option2 = 0.4 * finalExam + 0.3 * Math.max(quiz1, quiz2);
    
    total = 0.15 * gla + 0.05 * ga + Math.max(option1, option2);
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  else if (subject === 'java') {
    // T = 0.1GAA + 0.3F + 0.2max(PE1,PE2) + 0.1min(PE1,PE2) + max(0.25max(Qz1,Qz2), 0.15Qz1 + 0.25Qz2) + Normal Bonus
    const peMax = 0.2 * Math.max(pe1, pe2);
    const peMin = 0.1 * Math.min(pe1, pe2);
    const quizOption1 = 0.25 * Math.max(quiz1, quiz2);
    const quizOption2 = 0.15 * quiz1 + 0.25 * quiz2;
    
    total = 0.1 * gaa + 0.3 * finalExam + peMax + peMin + Math.max(quizOption1, quizOption2);
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  else if (subject === 'system_commands') {
    // T = 0.10GAA + 0.2Qz1 + 0.3OPE + 0.3F + 0.1BPTA + Normal Bonus
    total = 0.10 * gaa + 0.2 * quiz1 + 0.3 * ope + 0.3 * finalExam + 0.1 * bpta;
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  else if (subject === 'app_dev_2') {
    // T = 0.05GAA1 + 0.05GAA2 + max(0.35F + 0.25Qz1 + 0.3Qz2, 0.5F + 0.3max(Qz1,Qz2)) + Normal Bonus
    const option1 = 0.35 * finalExam + 0.25 * quiz1 + 0.3 * quiz2;
    const option2 = 0.5 * finalExam + 0.3 * Math.max(quiz1, quiz2);
    
    total = 0.05 * gaa1 + 0.05 * gaa2 + Math.max(option1, option2);
    
    // Add normal bonus if total is passing (≥40)
    if (total >= 40) {
      total += normalBonus;
    }
  }
  
  // Cap the total at 100
  total = Math.min(total, 100);
  
  // Round up the score
  return roundUpScore(total);
}

/**
 * Calculate CGPA for diploma level courses
 * CGPA = ∑(Grade Points × Credits) / ∑Credits
 */
export function calculateDiplomaCGPA(courses: CourseGrade[]): number {
  if (courses.length === 0) return 0;
  
  let totalCredits = 0;
  let totalGradePoints = 0;
  
  courses.forEach(course => {
    totalCredits += course.credits;
    totalGradePoints += course.gradePoint * course.credits;
  });
  
  return totalGradePoints / totalCredits;
}

/**
 * Diploma level subjects with their credits
 */
export const diplomaSubjects = [
  { value: 'ml_foundations', label: 'Machine Learning Foundations', credits: 4 },
  { value: 'ml_techniques', label: 'Machine Learning Techniques', credits: 4 },
  { value: 'ml_practice', label: 'Machine Learning Practice', credits: 4 },
  { value: 'business_data_management', label: 'Business Data Management', credits: 4 },
  { value: 'business_analytics', label: 'Business Analytics', credits: 4 },
  { value: 'tools_in_data_science', label: 'Tools in Data Science', credits: 3 },
  { value: 'pdsa', label: 'Programming Data Structures and Algorithms using Python', credits: 4 },
  { value: 'dbms', label: 'Database Management System', credits: 4 },
  { value: 'app_dev_1', label: 'Application Development - 1', credits: 4 },
  { value: 'java', label: 'Programming Concepts Using Java', credits: 4 },
  { value: 'system_commands', label: 'System Commands', credits: 3 },
  { value: 'app_dev_2', label: 'Application Development - 2', credits: 4 },
];

/**
 * Get course details based on subject code
 */
export function getSubjectDetails(subject: string) {
  switch (subject) {
    case 'ml_foundations':
      return {
        code: 'DLMLF',
        name: 'Machine Learning Foundations',
        requiredFields: ['gaa', 'quiz1', 'quiz2', 'finalExam', 'normalBonus']
      };
    case 'ml_techniques':
      return {
        code: 'DLMLT',
        name: 'Machine Learning Techniques',
        requiredFields: ['gaa', 'quiz1', 'quiz2', 'finalExam', 'normalBonus', 'programmingBonus']
      };
    case 'ml_practice':
      return {
        code: 'DLMLP',
        name: 'Machine Learning Practice',
        requiredFields: ['gaa', 'quiz1', 'ope1', 'ope2', 'npe1', 'npe2', 'finalExam', 'normalBonus']
      };
    case 'business_data_management':
      return {
        code: 'DLBDM',
        name: 'Business Data Management',
        requiredFields: ['ga', 'quiz2', 'roe', 'finalExam', 'normalBonus']
      };
    case 'business_analytics':
      return {
        code: 'DLBA',
        name: 'Business Analytics',
        requiredFields: ['a', 'quiz1', 'quiz2', 'finalExam', 'extraActivityBonus', 'normalBonus']
      };
    case 'tools_in_data_science':
      return {
        code: 'DLTDS',
        name: 'Tools in Data Science',
        requiredFields: ['gaa', 'roe1', 'p1', 'p2', 'finalExam', 'normalBonus']
      };
    case 'pdsa':
      return {
        code: 'DLPDSA',
        name: 'Programming Data Structures and Algorithms using Python',
        requiredFields: ['gaa', 'quiz1', 'quiz2', 'op', 'finalExam', 'normalBonus']
      };
    case 'dbms':
      return {
        code: 'DLDBMS',
        name: 'Database Management System',
        requiredFields: ['gaa1', 'gaa2', 'gaa3', 'quiz1', 'quiz2', 'ope1', 'finalExam', 'normalBonus']
      };
    case 'app_dev_1':
      return {
        code: 'DLAD1',
        name: 'Application Development - 1',
        requiredFields: ['gla', 'ga', 'quiz1', 'quiz2', 'finalExam', 'normalBonus']
      };
    case 'java':
      return {
        code: 'DLJAVA',
        name: 'Programming Concepts Using Java',
        requiredFields: ['gaa', 'quiz1', 'quiz2', 'pe1', 'pe2', 'finalExam', 'normalBonus']
      };
    case 'system_commands':
      return {
        code: 'DLSC',
        name: 'System Commands',
        requiredFields: ['gaa', 'quiz1', 'bpta', 'ope', 'finalExam', 'normalBonus']
      };
    case 'app_dev_2':
      return {
        code: 'DLAD2',
        name: 'Application Development - 2',
        requiredFields: ['gaa1', 'gaa2', 'quiz1', 'quiz2', 'finalExam', 'normalBonus']
      };
    default:
      return {
        code: '',
        name: '',
        requiredFields: []
      };
  }
} 