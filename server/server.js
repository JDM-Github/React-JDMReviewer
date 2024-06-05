const express = require('express');
const sql     = require('mysql2');
const cors    = require('cors');
const path    = require('path');

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

		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeSQL();

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

	initializeRoutes()
	{
		if (!isInDevelopment)
		{
			this.app.get('*', (req, res) => {
				res.sendFile(path.join(__dirname, '../client/build/index.html'));
			});
		}

		this.app.get('/api/get-subjects',
		(req, res) => {
			this.connection.query(`SELECT * FROM QuestionSubject`,
			(err, results) => {
				if (err)
					res.status(500).json({ err: 'An error occurred while fetching additional details.' });

				res.json(results);
			});
		});

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
		this.postRoutes();
		this.putRoutes();
	}

	postRoutes()
	{
		this.app.post('/api/add-subject', (req, res) => {
			const { subject_name } = req.body;

			this.connection.query('INSERT INTO QuestionSubject (subject) VALUES (?)', [ subject_name ],
				(error, results) => {
					if (error) console.error('Error adding subject:', error);
				}
			);
		});
	}

	putRoutes()
	{
		this.app.put('/api/update-subject/:id', (req, res) => {
			const { id }       = req.params;
			const { subject  } = req.body;

			this.connection.query('UPDATE QuestionSubject SET subject = ? WHERE id = ?', [ subject, id ],
				(error, results) => {
					if (error) console.error('Error updating subject:', error);
				}
			);
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
