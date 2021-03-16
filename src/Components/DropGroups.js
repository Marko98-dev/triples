import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const DropGroups = () => {
    const { id } = useParams();
    const [group, setGroup] = useState([]);


    useEffect(() => {
        fetch('/api/getGroups')
        .then(response => response.json())
        .then(data => setGroup(data))
    }, [id])

    return (
        <select>
            { group.map(data => <option key = { data.id } value={ data.GroupName }>{ data.GroupName }</option>) }
        </select>
    )
}

export default DropGroups;