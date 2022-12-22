import React, { useState, useRef } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [data, setData] = useState([])
  const [value, setValue] = useState({
    name: '',
    email: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    setData((prev) => [...prev, { name: value?.name, email: value?.email }])
    setValue({ name: '', email: '' })
  }

  const sendSecretSanta = () => {
    axios
      .post('http://localhost:8000/secretSanta', data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  }

  return (
    <div className="App" style={{}}>
      <form className="Form" onSubmit={handleSubmit}>
        <label>Name</label>
        <div>
          <input
            type="text"
            required
            value={value.name}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <label>Email</label>
        <div>
          <input
            type="email"
            required
            value={value?.email}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>
        <button className="Submit" type="submit">
          Add Name
        </button>
      </form>
      <div>
        {data.map((item, index) => {
          return (
            <div key={index}>
              {item.name + '    =>     '} {item.email}
              <button
                onClick={() => {
                  setData((prev) => prev.filter((item) => item !== prev[index]))
                }}
              >
                Delete
              </button>
            </div>
          )
        })}
      </div>
      <button onClick={sendSecretSanta}>
        Send Everyone there secret Santa
      </button>
    </div>
  )
}

export default App
