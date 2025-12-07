"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  Plus,
  Trash2,
  AlertCircle,
  ChevronRight,
  Check,
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import {
  CourseData,
  CourseEntry,
  ProgramLevel,
  Grade,
  gradePoints,
  getCoursesForLevel,
  getCoursesByLevel,
  calculateCGPA,
  calculateLevelCGPA,
  isPassingGrade,
  getAvailableLevels,
  levelDisplayNames,
  levelDescriptions,
  generateId,
  CGPAResult,
} from '@/lib/cgpa';

// Storage keys
const STORAGE_KEYS = {
  PROGRAM_LEVEL: 'cgpaCalculator.programLevel',
  COURSE_ENTRIES: 'cgpaCalculator.courseEntries',
  CURRENT_STEP: 'cgpaCalculator.currentStep',
  SHOW_NPTEL: 'cgpaCalculator.showNptel',
};

// Grade options for dropdown
const gradeOptions: { value: Grade; label: string; points: number }[] = [
  { value: 'S', label: 'S (Outstanding)', points: 10 },
  { value: 'A', label: 'A (Excellent)', points: 9 },
  { value: 'B', label: 'B (Very Good)', points: 8 },
  { value: 'C', label: 'C (Good)', points: 7 },
  { value: 'D', label: 'D (Average)', points: 6 },
  { value: 'E', label: 'E (Pass)', points: 4 },
  { value: 'U', label: 'U (Fail)', points: 0 },
];

// Step configuration
const steps = [
  { id: 1, title: 'Choose Program Level', icon: GraduationCap },
  { id: 2, title: 'Add Your Courses', icon: BookOpen },
  { id: 3, title: 'View Results', icon: Award },
];

