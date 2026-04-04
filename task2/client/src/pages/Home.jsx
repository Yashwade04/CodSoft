import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, User, ArrowRight } from 'lucide-react';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/quiz/all');
        setQuizzes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quizzes', error);
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto mt-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Test your knowledge with QuizMaker</h1>
        <p className="mt-4 text-xl text-gray-500">Create custom quizzes and share them with the world, or challenge yourself with existing ones.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/create-quiz" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-all hover:-translate-y-0.5 flex items-center">
            <span className="mr-2">Create a Quiz</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BookOpen className="mr-2 text-indigo-600" />
          Available Quizzes
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-gray-500 text-lg">No quizzes available yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {quizzes.map((quiz) => (
               <div key={quiz._id} className="bg-white rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                 <div className="p-6">
                   <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                   <p className="text-sm text-gray-500 mb-6 flex items-center">
                     <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold mr-2">{quiz.questionCount} Questions</span>
                   </p>
                   <Link to={`/quiz/${quiz._id}`} className="w-full bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-medium py-2 px-4 border border-gray-200 hover:border-indigo-200 rounded-lg transition-all flex justify-center items-center">
                     Take Quiz
                   </Link>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
