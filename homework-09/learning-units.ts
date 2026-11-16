import { Identifiable } from "./basic-contracts";
import { Student, Teacher } from "./person-hierarchy";

/**
 * Клас Course (Агрегує викладача та попередні курси - prerequisites)
 */
export class Course implements Identifiable<string> {
  private _prerequisites: Course[] = [];

  constructor(
    public readonly id: string,
    public title: string,
    public credits: number,
    private _instructor: Teacher,
    prerequisites: Course[] = []
  ) {
    this._prerequisites = [...prerequisites];
  }

  get instructor(): Teacher {
    return this._instructor;
  }

  get prerequisites(): readonly Course[] {
    return this._prerequisites;
  }

  public addPrerequisite(course: Course): void {
    if (course.id === this.id) {
      throw new Error("Курс не може бути передумовою для самого себе");
    }
    if (!this._prerequisites.some((c) => c.id === course.id)) {
      this._prerequisites.push(course);
    }
  }

  /**
   * Завдання 2: Перевірка, чи закрив студент необхідні попередні курси
   */
  public canEnroll(student: Student): boolean {
    return this._prerequisites.every((prereq) =>
      student.hasPassedCourse(prereq.id)
    );
  }

  public reassignInstructor(newInstructor: Teacher): void {
    console.log(
      `[Course Info] Зміна викладача курсу "${this.title}": ${newInstructor.fullName}`
    );
    this._instructor = newInstructor;
  }
}

/**
 * Клас AcademicGroup (Агрегує студентів та призначеного куратора)
 */
export class AcademicGroup implements Identifiable<string> {
  private _students: Map<string, Student> = new Map();

  constructor(
    public readonly id: string,
    public name: string,
    public curator?: Teacher
  ) {}

  public addStudent(student: Student): void {
    if (this._students.has(student.id)) {
      throw new Error(
        `Студент ${student.fullName} вже зарахований до групи ${this.name}`
      );
    }
    this._students.set(student.id, student);
  }

  public removeStudent(studentId: string): boolean {
    return this._students.delete(studentId);
  }

  public getStudents(): Student[] {
    return Array.from(this._students.values());
  }

  public getGroupAverageScore(): number {
    const list = this.getStudents();
    if (list.length === 0) return 0;
    const totalGpa = list.reduce((acc, s) => acc + s.calculateGPA(), 0);
    return Number((totalGpa / list.length).toFixed(2));
  }
}