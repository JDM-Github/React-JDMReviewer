USE JDMQuestionaire;

SELECT * FROM MultipleChoice;
-- UPDATE MultipleChoice SET question_answers = JSON_REMOVE(question_answers, JSON_UNQUOTE(JSON_SEARCH(question_answers, "one", "20"))) WHERE id = 2;

-- SELECT JSON_UNQUOTE(JSON_SEARCH(question_answers, 'one', '20')) AS path
-- FROM MultipleChoice
-- WHERE id = 2;

-- SELECT JSON_UNQUOTE(question_answers) as js FROM MultipleChoice WHERE id = 2;

-- SELECT  JSON_UNQUOTE(REPLACE(REPLACE(JSON_SEARCH(question_answers, 'all', '20'), '"', ''), '$', '')) AS index
-- FROM MultipleChoice 
-- WHERE id = 2;

UPDATE MultipleChoice
SET question_answers = JSON_REMOVE(question_answers, '$[7]')
WHERE id = 2;

-- WHERE id = 2 AND JSON_SEARCH(question_answers, 'one', '20') IS NOT NULL;

SELECT * FROM MultipleChoice;

-- UPDATE MultipleChoice SET question_answers = JSON_REMOVE(question_answers, JSON_UNQUOTE(JSON_SEARCH(question_answers, "one", ?))) WHERE id = ?;

-- -- SELECT "ORIGINAL";
-- -- SELECT * FROM Questions;
-- -- DELETE FROM Questions;

-- -- SELECT "ON DELETE";
-- SELECT * FROM QuestionAnswer;
-- SELECT * FROM Enumeration;
-- SELECT * FROM MultipleChoice;
-- SELECT * FROM Identification;

-- -- CALL AddEnumerationQuestionAnswer((SELECT enumeration_id FROM Questions WHERE id = 1), "Test Enumeration");

-- -- SELECT * FROM Questions;
-- -- SELECT * FROM Enumeration;

-- -- AddEnumerationQuestionAnswer()
-- -- SELECT * FROM QuestionAnswer;
