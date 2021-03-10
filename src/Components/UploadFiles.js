import React, { useEffect, useState } from 'react';
import { authFetch } from "../auth"

const UploadFiles = () => {
    
    const [message, setMessage] = useState('')

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

    return (
        <form method="POST" enctype="multipart/form-data">
            <input type="file" name="file" />
            <input type="submit" value="Upload" />
            <h2>{ message }</h2>
        </form>
    );
}

export default UploadFiles;