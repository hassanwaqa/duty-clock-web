import { Navigate, Route, Routes } from 'react-router-dom'
import TripFormPage from './pages/TripFormPage'
import TripResultPage from './pages/TripResultPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TripFormPage />} />
      <Route path="/trips/:id" element={<TripResultPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
