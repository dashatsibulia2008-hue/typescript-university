import {
  Student,
  Professor,
  AssociateProfessor,
  Staff,
} from "./person-hierarchy";
import { Course } from "./learning-units";
import { Faculty } from "./faculty";
import { InMemoryRepository } from "./repository";
import {
  JsonReportGenerator,
  XmlReportGenerator,
} from "./report-generator";

async function runDemonstration() {
  console.log("=== 1. Викладачі та адміністрація (Успадкування та поліморфізм) ===");
  const profShevchenko = new Professor(
    "t-1",
    "Тарас",
    "Шевченко",
    "t.shevchenko@univ.edu",
    20000
  );
  const docentKoval = new AssociateProfessor(
    "t-2",
    "Олена",
    "Коваль",
    "o.koval@univ.edu",
    16000
  );
  const adminPetrenko = new Staff(
    "st-1",
    "Марія",
    "Петренко",
    "m.petrenko@univ.edu",
    "Деканат ФКН",
    "Методист"
  );

  console.log(`${profShevchenko.getRoleDescription()} | Зарплата: ${profShevchenko.calculateSalary()}`);
  console.log(`${docentKoval.getRoleDescription()} | Зарплата: ${docentKoval.calculateSalary()}`);
  console.log(adminPetrenko.generateServiceBadge());

  console.log("\n=== 2. Факультет та групи (Композиція) ===");
  const csFaculty = new Faculty("f-1", "Факультет комп'ютерних наук");
  const groupKN21 = csFaculty.createGroup("g-kn21", "КН-21", docentKoval);
  console.log(`Створено групу "${groupKN21.name}" на факультеті "${csFaculty.name}"`);

  console.log("\n=== 3. Студенти, курси та передумови (Prerequisites) ===");
  const studentIvan = new Student("s-101", "Іван", "Мельник", "ivan.m@univ.edu", "KB123456");
  const studentAnna = new Student("s-102", "Анна", "Бойко", "anna.b@univ.edu", "KB123457");

  groupKN21.addStudent(studentIvan);
  groupKN21.addStudent(studentAnna);

  const jsBasicCourse = new Course("c-js", "JavaScript Fundamentals", 4, docentKoval);
  const tsCourse = new Course("c-ts", "TypeScript Enterprise Patterns", 5, profShevchenko, [jsBasicCourse]);

  // Іван склав базовий JS, Анна — ще ні
  studentIvan.addGrade({ courseId: jsBasicCourse.id, score: 85, date: new Date() });
  console.log(`Чи може Іван записатися на TS? ${tsCourse.canEnroll(studentIvan)}`); // true
  console.log(`Чи може Анна записатися на TS? ${tsCourse.canEnroll(studentAnna)}`); // false

  // Виставляємо оцінки з TS
  studentIvan.addGrade({ courseId: tsCourse.id, score: 95, date: new Date() });
  studentAnna.addGrade({ courseId: tsCourse.id, score: 98, date: new Date() });

  console.log(`GPA Івана: ${studentIvan.calculateGPA()}`);
  console.log(`GPA Анни: ${studentAnna.calculateGPA()}`);
  console.log(`Середній бал групи ${groupKN21.name}: ${groupKN21.getGroupAverageScore()}`);

  console.log("\n=== 4. Репозиторій з фільтрацією (findWhere) ===");
  const studentRepo = new InMemoryRepository<Student>();
  await studentRepo.save(studentIvan);
  await studentRepo.save(studentAnna);

  const honorsStudents = await studentRepo.findWhere((s) => s.calculateGPA() >= 95);
  console.log(`Відмінники (GPA >= 95): ${honorsStudents.map((s) => s.fullName).join(", ")}`);

  console.log("\n=== 5. Експорт звітів (Шаблонний метод) ===");
  const jsonReport = new JsonReportGenerator();
  const xmlReport = new XmlReportGenerator();

  console.log("--- JSON Звіт ---");
  console.log(jsonReport.generateReport(groupKN21));

  console.log("\n--- XML Звіт ---");
  console.log(xmlReport.generateReport(groupKN21));
}

runDemonstration().catch(console.error);