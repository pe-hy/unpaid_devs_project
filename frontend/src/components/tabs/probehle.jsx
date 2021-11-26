import React from 'react';

export function Probehle(props) {
    const {id,datum,start,end,subject,cap,notes} = props;

    return (
        <tr>
            <td>{id}</td>
            <td>{datum}</td>
            <td>{start}</td>
            <td>{end}</td>
            <td>{subject}</td>
            <td>{cap}</td>
            <td>{notes}</td>
        </tr>
    );
}