import React from "react";
import { FcCancel } from "react-icons/fc";

export function Prax(props) {
  const { id, datum, start, end, subject, cap, notes, onDelete } = props;

  return (
    <tr>
      <td>{id}</td>
      <td>{datum}</td>
      <td>{start}</td>
      <td>{end}</td>
      <td>{subject}</td>
      <td>{cap}</td>
      <td>{notes}</td>
      <td>
        {" "}
        <FcCancel onClick={() => onDelete(id)} /> zrušit{" "}
      </td>
    </tr>
  );
}
