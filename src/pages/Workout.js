import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Form, Card, Badge } from 'react-bootstrap';
import { FaHeart, FaDumbbell, FaLeaf, FaBasketballBall, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';
import FooterComponent from '../components/FooterComponent';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import UserContext from '../UserContext';

export default function Workout() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [workouts, setWorkouts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({ name: '', type: '', duration: '', status: '' });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "https://fitnessapi-agpalza-1.onrender.com/workouts";

  // Workout icons and type colors
  const workoutIcons = {
    cardio: <FaHeart color="red" />,
    strength: <FaDumbbell color="blue" />,
    flexibility: <FaLeaf color="green" />,
    sports: <FaBasketballBall color="orange" />,
    other: <FaClock color="gray" />
  };

  const typeColors = {
    cardio: 'danger',
    strength: 'primary',
    flexibility: 'success',
    sports: 'warning',
    other: 'secondary'
  };

  // Fetch workouts
 const fetchWorkouts = () => {
 
  if (!user || !token) {
    return;
  }
  fetch(`${API_URL}/getMyWorkouts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          if (res.status === 403 || res.status === 401) {
            notyf.error("Session expired. Please login again");
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(data.message || "Failed to fetch workouts");
        }
        return res.json();
      })
      .then(data => {
        if (data?.workouts) setWorkouts(data.workouts);
      })
      .catch(err => notyf.error(err.message));
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
// Add or update workout
const handleSubmit = (e) => {
  e.preventDefault();

  if (!user || !token) {
    notyf.error("Please login first");
    return;
  }


  if (!formData.name || !formData.type || !formData.duration || !formData.status) {
    notyf.error("Please fill all required fields");
    return;
  }

  const method = editingId ? 'PATCH' : 'POST';
  const url = editingId ? `${API_URL}/updateWorkout/${editingId}` : `${API_URL}/addWorkout`;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(formData)
  })
    .then(async res => {
      const data = await res.json();
      if (res.ok) {
        notyf.success(data.message || (editingId ? "Workout updated!" : "Workout added!"));
        setFormData({ name: '', type: '', duration: '', status: '' });
        setEditingId(null);
        fetchWorkouts();
      } else if (res.status === 409) {
        // Show conflict error in red
        notyf.error(data.message || "Workout already exists");
      } else {
        // Handle other errors
        notyf.error(data.message || "Something went wrong");
      }
    })
    .catch(() => notyf.error("Something went wrong"));
};

  // Edit workout
  const handleEdit = (w) => {
    if (!user) {
      notyf.error("You must be logged in to edit a workout");
      return;
    }
    setFormData({ name: w.name, type: w.type, duration: w.duration, status: w.status.toLowerCase() });
    setEditingId(w._id);
  };

  // Delete workout
  const handleDelete = (id) => {
    if (!user) {
      notyf.error("You must be logged in to delete a workout");
      return;
    }
    fetch(`${API_URL}/deleteWorkout/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        notyf.success(data.message);
        fetchWorkouts();
      })
      .catch(() => notyf.error("Failed to delete"));
  };

  // Filter workouts
  const filteredWorkouts = workouts.filter(w => {
    if (filter === 'all') return true;
    return filter === 'completed'
      ? w.status.toLowerCase() === 'completed'
      : w.status.toLowerCase() !== 'completed';
  });

  return (
    <div className="d-flex flex-column">
      <NavbarComponent isLoggedIn={!!user} toggleLogin={() => {}} />

       <hr className="my-4" />

      <main className="flex-grow-1 py-5 bg-light">

          <h2 className="mb-4 text-center">My Workouts Dashboard</h2>

          {/* Filter */}
          <div className="mb-4 d-flex justify-content-center gap-2">
            <Button variant={filter === 'all' ? 'primary' : 'outline-secondary'} onClick={() => setFilter('all')}>
              All
            </Button>
            <Button variant={filter === 'completed' ? 'primary' : 'outline-secondary'} onClick={() => setFilter('completed')}>
              Completed
            </Button>
            <Button variant={filter === 'pending' ? 'primary' : 'outline-secondary'} onClick={() => setFilter('pending')}>
              Pending
            </Button>
          </div>

          {/* Workout Cards */}
          <Row className="g-4">
            {filteredWorkouts.map(w => {
              const type = w.type ? w.type.toLowerCase() : 'other';
              const icon = workoutIcons[type] || workoutIcons.other;
              const color = typeColors[type] || typeColors.other;

              return (
                <Col lg={4} key={w._id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3 fs-3">{icon}</div>
                        <div>
                          <Card.Title>{w.name}</Card.Title>
                          <Badge bg={color} className="me-2">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Badge>
                          <Badge bg="secondary">{w.duration} min</Badge>
                        </div>
                      </div>
                      <Badge
                        bg={w.status.toLowerCase() === 'completed' ? 'success' : 'warning'}
                        className="mb-2"
                      >
                        {w.status}
                      </Badge>
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="info" onClick={() => handleEdit(w)} disabled={!user}>
                          <FaEdit /> Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(w._id)} disabled={!user}>
                          <FaTrash /> Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Add/Edit Form */}
          {user ? (
            <Row className="mt-5">
              <Col md={6} className="mx-auto">
                <Card className="p-4 shadow-sm">
                  <h4>{editingId ? 'Edit Workout' : 'Add Workout'}</h4>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Workout Name</Form.Label>
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Type</Form.Label>
                      <Form.Select name="type" value={formData.type} onChange={handleFormChange} required>
                        <option value="">Select type</option>
                        <option value="cardio">Cardio</option>
                        <option value="strength">Strength</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="sports">Sports</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Duration (minutes)</Form.Label>
                      <Form.Control type="number" name="duration" value={formData.duration} onChange={handleFormChange} required min={1} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select name="status" value={formData.status} onChange={handleFormChange} required>
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="ongoing">On-going</option>
                        <option value="completed">Completed</option>
                      </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      {editingId ? 'Update Workout' : 'Add Workout'}
                    </Button>
                  </Form>
                </Card>
              </Col>
            </Row>
          ) : (
            <p className="text-center mt-4 text-danger">Please log in to add or edit workouts.</p>
          )}
   
      </main>

      <FooterComponent />
    </div>
  );
}
