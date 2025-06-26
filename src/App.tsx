import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PollList } from './pages/PollList';
import { PollDetails } from './pages/PollDetails';
import { CreatePoll } from './pages/CreatePoll';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { Header } from './components/Header';
import { EditPoll } from './pages/EditPoll';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/polls" element={<PollList />} />
                        <Route path="/poll/:id" element={<PollDetails />} />
                        <Route path="/poll/edit/:id" element={<EditPoll />} />

                        <Route
                            path="/create"
                            element={
                                <ProtectedRoute>
                                    <CreatePoll />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
