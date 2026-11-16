import {
  Identifiable,
  AcademicTitle,
  Grade,
  ACADEMIC_CONSTANTS,
} from "./basic-contracts";

/**
 * Базовий абстрактний клас Person
 */
export abstract class Person implements Identifiable<string> {
  private _email!: string;

  constructor(
    public readonly id: string,
    public firstName: string,
    public lastName: string,
    email: string
  ) {
    this.email = email; // валідація через сетер
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    if (!value.includes("@") || !value.includes(".")) {
      throw new Error(`Невалідний email: ${value}`);
    }
    this._email = value;
  }

  abstract getRoleDescription(): string;
}

/**
 * Клас Student (IS-A Person)
 */
export class Student extends Person {
  private _grades: Grade[] = [];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    public readonly studentCardNumber: string
  ) {
    super(id, firstName, lastName, email);
  }

  public addGrade(grade: Grade): void {
    if (
      grade.score < ACADEMIC_CONSTANTS.MIN_GRADE ||
      grade.score > ACADEMIC_CONSTANTS.MAX_GRADE
    ) {
      throw new Error(
        `Оцінка повинна бути в діапазоні від ${ACADEMIC_CONSTANTS.MIN_GRADE} до ${ACADEMIC_CONSTANTS.MAX_GRADE}`
      );
    }
    this._grades.push(grade);
  }

  public getGrades(): readonly Grade[] {
    return this._grades;
  }

  /**
   * Перевірка, чи склав студент конкретний курс (для перевірки prerequisites)
   */
  public hasPassedCourse(courseId: string): boolean {
    return this._grades.some(
      (g) => g.courseId === courseId && g.score >= ACADEMIC_CONSTANTS.PASSING_GRADE
    );
  }

  public calculateGPA(): number {
    if (this._grades.length === 0) return 0;
    const total = this._grades.reduce((acc, curr) => acc + curr.score, 0);
    return Number((total / this._grades.length).toFixed(2));
  }

  override getRoleDescription(): string {
    return `Студент (Квиток: ${this.studentCardNumber}), Сер. бал: ${this.calculateGPA()}`;
  }
}

/**
 * Базовий клас Teacher (IS-A Person)
 */
export abstract class Teacher extends Person {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    public readonly academicTitle: AcademicTitle,
    protected baseSalary: number
  ) {
    super(id, firstName, lastName, email);
  }

  public abstract calculateSalary(): number;
}

/**
 * Професор
 */
export class Professor extends Teacher {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    baseSalary: number
  ) {
    super(id, firstName, lastName, email, "Professor", baseSalary);
  }

  public calculateSalary(): number {
    return this.baseSalary * ACADEMIC_CONSTANTS.PROFESSOR_SALARY_MULTIPLIER;
  }

  override getRoleDescription(): string {
    return `Професор кафедри (${this.fullName})`;
  }
}

/**
 * Доцент
 */
export class AssociateProfessor extends Teacher {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    baseSalary: number
  ) {
    super(id, firstName, lastName, email, "AssociateProfessor", baseSalary);
  }

  public calculateSalary(): number {
    return (
      this.baseSalary * ACADEMIC_CONSTANTS.ASSOCIATE_PROFESSOR_SALARY_MULTIPLIER
    );
  }

  override getRoleDescription(): string {
    return `Доцент кафедри (${this.fullName})`;
  }
}

/**
 * Завдання 1: Адміністративний персонал (Staff)
 */
export class Staff extends Person {
  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    public department: string,
    public position: string
  ) {
    super(id, firstName, lastName, email);
  }

  public generateServiceBadge(): string {
    return `[СЛУЖБОВЕ ПОСВІДЧЕННЯ #${this.id.toUpperCase()}] ${this.fullName} | Відділ: ${this.department} | Посада: ${this.position}`;
  }

  override getRoleDescription(): string {
    return `Адміністратор (${this.position}, відділ: ${this.department})`;
  }
}