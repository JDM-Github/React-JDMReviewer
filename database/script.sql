DROP DATABASE IF EXISTS JDMQuestionaire;
CREATE DATABASE IF NOT EXISTS JDMQuestionaire;
USE JDMQuestionaire;

CREATE TABLE QuestionAnswer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL
);

CREATE TABLE Identification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_answer_id INT NOT NULL,
    FOREIGN KEY (question_answer_id) REFERENCES QuestionAnswer(id) ON DELETE CASCADE
);

CREATE TABLE MultipleChoice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_answers JSON NOT NULL,
    correct_answer_id INT NOT NULL,
    FOREIGN KEY (correct_answer_id) REFERENCES QuestionAnswer(id) ON DELETE CASCADE
);

CREATE TABLE Enumeration (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_answers JSON NOT NULL
);

CREATE TABLE QuestionSubject (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject VARCHAR(255) NOT NULL
);

CREATE TABLE Questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_id INT NOT NULL,
    message TEXT NOT NULL,
    question_type ENUM ("IDENTIFICATION", "MULTIPLE CHOICE", "ENUMERATION"),
    identification_id INT DEFAULT NULL,
    multiple_choice_id INT DEFAULT NULL,
    enumeration_id INT DEFAULT NULL,
    FOREIGN KEY (identification_id) REFERENCES Identification(id) ON DELETE CASCADE,
    FOREIGN KEY (multiple_choice_id) REFERENCES MultipleChoice(id) ON DELETE CASCADE,
    FOREIGN KEY (enumeration_id) REFERENCES Enumeration(id) ON DELETE CASCADE
);


INSERT INTO QuestionSubject (subject) VALUES
("FUCK1"),
("FUCK2"),
("FUCK3"),
("FUCK4");

INSERT INTO Questions (subject_id, message, question_type) VALUES
(1, "Freaking Test1", "IDENTIFICATION"),
(2, "Freaking Test2", "IDENTIFICATION"),
(3, "Freaking Test3", "IDENTIFICATION");