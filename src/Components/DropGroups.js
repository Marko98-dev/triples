import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const DropGroups = () => {
    const { id } = useParams();
    const [group, setGroup] = useState([]);
    const [selectGroup, setSelectGroup] = useState();

    useEffect(() => {
        fetch('/api/getGroups')
        .then(response => response.json())
        .then(data => setGroup(data))
    }, [id])

    return (
        <div>
            <select name="Group_id" onChange={ (e) => {
                const selectedGroup = e.target.value;
                setSelectGroup(selectedGroup)
            } }>
                { group.map(data => <option key = { data.id } value={ data.id }>{ data.GroupName }</option>) }
            </select>
            <p>{ selectGroup }</p>
        </div>
    )
}

export default DropGroups;