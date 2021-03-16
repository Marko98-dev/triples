import React from 'react';
import { useHistory } from 'react-router-dom';

const Delete = ({ id }) => {

    const history = useHistory();

    const deleteFile = () => {
        fetch(`/api/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                id: id
            })
        }).then(response => response.json())
          .then(data => {
            console.log(data);
            history.push('/show');
          })
    }

    return (
        <>
            <button onClick={ deleteFile }>Delete</button>
        </>
    )
}

export default Delete;