import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-600">QuizMaker</Link>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors">Home</Link>
          {user ? (
            <>
              <Link to="/create-quiz" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors">Create Quiz</Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
