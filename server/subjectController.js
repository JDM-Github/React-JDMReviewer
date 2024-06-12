
class SubjectController
{
	constructor(connection)
	{
		this.connection = connection;
	}

	getAllSubjects(req, res)
	{
		this.connection.query(`SELECT * FROM QuestionSubject`, (err, results) => {
			if (err)
				res.status(500).json({ err: 'An error occurred while fetching additional details.' });
			else
				res.json(results);
		});
	};

	addSubject(req, res)
	{
		this.connection.query('INSERT INTO QuestionSubject (subject) VALUES (?)', [ "SUBJ" ],
			(error, results) => {
				if (error) console.error('Error adding subject:', error);
				else res.status(200).json({ message: 'Subject added successfully' });
			}
		);
	};

	deleteSubject(req, res)
	{
		const { subject_id } = req.body;

		this.connection.query('DELETE FROM QuestionSubject WHERE id = ?', [ subject_id ],
			(error, results) => {
				if (error) console.error('Error deleting subject:', error);
				else res.status(200).json({ message: 'Subject deleted successfully' });
			}
		);
	};

	updateSuject(req, res)
	{
		const { id }       = req.params;
		const { subject  } = req.body;

		this.connection.query('UPDATE QuestionSubject SET subject = ? WHERE id = ?', [ subject, id ],
			(error, results) => {
				if (error) console.error('Error updating subject:', error);
				else res.status(200).json({ message: 'Subject updated successfully' });
			}
		);
	};
}

module.exports = SubjectController;