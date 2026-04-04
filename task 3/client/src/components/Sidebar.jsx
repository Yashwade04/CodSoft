import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiFolder, FiSettings, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="glass sidebar">
            <div className="sidebar-logo">
                <FiFolder className="icon" />
                <span>Proxi</span>
            </div>
            
            <ul className="nav-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                        <FiHome /> Dashboard
                    </NavLink>
                </li>
            </ul>

            <div className="sidebar-footer">
                <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Signed in as <strong>{user?.name}</strong>
                </div>
                <button 
                    onClick={handleLogout} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <FiLogOut /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
