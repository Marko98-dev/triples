import React, { useState, useEffect } from 'react';
import File from './File';

const ShowFiles = () => {
    const [file, setFile] = useState([])

    useEffect(() => {
        fetch('/api').then(response => {
            if(response.ok){
                return response.json()
            }
        }).then(data => setFile(data))
    }, [])

    return (
        <File listOfFiles={ file } />
    )
}

export default ShowFiles;