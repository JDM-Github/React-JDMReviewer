USE JDMQuestionaire;

DROP PROCEDURE IF EXISTS delete_json_list;
DROP PROCEDURE IF EXISTS get_multiple_choice;
DROP PROCEDURE IF EXISTS get_enumeration;

DROP PROCEDURE IF EXISTS CreateQuestionAnswer;
DROP PROCEDURE IF EXISTS AddIdentificationQuestionAnswer;
DROP PROCEDURE IF EXISTS AddEnumerationQuestionAnswer;
DROP PROCEDURE IF EXISTS AddMultipleChoiceQuestionAnswer;
DROP PROCEDURE IF EXISTS CreateQuestion;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_json_list(IN question_answers JSON)
BEGIN
    DECLARE qa_id INT;
    DECLARE done INT DEFAULT 0;
    DECLARE cur CURSOR FOR SELECT JSON_UNQUOTE(JSON_EXTRACT(question_answers, CONCAT('$[', n.idx - 1, ']'))) 
                           FROM JSON_TABLE(question_answers, '$[*]' COLUMNS (idx FOR ORDINALITY, val INT PATH '$')) n;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO qa_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        DELETE FROM QuestionAnswer WHERE id = qa_id;
    END LOOP;

    CLOSE cur;
END; //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS get_multiple_choice(IN multipleChoiceID INT)
BEGIN
    SELECT
        mc.correct_answer_id,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', qa.id,
                'message', qa.message
            )
        ) AS question_answers
    FROM MultipleChoice mc
    JOIN JSON_TABLE(
        mc.question_answers,
        '$[*]' COLUMNS(
            question_answer_id INT PATH '$'
        )
    ) AS jt
    JOIN QuestionAnswer qa ON jt.question_answer_id = qa.id
    WHERE mc.id = multipleChoiceID
    GROUP BY mc.correct_answer_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS get_enumeration(IN enumerationID INT)
BEGIN
    SELECT
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', qa.id,
                'message', qa.message
            )
        ) AS question_answers
    FROM Enumeration enumerate
    JOIN JSON_TABLE(
        enumerate.question_answers,
        '$[*]' COLUMNS(
            question_answer_id INT PATH '$'
        )
    ) AS jt
    JOIN QuestionAnswer qa ON jt.question_answer_id = qa.id
    WHERE enumerate.id = enumerationID;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CreateQuestionAnswer (
    IN message TEXT,
    OUT last_ID INT
)
BEGIN
    INSERT INTO QuestionAnswer (message) VALUES (message);
    SET last_ID = LAST_INSERT_ID();
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AddIdentificationQuestionAnswer(IN param INT, IN message TEXT)
BEGIN
    DECLARE last_ID INT;
    CALL CreateQuestionAnswer(message, last_ID);

    UPDATE Identification
    SET question_answer_id = last_ID
    WHERE id = param;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AddEnumerationQuestionAnswer(IN param INT, IN message TEXT)
BEGIN
    DECLARE last_ID INT;
    CALL CreateQuestionAnswer(message, last_ID);

    UPDATE Enumeration
    SET question_answers = JSON_ARRAY_APPEND(question_answers, '$', last_ID)
    WHERE id = param;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AddMultipleChoiceQuestionAnswer(IN param INT, IN message TEXT)
BEGIN
    DECLARE last_ID INT;
    CALL CreateQuestionAnswer(message, last_ID);

    UPDATE MultipleChoice
    SET question_answers = JSON_ARRAY_APPEND(question_answers, '$', last_ID)
    WHERE id = param;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CreateQuestion (
    IN subject_id INT,
    IN message TEXT,
    IN question_type ENUM("IDENTIFICATION", "MULTIPLE CHOICE", "ENUMERATION")
)
BEGIN
    DECLARE new_identification_id INT DEFAULT NULL;
    DECLARE new_multiple_choice_id INT DEFAULT NULL;
    DECLARE new_enumeration_id INT DEFAULT NULL;
    DECLARE first_question_answer_id INT;

    INSERT INTO Identification (question_answer_id) VALUES (NULL);
    SET new_identification_id = LAST_INSERT_ID();
    CALL AddIdentificationQuestionAnswer(new_identification_id, "IDENTIFICATION");

    INSERT INTO MultipleChoice (question_answers, correct_answer_id) VALUES ('[]', NULL);
    SET new_multiple_choice_id = LAST_INSERT_ID();

    CALL AddMultipleChoiceQuestionAnswer(new_multiple_choice_id, "OPTION A");
    SET first_question_answer_id = LAST_INSERT_ID();

    CALL AddMultipleChoiceQuestionAnswer(new_multiple_choice_id, "OPTION B");
    CALL AddMultipleChoiceQuestionAnswer(new_multiple_choice_id, "OPTION C");
    CALL AddMultipleChoiceQuestionAnswer(new_multiple_choice_id, "OPTION D");

    UPDATE MultipleChoice
    SET correct_answer_id = first_question_answer_id
    WHERE id = new_multiple_choice_id;

    INSERT INTO Enumeration (question_answers) VALUES ('[]');
    SET new_enumeration_id = LAST_INSERT_ID();
    CALL AddEnumerationQuestionAnswer(new_enumeration_id, "ENUM 1");
    CALL AddEnumerationQuestionAnswer(new_enumeration_id, "ENUM 2");
    CALL AddEnumerationQuestionAnswer(new_enumeration_id, "ENUM 3");

    INSERT INTO Questions (subject_id, message, question_type, identification_id, multiple_choice_id, enumeration_id)
    VALUES (subject_id, message, question_type, new_identification_id, new_multiple_choice_id, new_enumeration_id);

END //
DELIMITER ;
