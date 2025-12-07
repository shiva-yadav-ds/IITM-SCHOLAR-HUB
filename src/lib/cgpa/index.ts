// CGPA Calculator utilities and exports
import { CourseData, foundationCourses } from './foundation';
import { diplomaCourses } from './diploma';
import { bscCourses } from './bsc';
import { bsCourses } from './bs';

// Re-export types and courses
export type { CourseData } from './foundation';
export { foundationCourses } from './foundation';
export { diplomaCourses } from './diploma';
export { bscCourses } from './bsc';
export { bsCourses } from './bs';

// Program levels
export type ProgramLevel = 'foundation' | 'diploma' | 'bsc' | 'bs';

// Grade type
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'U' | '';

// Grade to grade points mapping (IITM official)
export const gradePoints: Record<string, number> = {
  'S': 10,
  'A': 9,
  'B': 8,
  'C': 7,
  'D': 6,
  'E': 4,
  'U': 0,
  '': 0,
};

// Valid passing grades (S-E)
export const passingGrades: Grade[] = ['S', 'A', 'B', 'C', 'D', 'E'];

// Course entry interface (for user input)
export interface CourseEntry {
  id: string;
  course: CourseData;
  grade: Grade;
  includeInCGPA: boolean;
}

// NPTEL/Extra credit entry
export interface ExtraCreditEntry {
  id: string;
  name: string;
  credits: number;
  type: 'nptel' | 'audit' | 'other';
}

// CGPA Result interface
export interface CGPAResult {
  cgpa: number;
  percentage: number;
  totalCredits: number;
  coursesCount: number;
}

// Get all courses up to a specific level
export function getCoursesForLevel(level: ProgramLevel): CourseData[] {
  const courses: CourseData[] = [];

  // Always include foundation
  courses.push(...foundationCourses);

  if (level === 'foundation') {
    return courses;
  }

  // Include diploma for diploma and above
  courses.push(...diplomaCourses);

  if (level === 'diploma') {
    return courses;
  }

  // Include BSc for BSc and above
  courses.push(...bscCourses);

  if (level === 'bsc') {
    return courses;
  }

  // Include BS for BS level
  courses.push(...bsCourses);

  return courses;
}

// Get courses by specific level only
export function getCoursesByLevel(level: ProgramLevel): CourseData[] {
  switch (level) {
    case 'foundation':
      return foundationCourses;
    case 'diploma':
      return diplomaCourses;
    case 'bsc':
      return bscCourses;
    case 'bs':
      return bsCourses;
    default:
      return [];
  }
}

// Calculate CGPA from course entries
export function calculateCGPA(entries: CourseEntry[]): CGPAResult {
  // Filter only courses included in CGPA with passing grades
  const validEntries = entries.filter(
    entry => entry.includeInCGPA &&
      entry.grade !== '' &&
      entry.grade !== 'U' &&
      passingGrades.includes(entry.grade)
  );

  if (validEntries.length === 0) {
    return {
      cgpa: 0,
      percentage: 0,
      totalCredits: 0,
      coursesCount: 0,
    };
  }

  let totalCredits = 0;
  let totalGradePoints = 0;

  validEntries.forEach(entry => {
    const credits = entry.course.credits;
    const gp = gradePoints[entry.grade] || 0;
    totalCredits += credits;
    totalGradePoints += credits * gp;
  });

  const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  return {
    cgpa: Math.round(cgpa * 100) / 100, // Round to 2 decimal places
    percentage: Math.round(cgpa * 10 * 100) / 100, // CGPA × 10
    totalCredits,
    coursesCount: validEntries.length,
  };
}

// Calculate level-wise CGPA
export function calculateLevelCGPA(entries: CourseEntry[], level: ProgramLevel): CGPAResult {
  const levelEntries = entries.filter(entry => entry.course.level === level);
  return calculateCGPA(levelEntries);
}

// Check if a grade is passing
export function isPassingGrade(grade: Grade): boolean {
  return grade !== '' && grade !== 'U' && passingGrades.includes(grade);
}

// Get available levels based on program level
export function getAvailableLevels(programLevel: ProgramLevel): ProgramLevel[] {
  switch (programLevel) {
    case 'foundation':
      return ['foundation'];
    case 'diploma':
      return ['foundation', 'diploma'];
    case 'bsc':
      return ['foundation', 'diploma', 'bsc'];
    case 'bs':
      return ['foundation', 'diploma', 'bsc', 'bs'];
    default:
      return ['foundation'];
  }
}

// Level display names
export const levelDisplayNames: Record<ProgramLevel, string> = {
  foundation: 'Foundation',
  diploma: 'Diploma',
  bsc: 'BSc Degree',
  bs: 'BS Degree',
};

// Program level descriptions
export const levelDescriptions: Record<ProgramLevel, string> = {
  foundation: '8 courses (32 credits) - Entry level program',
  diploma: 'Foundation + 8 Diploma courses (64 credits total)',
  bsc: 'Foundation + Diploma + BSc courses (96 credits total)',
  bs: 'Complete BS degree with all 4 levels (132 credits total)',
};

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
