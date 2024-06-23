import React from 'react';
import './styles/UpcomingClasses.css';

function UpcomingClasses () {

  return (
    <>
    <table className="table table-borderless" id='upcoming-classes-table'>
      <thead className='upcoming-classes-thead'>
        <tr className='upcoming-classes-tr'>
          <th className='upcoming-classes-th-top'> Date </th>
          <th className='upcoming-classes-th-top'> Class Name </th>
          <th className='upcoming-classes-th-top'> Instructor </th>
          <th className='upcoming-classes-th-top'> Time </th>
        </tr>
      </thead>
      <tbody className='upcoming-classes-tbody'>
        <tr>
          <th className='upcoming-classes-th'> </th>
          <td className='upcoming-classes-td'> </td>
          <td className='upcoming-classes-td'> </td>
          <td className='upcoming-classes-td'> </td>
        </tr>
        <tr>
          <th className='upcoming-classes-th'>  </th>
          <td className='upcoming-classes-td'> </td>
          <td className='upcoming-classes-td'> </td>
          <td className='upcoming-classes-td'> </td>
        </tr>
        <tr>
          <th className='upcoming-classes-th'>  </th>
          <td className='upcoming-classes-td'> </td>
          <td className='upcoming-classes-td'> </td>
          <td className='upcoming-classes-td'> </td>
        </tr>
      </tbody>
    </table>
    </>
  )
}

export default UpcomingClasses;