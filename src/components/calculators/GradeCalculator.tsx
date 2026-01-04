"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Info } from 'lucide-react';
import GradeChart from './GradeChart';

import {
  CourseGrade,
  FoundationParams,
  calculateFoundationTotal,
  calculateFoundationScores,
  FoundationScoreResult,
  calculateGradeAndPoints,
  calculateFoundationCGPA,
  foundationSubjects,
  getSubjectDetails as getFoundationSubjectDetails,
  getRequiredFields
} from "@/lib/grade/foundation";

import {
  DiplomaParams,
  calculateDiplomaTotal,
  calculateDiplomaCGPA,
  diplomaSubjects,
  getSubjectDetails as getDiplomaSubjectDetails
} from "@/lib/grade/diploma";

import {
  DegreeParams,
  calculateDegreeTotal,
  calculateDegreeCGPA,
  degreeSubjects,
  getSubjectDetails as getDegreeSubjectDetails
} from "@/lib/grade/degree";

// Field Label mapping
const fieldLabels: Record<string, string> = {
  // Note: GAA fields removed for foundation level, but still used in diploma (5%)
  gaa: "GAA (Weekly assignments average)",
  gaa1: "GAA1 (Objective assignments)",
  gaa2: "GAA2 (SQL Assignments - Week 2,3)",
  gaa3: "GAA3 (Programming Assignment - Week 7)",
  gaap: "GAAP (Programming assignments average)",
  gpa: "GPA (Graded Programming Assignments score)",
  quiz1: "Quiz 1 Score",
  quiz2: "Quiz 2 Score",
  quiz3: "Quiz 3 Score",
  quizzes: "Quiz Marks (Combined Quiz 1 + Quiz 2)",
  finalExam: "Final Exam Score",
  normalBonus: "Normal Bonus (Max 2)",
  programmingBonus: "Programming Assignment Bonus (Max 3)",
  llmProgrammingBonus: "Programming Assignments Bonus (Max 10)",
  extraActivityBonus: "Extra Activity Bonus (Max 5)",
  extraAssignmentBonus: "Extra Assignment Bonus (Max 10)",
  gameBonus: "Game Bonus (1 mark for top performers)",
  game: "Game Score (4 marks for participation)",
  assignment1: "Assignment 1 Score",
  assignment2: "Assignment 2 Score",
  assignment3: "Assignment 3 Score",
  projectSubmission: "Project Submission Score",
  projectPresentation: "Project Presentation Score",
  sctBonus: "SCT Bonus (Max 2)",
  mockTestBonus: "Mock Test Bonus (Max 2)",
  // Software Engineering fields
  gp1: "Group Project Milestone 1-3 Score",
  gp2: "Group Project Milestone 4-6 Score",
  pp: "Project Presentation Score",
  cp: "Course Participation Activity Score",
  // Professional Growth fields
  gp: "Group Project Score",
  // ML Practice fields
  oppe1: "OPPE-1 Score",
  oppe2: "OPPE-2 Score",
  ka: "Kaggle Assignments Average",
  // Deep Learning & GenAI fields
  nppe1: "NPPE-1 (Non-Proctored Programming Exam 1)",
  nppe2: "NPPE-2 (Non-Proctored Programming Exam 2)",
  nppe3: "Non-Proctored Programming Exam 3",
  // BDM fields
  ga: "Graded Assignments (out of 10)",
  timedAssignment: "Timed Assignment (out of 20)",
  project: "Group Project Score",
  // Business Analytics fields
  a: "Best 2 of 3 Assignments (out of 20)",
  // Tools in Data Science fields
  roe: "Remote Online Exam Score",
  roe1: "Remote Online Exam 1 Score",
  p1: "Project 1 Score",
  p2: "Project 2 Score",
  // PDSA, DBMS fields
  op: "OPPE Score (Online Proctored Exam)",
  // App Dev 1 fields
  gla: "GLA (Best Lab Assignments Score)",
  // Java fields
  pe1: "OPPE-1 (Online Proctored Programming Exam 1)",
  pe2: "OPPE-2 (Online Proctored Programming Exam 2)",
  // System Commands fields
  bpta: "BPTA (Biweekly Programming Test Average)",
  oppe: "OPPE Score",
  ope: "Online Proctored Exam Score",
  // Legacy fields
  internalMarks: "Internal Marks",
  externalMarks: "External Marks",
  projectMarks: "Project Marks",
  bonusMarks: "Bonus Marks (Max 2)"
};

