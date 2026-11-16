import { AcademicGroup } from "./learning-units";

/**
 * Завдання 3: Абстрактний генератор звітів (Шаблонний метод)
 */
export abstract class ReportGenerator {
  /**
   * Шаблонний метод (Template Method), що визначає скелет алгоритму генерації звіту
   */
  public generateReport(group: AcademicGroup): string {
    const header = this.generateHeader(group);
    const body = this.generateBody(group);
    const footer = this.generateFooter(group);
    return `${header}\n${body}\n${footer}`;
  }

  protected abstract generateHeader(group: AcademicGroup): string;
  protected abstract generateBody(group: AcademicGroup): string;
  protected abstract generateFooter(group: AcademicGroup): string;
}

/**
 * Генератор звіту у форматі JSON
 */
export class JsonReportGenerator extends ReportGenerator {
  protected generateHeader(group: AcademicGroup): string {
    return `{\n  "groupId": "${group.id}",\n  "groupName": "${group.name}",\n  "curator": "${group.curator?.fullName ?? "Не призначено"}",`;
  }

  protected generateBody(group: AcademicGroup): string {
    const studentsJson = group
      .getStudents()
      .map(
        (s) =>
          `    { "id": "${s.id}", "name": "${s.fullName}", "card": "${s.studentCardNumber}", "gpa": ${s.calculateGPA()} }`
      )
      .join(",\n");
    return `  "students": [\n${studentsJson}\n  ],`;
  }

  protected generateFooter(group: AcademicGroup): string {
    return `  "averageGroupScore": ${group.getGroupAverageScore()}\n}`;
  }
}

/**
 * Генератор звіту у форматі XML
 */
export class XmlReportGenerator extends ReportGenerator {
  protected generateHeader(group: AcademicGroup): string {
    return `<GroupReport id="${group.id}" name="${group.name}" curator="${group.curator?.fullName ?? "Не призначено"}">`;
  }

  protected generateBody(group: AcademicGroup): string {
    const studentsXml = group
      .getStudents()
      .map(
        (s) =>
          `    <Student id="${s.id}" card="${s.studentCardNumber}" gpa="${s.calculateGPA()}">${s.fullName}</Student>`
      )
      .join("\n");
    return `  <Students>\n${studentsXml}\n  </Students>`;
  }

  protected generateFooter(group: AcademicGroup): string {
    return `  <AverageGroupScore>${group.getGroupAverageScore()}</AverageGroupScore>\n</GroupReport>`;
  }
}