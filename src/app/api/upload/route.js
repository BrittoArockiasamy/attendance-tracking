// app/api/upload/route.js
import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import ExcelJS from 'exceljs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public', fileName);

    await writeFile(filePath, buffer);

    // Read the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      const cleanRow = row.values.slice(1).map(cell =>
        typeof cell === 'string' ? cell.trim() : cell
      );
      rows.push(cleanRow);
    });

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Excel file is empty' }, { status: 400 });
    }

    const [header, ...dataRows] = rows;
    const data = dataRows
      .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== '')) // remove empty rows
      .map(row => {
        const rowObj = {};
        header.forEach((key, i) => {
          rowObj[key] = row[i] ?? '';
        });
        return rowObj;
      });

    return NextResponse.json({ data, fileName });
  } catch (error) {
    console.error('Error processing Excel upload:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}

