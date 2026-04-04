import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Trash2, Save } from 'lucide-react';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    };
    
    // validate that all options are filled
    for(let q of questions) {
      if(!q.questionText || q.options.some(opt => !opt) || !q.correctAnswer) {
        alert("Please fill all questions, options, and select a correct answer.");
        return;
      }
    }

    try {
      await axios.post('http://localhost:5000/quiz/create', { title, questions }, config);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to create quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Create New Quiz</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">Quiz Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="E.g., JavaScript Fundamentals"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg transition-all" 
            required 
          />
        </div>

        <div className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
              {questions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeQuestion(qIndex)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">Question {qIndex + 1}</label>
                <input 
                  type="text" 
                  value={q.questionText} 
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)} 
                  placeholder="What is your question?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      name={`correct-${qIndex}`} 
                      checked={q.correctAnswer === opt && opt !== ''} 
                      onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      value={opt} 
                      onChange={(e) => {
                        handleOptionChange(qIndex, oIndex, e.target.value);
                        if (q.correctAnswer === q.options[oIndex]) {
                          handleCorrectAnswerChange(qIndex, e.target.value);
                        }
                      }} 
                      placeholder={`Option ${oIndex + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                      required 
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 ml-6">* Select the radio button next to the correct option</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <button 
            type="button" 
            onClick={addQuestion} 
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <PlusCircle className="mr-2" size={20} /> Add Question
          </button>
          
          <button 
            type="submit" 
            className="flex items-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 shadow-sm transition-all hover:shadow-md"
          >
            <Save className="mr-2" size={20} /> Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
