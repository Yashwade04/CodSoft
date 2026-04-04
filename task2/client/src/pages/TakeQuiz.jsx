import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
         const { data } = await axios.get(`http://localhost:5000/quiz/${id}`);
         setQuiz(data);
         setLoading(false);
      } catch (error) {
         console.error(error);
         setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (option) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === quiz.questions[currentQuestionIndex]._id);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex].selectedOption = option;
    } else {
      newAnswers.push({
        questionId: quiz.questions[currentQuestionIndex]._id,
        selectedOption: option
      });
    }
    setAnswers(newAnswers);
  };

  const currentAnswer = answers.find(a => a.questionId === quiz?.questions[currentQuestionIndex]?._id)?.selectedOption;

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/quiz/submit', {
        quizId: id,
        answers
      });
      navigate(`/quiz/${id}/result`, { state: { result: data, quizTitle: quiz.title } });
    } catch (error) {
       console.error('Failed to submit quiz', error);
       alert('Failed to submit quiz');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!quiz) return <div className="text-center py-20 text-xl text-gray-600">Quiz not found</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{quiz.title}</h2>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="mt-2 text-sm text-gray-500 font-medium text-right">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-8">
           <h3 className="text-2xl font-semibold text-gray-800 mb-8">{currentQuestion.questionText}</h3>
           
           <div className="space-y-4">
             {currentQuestion.options.map((opt, i) => (
                <div 
                  key={i}
                  onClick={() => handleOptionSelect(opt)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center
                    ${currentAnswer === opt 
                      ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center
                    ${currentAnswer === opt ? 'border-indigo-600' : 'border-gray-300'}`}>
                    {currentAnswer === opt && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                  </div>
                  <span className={`text-lg ${currentAnswer === opt ? 'text-indigo-900 font-medium' : 'text-gray-700'}`}>
                    {opt}
                  </span>
                </div>
             ))}
           </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors
              ${currentQuestionIndex === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-200 bg-gray-100'}`}
          >
            <ArrowLeft size={18} className="mr-2" /> Previous
          </button>
          
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button 
               onClick={handleSubmit}
               className="flex items-center bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
               <CheckCircle size={18} className="mr-2" /> Submit Quiz
            </button>
          ) : (
            <button 
               onClick={handleNext}
               className="flex items-center bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
               Next <ArrowRight size={18} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
