const express = require('express');
const Quiz = require('../models/Quiz');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /quiz/create
router.post('/create', protect, async (req, res) => {
  const { title, questions } = req.body;
  
  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({ message: 'Title and at least one question are required' });
  }
  
  try {
    const quiz = new Quiz({
      title,
      creator: req.user._id,
      questions
    });
    const createdQuiz = await quiz.save();
    res.status(201).json(createdQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create quiz' });
  }
});

// @route   GET /quiz/all
router.get('/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).select('title questions');
    // Map to include number of questions
    const mapped = quizzes.map(q => ({
      _id: q._id,
      title: q.title,
      questionCount: q.questions.length
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /quiz/:id
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      // Exclude correct answers when sending to client
      const sanitizedQuiz = {
        _id: quiz._id,
        title: quiz.title,
        questions: quiz.questions.map(q => ({
          _id: q._id,
          questionText: q.questionText,
          options: q.options
        }))
      };
      res.json(sanitizedQuiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /quiz/submit
router.post('/submit', async (req, res) => {
  const { quizId, answers } = req.body; 
  // answers format: [{ questionId, selectedOption }]
  
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;
    const results = quiz.questions.map(q => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedOption === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        questionId: q._id,
        questionText: q.questionText,
        selectedOption: userAnswer ? userAnswer.selectedOption : null,
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    res.json({
      score,
      total: quiz.questions.length,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
