USE JDMQuestionaire;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS delete_question_answers_from_enumeration(IN enumerationId INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE answerId INT;
    DECLARE cur CURSOR FOR 
        SELECT JSON_UNQUOTE(JSON_EXTRACT(question_answers, CONCAT('$[', idx, ']')))
        FROM Enumeration,
        JSON_TABLE(question_answers, '$[*]' COLUMNS (idx FOR ORDINALITY)) jt
        WHERE id = enumerationId;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO answerId;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        DELETE FROM QuestionAnswer WHERE id = answerId;
    END LOOP;

    CLOSE cur;

END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER IF NOT EXISTS before_delete_enumeration
BEFORE DELETE ON Enumeration
FOR EACH ROW
BEGIN
    CALL delete_question_answers_from_enumeration(OLD.id);
END //

DELIMITER ;