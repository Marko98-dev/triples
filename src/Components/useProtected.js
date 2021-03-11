import { useEffect, useState } from 'react';
import { authFetch } from "../auth"

const useProtected = () => {

    const [message, setMessage] = useState('');
    useEffect(() => {
      authFetch("/api/protected").then(response => {
        if (response.status === 401){
          setMessage("Sorry you aren't authorized!")
          return null
        }
        return response.json()
      }).then(response => {
        if (response && response.message){
          setMessage(response.message)
        }
      })
    }, [])
}

export default useProtected;