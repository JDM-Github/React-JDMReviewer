USE JDMQuestionaire;
SOURCE procedure.sql;

DROP TRIGGER IF EXISTS delete_question_answer;
DROP TRIGGER IF EXISTS delete_question_answers_after_multiple_choice;
DROP TRIGGER IF EXISTS delete_question_answers_after_identification;
DROP TRIGGER IF EXISTS delete_question_type_after_questions;
DROP TRIGGER IF EXISTS delete_question_after_subjects;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS delete_question_answer
AFTER DELETE ON Identification
FOR EACH ROW
BEGIN
    DELETE FROM QuestionAnswer WHERE id = OLD.id;
END; //
DELIMITER ;

DELIMITER //

DELIMITER //
CREATE TRIGGER IF NOT EXISTS delete_question_answers_after_multiple_choice
AFTER DELETE ON MultipleChoice
FOR EACH ROW
BEGIN
    CALL delete_json_list(OLD.question_answers);
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS delete_question_answers_after_identification
AFTER DELETE ON Enumeration
FOR EACH ROW
BEGIN
    CALL delete_json_list(OLD.question_answers);
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS delete_question_type_after_questions
AFTER DELETE ON Questions
FOR EACH ROW
BEGIN
    DELETE FROM Identification WHERE OLD.identification_id  = id;
    DELETE FROM MultipleChoice WHERE OLD.multiple_choice_id = id;
    DELETE FROM Enumeration    WHERE OLD.enumeration_id     = id;
END; //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS delete_question_after_subjects
AFTER DELETE ON QuestionSubject
FOR EACH ROW
BEGIN
    DELETE FROM Questions WHERE OLD.id = subject_id;
END; //
DELIMITER ;

