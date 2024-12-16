import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './components/Home/Home'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import Add_EditPart from './components/Add_EditPart/Add_EditPart'
import PartsPage from './components/PartsPage/PartsPage'
import PartDetails from './components/PartDetails/PartDetails'
import ProfileDetails from './components/ProfileDetails/ProfileDetails'
import PrivateRoute from './components/PrivateRoute/PrivateRoute'
import RequestMailForm from './components/RequestMailForm/RequestMailForm'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register mode="add" />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/add-parts"
            element={
              <PrivateRoute>
                <Add_EditPart mode="add" />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-part/:id"
            element={
              <PrivateRoute>
                <Add_EditPart mode="edit" />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-parts"
            element={
              <PrivateRoute>
                <PartsPage mode="user" />
              </PrivateRoute>
            }
          />

          <Route
            path="/parts"
            element={<PartsPage mode="all" />}
          />

          <Route
            path="/part-details/:id"
            element={<PartDetails />}
          />

          <Route
            path="/my-profile"
            element={
              <PrivateRoute>
                <ProfileDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <Register mode="edit" />
              </PrivateRoute>
            }
          />

          <Route
            path="/request"
            element={<RequestMailForm />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
