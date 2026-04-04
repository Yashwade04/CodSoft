import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiArrowLeft, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import Modal from '../components/Modal';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    
    const [taskForm, setTaskForm] = useState({
        title: '',
        status: 'To Do',
        deadline: ''
    });

    const fetchProjectAndTasks = async () => {
        try {
            const [projRes, tasksRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`http://localhost:5000/api/tasks/project/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setProject(projRes.data);
            setTasks(tasksRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
            navigate('/');
        }
    };

    useEffect(() => {
        fetchProjectAndTasks();
    }, [id]);

    const handleOpenTaskModal = (task = null) => {
        if (task) {
            setIsEditMode(true);
            setCurrentTaskId(task._id);
            setTaskForm({
                title: task.title,
                status: task.status,
                deadline: task.deadline ? task.deadline.split('T')[0] : ''
            });
        } else {
            setIsEditMode(false);
            setCurrentTaskId(null);
            setTaskForm({ title: '', status: 'To Do', deadline: '' });
        }
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:5000/api/tasks/${currentTaskId}`, taskForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`http://localhost:5000/api/tasks/project/${id}`, taskForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsTaskModalOpen(false);
            fetchProjectAndTasks();
        } catch (err) {
            console.error('Error saving task', err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Delete this task?')) {
            try {
                await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProjectAndTasks();
            } catch (err) {
                console.error('Error deleting task', err);
            }
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjectAndTasks();
        } catch (err) {
            console.error('Error updating task status', err);
        }
    };

    if (!project) return <div>Loading project details...</div>;

    const renderTasksGrid = (statusFilter) => {
        const filteredTasks = tasks.filter(t => t.status === statusFilter);
        return (
            <div className="kanban-column">
                <div className="kanban-header">
                    <h4>{statusFilter}</h4>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{filteredTasks.length}</span>
                </div>
                {filteredTasks.map(task => (
                    <div key={task._id} className="glass task-card">
                        <div className="task-actions">
                            <button onClick={() => handleOpenTaskModal(task)}><FiEdit2 /></button>
                            <button onClick={() => handleDeleteTask(task._id)}><FiTrash2 /></button>
                        </div>
                        <h5>{task.title}</h5>
                        <div style={{ marginBottom: '1rem' }}>
                            <select 
                                className="form-control" 
                                style={{ padding: '0.25rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)' }}
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="task-meta">
                            <span>Deadline:</span>
                            <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}</span>
                        </div>
                    </div>
                ))}
                {filteredTasks.length === 0 && (
                    <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No tasks in this list
                    </div>
                )}
            </div>
        );
    };

    return (
        <div>
            <div className="top-header">
                <div>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                        <FiArrowLeft /> Back to Dashboard
                    </Link>
                    <h1 style={{ fontSize: '2.5rem' }}>{project.title}</h1>
                    <p>{project.description}</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenTaskModal()}>
                    <FiPlus /> New Task
                </button>
            </div>

            <div className="kanban-board">
                {renderTasksGrid('To Do')}
                {renderTasksGrid('In Progress')}
                {renderTasksGrid('Completed')}
            </div>

            <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={isEditMode ? "Edit Task" : "Create New Task"}>
                <form onSubmit={handleSaveTask}>
                    <div className="form-group">
                        <label>Task Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={taskForm.title}
                            onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                            className="form-control"
                            value={taskForm.status}
                            onChange={e => setTaskForm({...taskForm, status: e.target.value})}
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Deadline</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={taskForm.deadline}
                            onChange={e => setTaskForm({...taskForm, deadline: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {isEditMode ? 'Update Task' : 'Save Task'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ProjectDetails;
