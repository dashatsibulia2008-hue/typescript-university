/**
 * Базовий контракт для будь-якої сутності з унікальним ідентифікатором
 */
export interface Identifiable<ID = string> {
  readonly id: ID;
}

/**
 * Рівні посад викладацького складу
 */
export type AcademicTitle = "Assistant" | "AssociateProfessor" | "Professor";

/**
 * Структура оцінки (Асоціація зі студентом і курсом)
 */
export interface Grade {
  readonly courseId: string;
  readonly score: number; // 0 - 100
  readonly date: Date;
}

/**
 * Константи предметної області
 */
export const ACADEMIC_CONSTANTS = {
  MIN_GRADE: 0,
  MAX_GRADE: 100,
  PASSING_GRADE: 60,
  PROFESSOR_SALARY_MULTIPLIER: 1.5,
  ASSOCIATE_PROFESSOR_SALARY_MULTIPLIER: 1.25,
} as const;