import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiPlus, FiFolder, FiCheckCircle, FiClock } from 'react-icons/fi';
import Modal from '../components/Modal';

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '' });

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
        } catch (err) {
            console.error('Error fetching projects', err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/projects', newProject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            setNewProject({ title: '', description: '' });
            fetchProjects();
        } catch (err) {
            console.error('Error creating project', err);
        }
    };

    const handleDeleteProject = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if(window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`http://localhost:5000/api/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProjects();
            } catch (err) {
                console.error('Error deleting project', err);
            }
        }
    };

    return (
        <div>
            <div className="top-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Dashboard</h1>
                    <p>Overview of your projects and progress.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <FiPlus /> New Project
                </button>
            </div>

            <div className="stats-grid">
                <div className="glass stat-card">
                    <FiFolder className="icon" />
                    <h3>{projects.length}</h3>
                    <p>Total Projects</p>
                </div>
                <div className="glass stat-card">
                    <FiCheckCircle className="icon" style={{ color: 'var(--success)' }} />
                    <h3>Active</h3>
                    <p>Status</p>
                </div>
                <div className="glass stat-card">
                    <FiClock className="icon" style={{ color: 'var(--warning)' }} />
                    <h3>In Sync</h3>
                    <p>Last updated just now</p>
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Your Projects</h2>
            
            {projects.length === 0 ? (
                <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                    <p style={{ marginBottom: '1rem' }}>You don't have any projects yet.</p>
                    <button className="btn btn-secondary" onClick={() => setIsModalOpen(true)}>
                        Create your first project
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map(project => (
                        <Link to={`/projects/${project._id}`} key={project._id} style={{ color: 'inherit' }}>
                            <div className="glass project-card">
                                <h3>{project.title}</h3>
                                <p>{project.description || 'No description provided.'}</p>
                                <div className="project-actions">
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                    <button 
                                        className="btn btn-danger" 
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                        onClick={(e) => handleDeleteProject(project._id, e)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
                <form onSubmit={handleCreateProject}>
                    <div className="form-group">
                        <label>Project Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={newProject.title}
                            onChange={e => setNewProject({...newProject, title: e.target.value})}
                            required 
                            placeholder="e.g. Website Redesign"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            className="form-control" 
                            rows="4"
                            value={newProject.description}
                            onChange={e => setNewProject({...newProject, description: e.target.value})}
                            placeholder="Briefly describe the project..."
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Create Project
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Dashboard;