export default function CGPACalculator() {
  // State
  const [programLevel, setProgramLevel] = useState<ProgramLevel | null>(null);
  const [courseEntries, setCourseEntries] = useState<CourseEntry[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showNptel, setShowNptel] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem(STORAGE_KEYS.PROGRAM_LEVEL);
      if (savedLevel) {
        setProgramLevel(savedLevel as ProgramLevel);
      }

      const savedEntries = localStorage.getItem(STORAGE_KEYS.COURSE_ENTRIES);
      if (savedEntries) {
        try {
          setCourseEntries(JSON.parse(savedEntries));
        } catch (e) {
          console.error('Error parsing saved entries:', e);
        }
      }

      const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP);
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }

      const savedShowNptel = localStorage.getItem(STORAGE_KEYS.SHOW_NPTEL);
      if (savedShowNptel) {
        setShowNptel(savedShowNptel === 'true');
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (programLevel) {
      localStorage.setItem(STORAGE_KEYS.PROGRAM_LEVEL, programLevel);
    }
  }, [programLevel]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSE_ENTRIES, JSON.stringify(courseEntries));
  }, [courseEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOW_NPTEL, showNptel.toString());
  }, [showNptel]);

  // Get available courses based on program level
  const availableCourses = useMemo(() => {
    if (!programLevel) return [];
    return getCoursesForLevel(programLevel);
  }, [programLevel]);

  // Get courses not yet added
  const unaddedCourses = useMemo(() => {
    const addedCodes = new Set(courseEntries.map(e => e.course.code));
    return availableCourses.filter(c => !addedCodes.has(c.code));
  }, [availableCourses, courseEntries]);

  // Check for duplicate courses
  const hasDuplicates = useMemo(() => {
    const codes = courseEntries.map(e => e.course.code);
    return codes.length !== new Set(codes).size;
  }, [courseEntries]);

  // Calculate overall CGPA
  const overallResult = useMemo(() => calculateCGPA(courseEntries), [courseEntries]);

  // Calculate level-wise CGPAs
  const levelResults = useMemo(() => {
    if (!programLevel) return {};
    const levels = getAvailableLevels(programLevel);
    const results: Record<ProgramLevel, CGPAResult> = {} as any;
    levels.forEach(level => {
      results[level] = calculateLevelCGPA(courseEntries, level);
    });
    return results;
  }, [courseEntries, programLevel]);

  // Handle program level selection
  const handleLevelSelect = useCallback((level: ProgramLevel) => {
    setProgramLevel(level);
    // Clear courses when changing level
    setCourseEntries([]);
    setCurrentStep(2);
  }, []);

  // Add a new course
  const handleAddCourse = useCallback(() => {
    if (!selectedCourse || !programLevel) return;

    const course = availableCourses.find(c => c.code === selectedCourse);
    if (!course) return;

    const newEntry: CourseEntry = {
      id: generateId(),
      course,
      grade: '',
      includeInCGPA: true,
    };

    setCourseEntries(prev => [...prev, newEntry]);
    setSelectedCourse('');
  }, [selectedCourse, availableCourses, programLevel]);

  // Update course grade
  const handleGradeChange = useCallback((id: string, grade: Grade) => {
    setCourseEntries(prev =>
      prev.map(entry => {
        if (entry.id === id) {
          // Auto-uncheck include for U grade
          const includeInCGPA = grade === 'U' ? false : entry.includeInCGPA;
          return { ...entry, grade, includeInCGPA };
        }
        return entry;
      })
    );
  }, []);

  // Toggle include in CGPA
  const handleIncludeToggle = useCallback((id: string, checked: boolean) => {
    setCourseEntries(prev =>
      prev.map(entry => {
        if (entry.id === id) {
          // Don't allow including U-grade courses
          if (entry.grade === 'U' && checked) return entry;
          return { ...entry, includeInCGPA: checked };
        }
        return entry;
      })
    );
  }, []);

  // Remove a course
  const handleRemoveCourse = useCallback((id: string) => {
    setCourseEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  // Reset everything
  const handleReset = useCallback(() => {
    setProgramLevel(null);
    setCourseEntries([]);
    setCurrentStep(1);
    setShowNptel(false);
    setSelectedCourse('');
    localStorage.removeItem(STORAGE_KEYS.PROGRAM_LEVEL);
    localStorage.removeItem(STORAGE_KEYS.COURSE_ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
    localStorage.removeItem(STORAGE_KEYS.SHOW_NPTEL);
  }, []);

  // Get grade color
  const getGradeColor = (grade: Grade) => {
    switch (grade) {
      case 'S': return 'text-emerald-400';
      case 'A': return 'text-green-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-yellow-400';
      case 'D': return 'text-orange-400';
      case 'E': return 'text-amber-500';
      case 'U': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  // Render Step Indicator
  const renderStepIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-600 text-gray-500'
                }`}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span className={`ml-2 text-sm hidden sm:inline ${currentStep >= step.id ? 'text-white' : 'text-gray-500'
              }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-700'
                }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Step 1: Program Level Selection
  const renderLevelSelection = () => (
    <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-500" />
          Step 1: Choose Your Program Level
        </CardTitle>
        <CardDescription>
          Select your current program to see relevant courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['foundation', 'diploma', 'bsc', 'bs'] as ProgramLevel[]).map(level => (
            <Card
              key={level}
              className={`cursor-pointer transition-all hover:border-blue-500/50 ${programLevel === level
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50'
                }`}
              onClick={() => handleLevelSelect(level)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{levelDisplayNames[level]}</h3>
                    <p className="text-sm text-gray-400 mt-1">{levelDescriptions[level]}</p>
                  </div>
                  {programLevel === level && (
                    <Check className="w-6 h-6 text-blue-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Render Step 2: Course Entry
  const renderCourseEntry = () => {
    if (!programLevel) return null;

    const levels = getAvailableLevels(programLevel);

    return (
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-500" />
                Step 2: Add Your Courses
              </CardTitle>
              <CardDescription>
                Add courses you have completed with grades (S-E only)
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {levelDisplayNames[programLevel]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Course Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="bg-gray-900/80 border-gray-700">
                  <SelectValue placeholder="Select a course to add" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 max-h-[300px]">
                  {levels.map(level => (
                    <div key={level}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 bg-gray-800">
                        {levelDisplayNames[level]}
                      </div>
                      {getCoursesByLevel(level)
                        .filter(c => !courseEntries.find(e => e.course.code === c.code))
                        .map(course => (
                          <SelectItem key={course.code} value={course.code}>
                            {course.name} ({course.credits} credits)
                          </SelectItem>
                        ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAddCourse}
              disabled={!selectedCourse}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </div>

          {hasDuplicates && (
            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Warning: Duplicate courses detected</span>
            </div>
          )}

          {/* Course List by Level */}
          {levels.map(level => {
            const levelEntries = courseEntries.filter(e => e.course.level === level);
            if (levelEntries.length === 0) return null;

            return (
              <div key={level} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-700">{levelDisplayNames[level]}</Badge>
                  <span className="text-sm text-gray-400">
                    {levelEntries.length} course(s)
                  </span>
                </div>
                <div className="space-y-2">
                  {levelEntries.map(entry => (
                    <div
                      key={entry.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{entry.course.name}</p>
                        <p className="text-sm text-gray-400">{entry.course.credits} credits</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select
                          value={entry.grade}
                          onValueChange={(v) => handleGradeChange(entry.id, v as Grade)}
                        >
                          <SelectTrigger className={`w-32 bg-gray-900 border-gray-700 ${getGradeColor(entry.grade)}`}>
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            {gradeOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`include-${entry.id}`}
                            checked={entry.includeInCGPA}
                            onCheckedChange={(checked) =>
                              handleIncludeToggle(entry.id, checked as boolean)
                            }
                            disabled={entry.grade === 'U'}
                          />
                          <Label
                            htmlFor={`include-${entry.id}`}
                            className="text-sm text-gray-400"
                          >
                            Include
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCourse(entry.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {courseEntries.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No courses added yet</p>
              <p className="text-sm">Select a course from the dropdown above</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(1)}
              className="border-gray-700"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              disabled={courseEntries.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View Results
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render Step 3: Results
  const renderResults = () => {
    if (!programLevel) return null;

    const levels = getAvailableLevels(programLevel);

    return (
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-500" />
                Step 3: Your CGPA Results
              </CardTitle>
              <CardDescription>
                Your calculated CGPA based on added courses
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(2)}
              className="border-gray-700"
            >
              Edit Courses
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall CGPA Card */}
          <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Overall CGPA</p>
                <p className="text-5xl font-bold text-white mb-2">
                  {overallResult.cgpa.toFixed(2)}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="text-gray-300">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    {overallResult.percentage.toFixed(1)}%
                  </span>
                  <span className="text-gray-300">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {overallResult.totalCredits} credits
                  </span>
                  <span className="text-gray-300">
                    {overallResult.coursesCount} courses
                  </span>
                </div>
              </div>
              <Progress
                value={overallResult.cgpa * 10}
                className="mt-4 h-2 bg-gray-700"
              />
            </CardContent>
          </Card>

          {/* Level-wise CGPA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {levels.map(level => {
              const result = levelResults[level];
              if (!result || result.coursesCount === 0) {
                return (
                  <Card key={level} className="bg-gray-800/50 border-gray-700 opacity-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-400">{levelDisplayNames[level]} CGPA</p>
                      <p className="text-2xl font-bold text-gray-500">--</p>
                      <p className="text-xs text-gray-500">No courses added</p>
                    </CardContent>
                  </Card>
                );
              }
              return (
                <Card key={level} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-400">{levelDisplayNames[level]} CGPA</p>
                    <p className="text-2xl font-bold">{result.cgpa.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">
                      {result.totalCredits} credits • {result.coursesCount} courses
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Course Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold">Course Summary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {gradeOptions.slice(0, 6).map(opt => {
                const count = courseEntries.filter(
                  e => e.grade === opt.value && e.includeInCGPA
                ).length;
                return (
                  <div
                    key={opt.value}
                    className="bg-gray-800/50 rounded-lg p-3 text-center"
                  >
                    <p className={`text-2xl font-bold ${getGradeColor(opt.value)}`}>
                      {count}
                    </p>
                    <p className="text-xs text-gray-400">Grade {opt.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grading Scale Reference */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold mb-3">IIT Madras Grading Scale</h4>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-sm">
              {gradeOptions.map(opt => (
                <div key={opt.value} className="bg-gray-800 rounded p-2">
                  <span className={`font-bold ${getGradeColor(opt.value)}`}>
                    {opt.value}
                  </span>
                  <span className="text-gray-400 ml-1">= {opt.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-red-700 text-red-400 hover:bg-red-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Calculator
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Current Step Content */}
      {currentStep === 1 && renderLevelSelection()}
      {currentStep === 2 && renderCourseEntry()}
      {currentStep === 3 && renderResults()}
    </div>
  );
}
