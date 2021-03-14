import React from 'react';
import { Link } from 'react-router-dom';

const File = ({ listOfFiles }) => {
    return (
    <>
        { listOfFiles.map(file => {
            return (
                <ul key={ file.id }>
                    <li>
                        <Link to={ `/show/${file.id}` }>{ file.FileName }</Link>
                    </li>
                    <li>{ file.Group }</li>
                </ul>
            )
        })}
    </>
    )
}

export default File;