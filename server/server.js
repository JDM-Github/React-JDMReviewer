const express = require('express');
const sql     = require('mysql2');
const cors    = require('cors');
const path    = require('path');

const SubjectController = require('./subjectController');

const dbConfig = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'JDMQuestionaire'
};
const isInDevelopment = true;

class MainBackend
{
	constructor()
	{
		this.app = express();
		this.port = process.env.PORT || 5000;

		this.initializeSQL();
		this.initializeMiddlewares();

		this.initializeSubModules();
		this.initializeRoutes();

		this.start();
		this.setupCloseHandler();
	}

	initializeSQL()
	{
		this.connection = sql.createConnection(dbConfig);
		this.connection.connect((error) => {
			if (error)
			{
				console.error('Error connecting to MySQL database:', error);
				return;
			}
			console.log('Connected to MySQL database');
		});
	}

	initializeMiddlewares()
	{
		this.app.use(cors({
			origin: 'http://localhost:3000',
			credentials: true,
			optionSuccessStatus: 200
		}));
		this.app.use(express.json());

		if (!isInDevelopment)
			this.app.use(express.static(path.join(__dirname, '../client/build')));
	}

	initializeSubModules()
	{
		this.subjectController = new SubjectController(this.connection);
	}

	initializeRoutes()
	{
		if (!isInDevelopment)
		{
			this.app.get('*', (req, res) => {
				res.sendFile(path.join(__dirname, '../client/build/index.html'));
			});
		}
		this.getRoutes();
		this.postRoutes();
		this.putRoutes();
	}

	getRoutes()
	{
		this.app.get('/api/get-subjects', this.subjectController.getAllSubjects.bind(this.subjectController));

		this.app.get('/api/get-question/:question_id', (req, res) => {
			const { question_id } = req.params;
			if (question_id === null)
			{
				res.json({});
				return
			}

			this.connection.query( 'SELECT * FROM Questions WHERE id = ?', [question_id],
				(error, results) => {
					if (!error) res.json(results);
				}
			);
		});

		this.app.get('/api/get-question-ids/:subject_id', (req, res) => {
			const { subject_id } = req.params;
			if (subject_id === null)
			{
				res.json({});
				return
			}

			this.connection.query( 'SELECT id FROM Questions WHERE subject_id = ?', [subject_id],
				(error, results) => {
					if (!error) res.json(results);
				}
			);
		});

		this.app.get('/api/identification/:identification_id', (req, res) => {
			const { identification_id } = req.params;
			if (identification_id === null)
			{
				res.json([{message: 'IDENTIFICATION IS NULL'}]);
				return
			}

			this.connection.query( 'SELECT q.message FROM Identification i INNER JOIN QuestionAnswer q ON i.question_answer_id = q.id WHERE i.id = ?', [identification_id],
				(error, results) => {
					if (!error)
					{
						if (results.length <= 0)
							res.json([{'message': 'IDENTIFICATION IS EMPTY'}]);
						else res.json(results);
					}
				});
		});

		this.app.get('/api/multiple_choice/:multiple_choice_id', (req, res) => {
			const { multiple_choice_id } = req.params;
			if (multiple_choice_id === null)
			{
				res.json([{"correct_answer_id":null ,"question_answers": []}]);
				return;
			}

			this.connection.query('CALL get_multiple_choice(?)', [multiple_choice_id],
				(error, results) => {
					if (!error)
					{
						if (results[0].length <= 0)
							res.json([{"correct_answer_id":null ,"question_answers": []}]);
						else
							res.json(results[0]);
					}
				});
		});

		this.app.get('/api/enumeration/:enumeration_id', (req, res) => {
			const { enumeration_id } = req.params;
			if (enumeration_id === null)
			{
				res.json([{"question_answers": []}]);
				return;
			}

			this.connection.query('CALL get_enumeration(?)', [enumeration_id],
				(error, results) => {
					if (!error)
					{
						if (results[0].length <= 0 || results[0][0].question_answers === null)
							res.json([{"question_answers": []}]);
						else
							res.json(results[0]);
					}
				});
		});
	}

