import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/hello/')
      .then(response => response.json())
      .then(data => {
        setMessage(data.message)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          React + Django + Vite
        </h1>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-700 font-semibold mb-1">Tech Stack:</p>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• React Frontend</li>
            <li>• Vite Build Tool</li>
            <li>• TailwindCSS Styling</li>
            <li>• Django Backend</li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-md p-6 text-center">
          {loading && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="text-red-600">
              <p className="font-semibold mb-2">Error connecting to backend:</p>
              <p className="text-sm">{error}</p>
              <p className="text-xs mt-2 text-gray-600">Make sure Django server is running on port 8000</p>
            </div>
          )}

          {!loading && !error && (
            <div>
              <p className="text-lg font-semibold text-gray-700 mb-2">Backend Response:</p>
              <p className="text-2xl font-bold text-green-600">{message}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Full-stack app successfully configured!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