// Save course data to localStorage
const saveCourses = (level: string, courses: CourseGrade[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${level}Courses`, JSON.stringify(courses));
  }
};

// Load course data from localStorage
const loadCourses = (level: string): CourseGrade[] => {
  if (typeof window !== 'undefined') {
    const savedCourses = localStorage.getItem(`${level}Courses`);
    return savedCourses ? JSON.parse(savedCourses) : [];
  }
  return [];
};

// Constants for localStorage keys
const FORM_STORAGE_KEYS = {
  FORM_VALUES: 'gradeCalculator.formValues',
  SELECTED_SUBJECT: 'gradeCalculator.selectedSubject',
  ACTIVE_TAB: 'gradeCalculator.activeTab'
};

export default function GradeCalculator() {
  const [activeTab, setActiveTab] = useState("foundation");
  const [foundationCourses, setFoundationCourses] = useState<CourseGrade[]>([]);
  const [diplomaCourses, setDiplomaCourses] = useState<CourseGrade[]>([]);
  const [degreeCourses, setDegreeCourses] = useState<CourseGrade[]>([]);
  const [foundationCGPA, setFoundationCGPA] = useState<number | null>(null);
  const [diplomaCGPA, setDiplomaCGPA] = useState<number | null>(null);
  const [degreeCGPA, setDegreeCGPA] = useState<number | null>(null);

  // Form state for new course
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string | number>>({});
  const [requiredFields, setRequiredFields] = useState<string[]>([]);

  // State to store score breakdown for foundation courses (with and without normal bonus)
  const [foundationScoreBreakdowns, setFoundationScoreBreakdowns] = useState<Map<number, FoundationScoreResult>>(new Map());

  // Load data from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load active tab
      const savedTab = localStorage.getItem(FORM_STORAGE_KEYS.ACTIVE_TAB);
      if (savedTab) {
        setActiveTab(savedTab);
      }

      // Load selected subject
      const savedSubject = localStorage.getItem(FORM_STORAGE_KEYS.SELECTED_SUBJECT);
      if (savedSubject) {
        setSelectedSubject(savedSubject);
      }

      // Load form values
      const savedFormValues = localStorage.getItem(FORM_STORAGE_KEYS.FORM_VALUES);
      if (savedFormValues) {
        setFormValues(JSON.parse(savedFormValues));
      }

      // Load courses data
      const foundationSaved = loadCourses('foundation');
      const diplomaSaved = loadCourses('diploma');
      const degreeSaved = loadCourses('degree');

      if (foundationSaved.length > 0) {
        setFoundationCourses(foundationSaved);
        setFoundationCGPA(calculateFoundationCGPA(foundationSaved));
      }

      if (diplomaSaved.length > 0) {
        setDiplomaCourses(diplomaSaved);
        setDiplomaCGPA(calculateDiplomaCGPA(diplomaSaved));
      }

      if (degreeSaved.length > 0) {
        setDegreeCourses(degreeSaved);
        setDegreeCGPA(calculateDegreeCGPA(degreeSaved));
      }
    }
  }, []);

  // Save active tab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FORM_STORAGE_KEYS.ACTIVE_TAB, activeTab);
    }
  }, [activeTab]);

  // Save selected subject to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FORM_STORAGE_KEYS.SELECTED_SUBJECT, selectedSubject);
    }
  }, [selectedSubject]);

  // Save form values to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(formValues).length > 0) {
      localStorage.setItem(FORM_STORAGE_KEYS.FORM_VALUES, JSON.stringify(formValues));
    }
  }, [formValues]);

  // Update required fields when subject changes
  useEffect(() => {
    if (!selectedSubject) {
      setRequiredFields([]);
      return;
    }

    if (activeTab === 'foundation') {
      const fields = getRequiredFields(selectedSubject);
      setRequiredFields(fields);
    } else if (activeTab === 'diploma') {
      const subjectDetails = getDiplomaSubjectDetails(selectedSubject);
      setRequiredFields(subjectDetails.requiredFields || []);
    } else {
      // For degree level, get required fields based on the selected subject
      const subjectDetails = getDegreeSubjectDetails(selectedSubject);
      setRequiredFields(subjectDetails.requiredFields || []);
    }

    // Only reset form values when subject or tab actually changes, not on initial load
    const prevSubject = localStorage.getItem(FORM_STORAGE_KEYS.SELECTED_SUBJECT);
    const prevTab = localStorage.getItem(FORM_STORAGE_KEYS.ACTIVE_TAB);

    // Clear form values only if the subject or tab has changed
    if ((prevSubject && prevSubject !== selectedSubject) || (prevTab && prevTab !== activeTab)) {
      setFormValues({});
      localStorage.removeItem(FORM_STORAGE_KEYS.FORM_VALUES);
    }
  }, [selectedSubject, activeTab]);

  const handleInputChange = (field: string, value: string) => {
    // Parse the value to a number or keep as empty string
    const numValue = value === '' ? '' : parseFloat(value);

    // Update the form values state with the new value
    const updatedValues = { ...formValues, [field]: numValue };
    setFormValues(updatedValues);

    // Save the updated form values to localStorage immediately
    if (typeof window !== 'undefined') {
      localStorage.setItem(FORM_STORAGE_KEYS.FORM_VALUES, JSON.stringify(updatedValues));
    }
  };

  const resetForm = () => {
    setSelectedSubject("");
    setFormValues({});

    // Clear form values from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FORM_STORAGE_KEYS.SELECTED_SUBJECT);
      localStorage.removeItem(FORM_STORAGE_KEYS.FORM_VALUES);
    }
  };

  const handleAddFoundationCourse = () => {
    if (!selectedSubject) return;

    const subjectDetails = getFoundationSubjectDetails(selectedSubject);
    const subjectInfo = foundationSubjects.find(s => s.value === selectedSubject);

    if (!subjectInfo) return;

    // Convert form values to numbers
    const params: FoundationParams = { subject: selectedSubject };

    // Add required fields to params
    requiredFields.forEach(field => {
      const value = formValues[field];
      params[field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    });

    // Calculate scores using the new function that provides breakdown
    const scoreResult = calculateFoundationScores(params);
    const totalScore = scoreResult.finalScore;
    const { grade, gradePoint } = calculateGradeAndPoints(totalScore);

    const newCourse: CourseGrade = {
      courseCode: subjectDetails.code,
      courseName: subjectDetails.name,
      credits: subjectInfo.credits,
      score: totalScore,
      grade,
      gradePoint
    };

    const updatedCourses = [...foundationCourses, newCourse];
    setFoundationCourses(updatedCourses);

    // Store the score breakdown for this course index
    const newBreakdowns = new Map(foundationScoreBreakdowns);
    newBreakdowns.set(updatedCourses.length - 1, scoreResult);
    setFoundationScoreBreakdowns(newBreakdowns);

    // Save to localStorage
    saveCourses('foundation', updatedCourses);

    // Calculate CGPA
    const cgpa = calculateFoundationCGPA(updatedCourses);
    setFoundationCGPA(cgpa);

    resetForm();
  };

  const handleAddDiplomaCourse = () => {
    if (!selectedSubject) return;

    const subjectDetails = getDiplomaSubjectDetails(selectedSubject);
    const subjectInfo = diplomaSubjects.find(s => s.value === selectedSubject);

    if (!subjectInfo) return;

    // Convert form values to numbers
    const params: DiplomaParams = {
      subject: selectedSubject
    };

    // Add the required fields
    requiredFields.forEach(field => {
      const value = formValues[field];
      params[field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    });

    const totalScore = calculateDiplomaTotal(params);
    const { grade, gradePoint } = calculateGradeAndPoints(totalScore);

    const newCourse: CourseGrade = {
      courseCode: subjectDetails.code,
      courseName: subjectDetails.name,
      credits: subjectInfo.credits,
      score: totalScore,
      grade,
      gradePoint
    };

    const updatedCourses = [...diplomaCourses, newCourse];
    setDiplomaCourses(updatedCourses);

    // Save to localStorage
    saveCourses('diploma', updatedCourses);

    // Calculate CGPA
    const cgpa = calculateDiplomaCGPA(updatedCourses);
    setDiplomaCGPA(cgpa);

    resetForm();
  };

  const handleAddDegreeCourse = () => {
    if (!selectedSubject) return;

    const subjectDetails = getDegreeSubjectDetails(selectedSubject);
    const subjectInfo = degreeSubjects.find(s => s.value === selectedSubject);

    if (!subjectInfo) return;

    // Convert form values to numbers
    const params: DegreeParams = {
      subject: selectedSubject
    };

    // Add the required fields
    requiredFields.forEach(field => {
      const value = formValues[field];
      params[field] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    });

    const totalScore = calculateDegreeTotal(params);
    const { grade, gradePoint } = calculateGradeAndPoints(totalScore);

    const newCourse: CourseGrade = {
      courseCode: subjectDetails.code,
      courseName: subjectDetails.name,
      credits: subjectInfo.credits,
      score: totalScore,
      grade,
      gradePoint
    };

    const updatedCourses = [...degreeCourses, newCourse];
    setDegreeCourses(updatedCourses);

    // Save to localStorage
    saveCourses('degree', updatedCourses);

    // Calculate CGPA
    const cgpa = calculateDegreeCGPA(updatedCourses);
    setDegreeCGPA(cgpa);

    resetForm();
  };

  const handleRemoveCourse = (index: number, level: 'foundation' | 'diploma' | 'degree') => {
    if (level === 'foundation') {
      const updatedCourses = foundationCourses.filter((_, i) => i !== index);
      setFoundationCourses(updatedCourses);

      // Update score breakdowns - shift indices for remaining courses
      const newBreakdowns = new Map<number, FoundationScoreResult>();
      foundationScoreBreakdowns.forEach((value, key) => {
        if (key < index) {
          newBreakdowns.set(key, value);
        } else if (key > index) {
          newBreakdowns.set(key - 1, value);
        }
      });
      setFoundationScoreBreakdowns(newBreakdowns);

      // Save to localStorage
      saveCourses('foundation', updatedCourses);

      // Recalculate CGPA
      const cgpa = updatedCourses.length > 0 ? calculateFoundationCGPA(updatedCourses) : null;
      setFoundationCGPA(cgpa);
    } else if (level === 'diploma') {
      const updatedCourses = diplomaCourses.filter((_, i) => i !== index);
      setDiplomaCourses(updatedCourses);

      // Save to localStorage
      saveCourses('diploma', updatedCourses);

      // Recalculate CGPA
      const cgpa = updatedCourses.length > 0 ? calculateDiplomaCGPA(updatedCourses) : null;
      setDiplomaCGPA(cgpa);
    } else {
      const updatedCourses = degreeCourses.filter((_, i) => i !== index);
      setDegreeCourses(updatedCourses);

      // Save to localStorage
      saveCourses('degree', updatedCourses);

      // Recalculate CGPA
      const cgpa = updatedCourses.length > 0 ? calculateDegreeCGPA(updatedCourses) : null;
      setDegreeCGPA(cgpa);
    }
  };

  const renderGradingSystem = () => (
    <Card className="border-border bg-card shadow-lg">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-sm font-medium">IITM Grading System</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { grade: 'S', range: '90-100%', points: 10 },
            { grade: 'A', range: '80-89%', points: 9 },
            { grade: 'B', range: '70-79%', points: 8 },
            { grade: 'C', range: '60-69%', points: 7 },
            { grade: 'D', range: '50-59%', points: 6 },
            { grade: 'E', range: '40-49%', points: 4 },
          ].map(item => (
            <div key={item.grade} className="bg-secondary/20 border border-secondary rounded p-2">
              <div className="font-medium">{item.grade}: {item.range}</div>
              <div className="text-muted-foreground text-xs">{item.points} points</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCourseForm = () => {
    return (
      <div className="space-y-6">
        <Card className="border-border bg-card shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1.5">Subject/Course</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="bg-background border-border h-10">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {activeTab === 'foundation' && foundationSubjects.map((subject) => (
                      <SelectItem
                        key={subject.value}
                        value={subject.value}
                        className="focus:bg-secondary focus:text-secondary-foreground"
                      >
                        {subject.label}
                      </SelectItem>
                    ))}
                    {activeTab === 'diploma' && diplomaSubjects.map((subject) => (
                      <SelectItem
                        key={subject.value}
                        value={subject.value}
                        className="focus:bg-secondary focus:text-secondary-foreground"
                      >
                        {subject.label}
                      </SelectItem>
                    ))}
                    {activeTab === 'degree' && degreeSubjects.map((subject) => (
                      <SelectItem
                        key={subject.value}
                        value={subject.value}
                        className="focus:bg-secondary focus:text-secondary-foreground"
                      >
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {renderInputFields(selectedSubject)}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
                <Button
                  type="button"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={() => {
                    if (activeTab === 'foundation') handleAddFoundationCourse();
                    else if (activeTab === 'diploma') handleAddDiplomaCourse();
                    else handleAddDegreeCourse();
                  }}
                  disabled={!selectedSubject}
                >
                  Add Course
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="px-6 bg-transparent border-border text-foreground hover:bg-secondary transition-colors"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Tables */}
        {activeTab === 'foundation' && renderCourseTable(foundationCourses, 'foundation', foundationCGPA)}
        {activeTab === 'diploma' && renderCourseTable(diplomaCourses, 'diploma', diplomaCGPA)}
        {activeTab === 'degree' && renderCourseTable(degreeCourses, 'degree', degreeCGPA)}
      </div>
    );
  };

  const renderCourseTable = (
    courses: CourseGrade[],
    level: 'foundation' | 'diploma' | 'degree',
    cgpa: number | null
  ) => {
    if (courses.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium">No courses added yet</h3>
          <p className="mt-2">Add a course above to calculate your CGPA</p>
        </div>
      );
    }

    return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/30">
              <tr>
                <th className="py-3 px-4 text-left">Course</th>
                <th className="py-3 px-4 text-center">Final Score</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Points</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/20">
              {courses.map((course, index) => {
                const scoreBreakdown = level === 'foundation' ? foundationScoreBreakdowns.get(index) : null;

                return (
                  <tr key={index} className="hover:bg-gray-700/10">
                    <td className="py-3 px-4">
                      <div className="font-medium">{course.courseName}</div>
                      <div className="text-sm text-gray-400">{course.courseCode}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {level === 'foundation' && scoreBreakdown ? (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-400">
                            Base Score: {scoreBreakdown.baseScore}%
                          </div>
                          {scoreBreakdown.bonusApplied > 0 ? (
                            <div className="font-medium text-green-400 flex items-center justify-center gap-1">
                              <span>With Bonus (+{scoreBreakdown.bonusApplied}): {scoreBreakdown.finalScore}%</span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-green-500/20 text-green-400">
                                <Info className="w-3 h-3 mr-0.5" />
                                Bonus
                              </span>
                            </div>
                          ) : (
                            <div className="font-medium">
                              Final: {scoreBreakdown.finalScore}%
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>{course.score.toFixed(0)}%</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="inline-block px-2 py-1 rounded text-sm font-medium"
                        style={{ color: getGradeColor(course.grade) }}
                      >
                        {course.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{course.gradePoint.toFixed(1)}</td>
                    <td className="py-3 px-4 text-center">{course.credits}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-red-500 hover:text-red-400"
                        onClick={() => handleRemoveCourse(index, level)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add CGPA Chart below the table */}
        {courses.length > 0 && <GradeChart courses={courses} cgpa={cgpa} />}
      </>
    );
  };

  // Helper function to get color based on grade
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return 'primary';
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D': return 'error';
      case 'E': return 'error';
      default: return 'error';
    }
  };

  // Update the renderInputFields function to display input fields in a grid layout with two columns
  const renderInputFields = (subject: string) => {
    if (!subject) return null;

    // Get dynamic label for extraActivityBonus based on subject
    const getFieldLabel = (field: string) => {
      if (field === 'extraActivityBonus') {
        if (subject === 'BSCCS1006') { // Math 2
          return 'Extra Activity Bonus (Max 6)';
        } else {
          return 'Extra Activity Bonus (Max 5)';
        }
      }
      return fieldLabels[field] || field;
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {requiredFields.map((field) => (
          <div key={field} className="flex flex-col space-y-2">
            <Label htmlFor={field} className="text-sm font-medium">
              {getFieldLabel(field)}
            </Label>
            <Input
              id={field}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formValues[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`Enter ${getFieldLabel(field)}`}
              className="w-full"
            />
          </div>
        ))}
      </div>
    );
  };

  // Helper function to get subject details based on level
  const getSubjectDetails = (
    subject: string,
    level: "foundation" | "diploma" | "degree"
  ) => {
    if (level === "foundation") {
      const details = getFoundationSubjectDetails(subject);
      return {
        code: details.code,
        name: details.name,
        requiredFields: getRequiredFields(subject)
      };
    } else if (level === "diploma") {
      return getDiplomaSubjectDetails(subject);
    } else {
      return getDegreeSubjectDetails(subject);
    }
  };

  return (
    <div className="w-full">
      <Tabs
        defaultValue="foundation"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full bg-background mb-6 rounded-2xl border border-border p-0.5 flex flex-wrap gap-1">
          <TabsTrigger
            value="foundation"
            className="flex-1 rounded-xl px-2 sm:px-8 py-2.5 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground"
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              <span>Foundation</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="diploma"
            className="flex-1 rounded-xl px-2 sm:px-8 py-2.5 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground"
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll"><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /></svg>
              <span>Diploma</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="degree"
            className="flex-1 rounded-xl px-2 sm:px-8 py-2.5 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:text-foreground"
          >
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
              <span>Degree</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="foundation" className="mt-0 space-y-6">
          <Card className="border-border bg-card shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-1.5">Subject/Course</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-background border-border h-10">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      {activeTab === 'foundation' && foundationSubjects.map((subject) => (
                        <SelectItem
                          key={subject.value}
                          value={subject.value}
                          className="focus:bg-secondary focus:text-secondary-foreground"
                        >
                          {subject.label}
                        </SelectItem>
                      ))}
                      {activeTab === 'diploma' && diplomaSubjects.map((subject) => (
                        <SelectItem
                          key={subject.value}
                          value={subject.value}
                          className="focus:bg-secondary focus:text-secondary-foreground"
                        >
                          {subject.label}
                        </SelectItem>
                      ))}
                      {activeTab === 'degree' && degreeSubjects.map((subject) => (
                        <SelectItem
                          key={subject.value}
                          value={subject.value}
                          className="focus:bg-secondary focus:text-secondary-foreground"
                        >
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {renderInputFields(selectedSubject)}
                <div className="flex justify-between gap-4 pt-2">
                  <Button
                    type="button"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium"
                    onClick={() => {
                      if (activeTab === 'foundation') handleAddFoundationCourse();
                      else if (activeTab === 'diploma') handleAddDiplomaCourse();
                      else handleAddDegreeCourse();
                    }}
                    disabled={!selectedSubject}
                  >
                    Add Course
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="px-6 bg-transparent border-border text-foreground hover:bg-secondary transition-colors"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Tables */}
          {activeTab === 'foundation' && renderCourseTable(foundationCourses, 'foundation', foundationCGPA)}
          {activeTab === 'diploma' && renderCourseTable(diplomaCourses, 'diploma', diplomaCGPA)}
          {activeTab === 'degree' && renderCourseTable(degreeCourses, 'degree', degreeCGPA)}
        </TabsContent>
        <TabsContent value="diploma" className="mt-0 space-y-6">
          {renderCourseForm()}
        </TabsContent>
        <TabsContent value="degree" className="mt-0 space-y-6">
          {renderCourseForm()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 