	postRoutes()
	{
		this.app.post('/api/add-subject', this.subjectController.addSubject.bind(this.subjectController));
		this.app.post('/api/del-subject', this.subjectController.deleteSubject.bind(this.subjectController));

		this.app.post('/api/add-question', (req, res) => {
			const { subject_id } = req.body;

			this.connection.query('CALL CreateQuestion(?, ?, ?)', [ subject_id, "", "MULTIPLE CHOICE" ],
				(error, results) => {
					if (error) console.error('Error adding question:', error);
					else res.status(200).json({ message: 'Question added successfully' });
				}
			);
		});

		this.app.post('/api/del-question', (req, res) => {
			const { question_id } = req.body;

			this.connection.query('DELETE FROM Questions WHERE id = ?', [ question_id ],
				(error, results) => {
					if (error) console.error('Error deleting subject:', error);
					else res.status(200).json({ message: 'Question deleted successfully' });
				}
			);
		});

		this.app.post('/api/update-question-message', (req, res) => {
			const { question_id, message } = req.body;

			this.connection.query('UPDATE Questions SET message = ? WHERE id = ?', [ message, question_id ],
				(error, results) => {
					if (error) console.error('Error updating question:', error);
					else res.status(200).json({ message: 'Question updated successfully' });
				}
			);
		});

		this.app.post('/api/update-question-type', (req, res) => {
			const { question_id, type } = req.body;

			this.connection.query('UPDATE Questions SET question_type = ? WHERE id = ?', [ type, question_id ],
				(error, results) => {
					if (error) console.error('Error updating question:', error);
					else res.status(200).json({ message: 'Question updated successfully' });
				}
			);
		});




		this.app.post('/api/update-identification', (req, res) => {
			const { identification_id, message } = req.body;

			this.connection.query('UPDATE QuestionAnswer SET message = ? WHERE id = (SELECT question_answer_id FROM Identification WHERE id = ?)',
				[ message, identification_id ],
				(error, results) => {
					if (error) console.error('Error updating identification:', error);
					else res.status(200).json({ message: 'Identification updated successfully' });
				}
			);
		});

		this.app.post('/api/update-question-answer', (req, res) => {
			const { id, message } = req.body;

			this.connection.query('UPDATE QuestionAnswer SET message = ? WHERE id = ?',
				[ message, id ],
				(error, results) => {
					if (error) console.error('Error updating question answer:', error);
					else res.status(200).json({ message: 'QuestionAnswer updated successfully' });
				}
			);
		});

		this.app.post('/api/update-multiple-choice-correct-id', (req, res) => {
			const { multi_choice_id, correct_id } = req.body;

			this.connection.query('UPDATE MultipleChoice SET correct_answer_id = ? WHERE id = ?', [ correct_id, multi_choice_id ],
				(error, results) => {
					if (error) console.error('Error adding multiple choice:', error);
					else res.status(200).json({ message: 'Multiple Choice updated successfully' });
				}
			);
		});

		this.app.post('/api/add-multiple-choice', (req, res) => {
			const { multi_choice_id } = req.body;

			this.connection.query('CALL AddMultipleChoiceQuestionAnswer(?, "CHOICE")', [ multi_choice_id ],
				(error, results) => {
					if (error) console.error('Error adding multiple choice:', error);
					else res.status(200).json({ message: 'Multiple Choice added successfully' });
				}
			);
		});

		this.app.post('/api/delete-multiple-choice', (req, res) => {
			const { multi_choice_id, idx } = req.body;

			this.connection.query('UPDATE MultipleChoice SET question_answers = JSON_REMOVE(question_answers, "$[?]") WHERE id = ?', [ idx, multi_choice_id ],
				(error, results) => {
					if (error) console.error('Error removing multiple choice:', error, idx);
					else res.status(200).json({ message: 'Multiple Choice remove successfully' });
				}
			);
		});

		this.app.post('/api/add-enumeration', (req, res) => {
			const { enumeration_id } = req.body;

			this.connection.query('CALL AddEnumerationQuestionAnswer(?, "CHOICE")', [ enumeration_id ],
				(error, results) => {
					if (error) console.error('Error adding enumeration:', error);
					else res.status(200).json({ message: 'Enumeration added successfully' });
				}
			);
		});

		this.app.post('/api/delete-enumeration', (req, res) => {
			const { enumeration_id, idx } = req.body;

			this.connection.query('UPDATE Enumeration SET question_answers = JSON_REMOVE(question_answers, "$[?]") WHERE id = ?', [ idx, enumeration_id ],
				(error, results) => {
					if (error) console.error('Error adding enumeration:', error);
					else res.status(200).json({ message: 'Enumeration added successfully' });
				}
			);
		});
	}

	putRoutes()
	{
		this.app.put('/api/update-subject/:id', this.subjectController.updateSuject.bind(this.subjectController));

		this.app.put('/api/reminder', (req, res) => {
			const { message } = req.body;
			console.log("Reminder: ", message);
		});
	}


	start()
	{
		this.app.listen(this.port, () =>
		{
			console.log(`Server is running on http://localhost:${this.port}`);
		});
		
	}

	setupCloseHandler()
	{
		process.on('SIGINT', () =>
		{
			this.connection.end();
			console.log('MySQL connection closed');
			process.exit();
		});
	}
}

function main()
{
	const mainBackend = new MainBackend();
}

main();
