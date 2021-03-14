import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Show = () => {
    const { id } = useParams();
    const [file, setFile] = useState([]);

    useEffect(() => {
        fetch(`/api/${id}`)
        .then(response => response.json())
        .then(data => setFile(data))
    }, [id])

    return (
        <div>
            { file.length > 0 && file.map(data => <div key={data.id}><h1>{ data.FileName }</h1></div>) }
        </div>
    )
}

export default Show;