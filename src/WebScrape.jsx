import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const WebScrape = () => {
  const [programData, setProgramData] = useState([]);

  useEffect(() => {
    const scrapeYMCA = async () => {
      const url = 'https://www.ymcachicago.org/program-search/?locations=LV&locations=MT&locations=SS&programs=AQ-Aquatics&keywords=';
      const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);

      const response = await fetch(proxyUrl);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const programs = [];
      doc.querySelectorAll('.program-table tbody tr').forEach(row => {
        const startDateText = row.querySelector('td:nth-child(2) .program-table__cell-content')?.innerHTML.split('<br>')[0].replace('Start: ', '').trim();
        const endDateText = row.querySelector('td:nth-child(2) .program-table__cell-content')?.innerHTML.split('<br>')[1].replace('End: ', '').trim();
        const startTimeText = row.querySelector('td:nth-child(3) .program-table__cell-content')?.innerHTML.split('<br>')[0].replace('Start: ', '').trim();
        const endTimeText = row.querySelector('td:nth-child(3) .program-table__cell-content')?.innerHTML.split('<br>')[1].replace('End: ', '').trim();
        const programCapacityText = row.querySelector('td:nth-child(8) .program-table__cell-content')?.textContent.trim().split(' of ');

        const program = {
          Folder_Name: '', // No data in the example HTML
          Program_Name: '', // No data in the example HTML
          Program_Description: '', // No data in the example HTML
          Logo_URL: '', // No data in the example HTML
          Category: '', // No data in the example HTML
          Program_Capacity: programCapacityText ? programCapacityText[1] : '',
          Min_Age: row.querySelector('td:nth-child(6) .program-table__cell-content')?.textContent.split(' yrs - ')[0].trim() || '',
          Max_Age: row.querySelector('td:nth-child(6) .program-table__cell-content')?.textContent.split(' yrs - ')[1].replace(' yrs', '').trim() || '',
          Meeting_Type: row.querySelector('td:nth-child(4) .program-table__cell-content')?.innerHTML.replace(/<br\s*\/?>/gi, ', ').trim() || '',
          Location_Name: row.querySelector('td:nth-child(5) .program-table__cell-content')?.textContent.trim() || '',
          Address: '', // No data in the example HTML
          City: '', // No data in the example HTML
          State: '', // No data in the example HTML
          Zipcode: '', // No data in the example HTML
          Program_URL: '', // No data in the example HTML
          Registration_URL: '', // No data in the example HTML
          Start_Date: startDateText || '',
          End_Date: endDateText || '',
          Start_Time: startTimeText || '',
          End_Time: endTimeText || '',
          Registration_Deadline: '', // No data in the example HTML
          Contact_Name: '', // No data in the example HTML
          Contact_Email: '', // No data in the example HTML
          Contact_Phone: '', // No data in the example HTML
          Price: row.querySelector('td:nth-child(7) .program-table__cell-content')?.textContent.trim() || '',
          Extra_Data: '', // No data in the example HTML
          online_address: '', // No data in the example HTML
          dosage: '', // No data in the example HTML
          internal_id: row.querySelector('td:nth-child(1) .program-table__reveal-content')?.textContent.trim() || '',
          neighborhood: '', // No data in the example HTML
          community: '', // No data in the example HTML
          ward: '', // No data in the example HTML
        };

        // Debugging logs
        console.log('Program Capacity:', program.Program_Capacity);
        console.log('Min Age:', program.Min_Age);
        console.log('Max Age:', program.Max_Age);
        console.log('Meeting Type:', program.Meeting_Type);
        console.log('Location Name:', program.Location_Name);
        console.log('Start Date:', program.Start_Date);
        console.log('End Date:', program.End_Date);
        console.log('Start Time:', program.Start_Time);
        console.log('End Time:', program.End_Time);
        console.log('Price:', program.Price);
        console.log('Internal ID:', program.internal_id);

        programs.push(program);
      });

      setProgramData(programs);
    };

    scrapeYMCA();
  }, []);

  const exportToCSV = () => {
    // Trim whitespace from each property value
    const trimmedProgramData = programData.map(program => {
      const trimmedProgram = {};
      Object.keys(program).forEach(key => {
        trimmedProgram[key] = typeof program[key] === 'string' ? program[key].trim() : program[key];
      });
      return trimmedProgram;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(trimmedProgramData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'YMCA Programs');
    XLSX.writeFile(workbook, 'ymca_programs.csv');
  };
  return (
    <div>
      <h1>YMCA Programs</h1>
      <button onClick={exportToCSV}>Download CSV</button>
      <pre>{JSON.stringify(programData, null, 2)}</pre>
    </div>
  );
};

export default WebScrape;
