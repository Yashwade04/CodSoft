import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Award, ArrowLeft } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const { result, quizTitle } = location.state || {};

  if (!result) return <div className="text-center mt-20">No results found.</div>;

  const percentage = (result.score / result.total) * 100;
  
  return (
    <div className="max-w-3xl mx-auto mt-10 pb-20">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center mb-10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
        <Award className="w-20 h-20 text-indigo-500 mx-auto mb-4 mt-4" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Quiz Completed!</h2>
        <p className="text-gray-500 mb-8">{quizTitle}</p>
        
        <div className="flex justify-center items-center space-x-12">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Your Score</p>
            <p className="text-5xl font-black text-indigo-600">{result.score}<span className="text-2xl text-gray-400">/{result.total}</span></p>
          </div>
          <div className="h-16 w-px bg-gray-200"></div>
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Accuracy</p>
            <p className="text-5xl font-black text-gray-900">{percentage.toFixed(0)}<span className="text-3xl text-gray-400">%</span></p>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-6">Detailed Summary</h3>
      
      <div className="space-y-6">
        {result.results.map((q, index) => (
          <div key={q.questionId} className={`p-6 rounded-xl border ${q.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
            <div className="flex items-start">
              <div className="mt-1 mr-3">
                {q.isCorrect ? (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                ) : (
                  <XCircle className="text-red-500 w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{index + 1}. {q.questionText}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Your Answer</p>
                    <p className={`font-medium ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {q.selectedOption || <span className="italic text-gray-400">Skipped</span>}
                    </p>
                  </div>
                  
                  {!q.isCorrect && (
                    <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-1">Correct Answer</p>
                      <p className="font-medium text-gray-900">{q.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex justify-center">
        <Link to="/" className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 px-6 py-3 rounded-lg transition-colors">
          <ArrowLeft className="mr-2 w-5 h-5" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Result;
