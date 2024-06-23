import React from 'react';
import '../styles/BmiTable.css';

function BmiTable () {
  return (
    <div className='table-container'>
      <table className='bmi-table'>
        <thead>
          <tr>
            <th colSpan='2'> BMI Table </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> Underweight </td>
            <td> Below 18.5% </td>
          </tr>
          <tr>
            <td> Normal </td>
            <td> 18.5-24.9% </td>
          </tr>
          <tr>
            <td> Overweight </td>
            <td> 25.0-29.9% </td>
          </tr>
          <tr>
            <td> Obesity </td>
            <td> 30.0% and Above</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default BmiTable;