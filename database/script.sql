DROP DATABASE IF EXISTS JDMQuestionaire;
CREATE DATABASE IF NOT EXISTS JDMQuestionaire;
USE JDMQuestionaire;

CREATE TABLE QuestionSubject (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject VARCHAR(255) NOT NULL
);
CREATE TABLE QuestionAnswer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message TEXT NOT NULL
);
CREATE TABLE Identification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_answer_id INT DEFAULT NULL
);
CREATE TABLE MultipleChoice (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_answers JSON NOT NULL,
    correct_answer_id INT DEFAULT NULL
);
CREATE TABLE Enumeration (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question_answers JSON NOT NULL
);
CREATE TABLE Questions (
    id                 INT  PRIMARY KEY AUTO_INCREMENT,
    subject_id         INT  NOT NULL,
    message            TEXT NOT NULL,
    identification_id  INT  NOT NULL,
    multiple_choice_id INT  NOT NULL,
    enumeration_id     INT  NOT NULL,
    question_type      ENUM ("IDENTIFICATION", "MULTIPLE CHOICE", "ENUMERATION"),

    FOREIGN KEY (identification_id)  REFERENCES Identification(id) ON DELETE CASCADE,
    FOREIGN KEY (multiple_choice_id) REFERENCES MultipleChoice(id) ON DELETE CASCADE,
    FOREIGN KEY (enumeration_id)     REFERENCES Enumeration   (id) ON DELETE CASCADE
);

SOURCE trigger.sql;
SOURCE fakedata.sql;
