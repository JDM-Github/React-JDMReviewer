# Questionnaire Website

This is a Questionnaire Website created with React for the frontend and Node.js for the backend, developed by JDM.

## Features

- **Create Questions:** Users can create various types of questions including Identification, MultipleChoice, Enumeration, and MultiSelection.
- **Questionnaire:** Take the questionnaire with options to randomize questions, set a limit on the number of questions, and review answers.
- **Multiple Answers:** Supports multiple correct answers stored as arrays. For example, `["OOP", "Object Oriented Programming"]`.
- **User Dashboard:** 
  - User profile section.
  - Recently opened question subjects displayed horizontally scrollable at the top.
  - All question subjects displayed vertically scrollable at the bottom.

## Special Keywords

In question messages, you can use special keywords to embed dynamic content:
- Images: `This picture is ${image={src='link', autodown=true, radius=20px, size=[90%, auto]}}`
- Text formatting: `This text is ${font={bold=true, size=2rem, color=red}}TEXT${/font}`
- Links: `This text is ${link='link'}`

## Theme Editor

Customize the look and feel of the website using the theme editor.

## Future Plans

- Add more features and question types.
- Enhance the user experience and functionality.

---

Feel free to contribute or suggest improvements!