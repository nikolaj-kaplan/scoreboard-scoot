// Shared table utilities and components
import React from 'react';

/**
 * Extract header row from sheet data
 * Looks for row containing specific labels or uses first row
 */
export function findHeaderRow(rows, searchLabel = null) {
  if (!rows || rows.length === 0) return null;
  
  if (!searchLabel) return 0;
  
  // Find last row containing the search label
  let headerRowIndex = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (Array.isArray(row) && row.some(cell => 
      typeof cell === 'string' && cell.trim().toLowerCase() === searchLabel.toLowerCase()
    )) {
      headerRowIndex = i;
    }
  }
  
  return headerRowIndex;
}

/**
 * Find column indices by label names
 * Returns array of indices matching the wanted labels
 */
export function findColumnIndices(headers, wantedLabels) {
  return wantedLabels.map(label => {
    // Search from end for exact match
    for (let i = headers.length - 1; i >= 0; i--) {
      const h = headers[i];
      if (typeof h === 'string' && h.trim().toLowerCase() === label.toLowerCase()) {
        return i;
      }
    }
    
    // Fallback: search for includes
    for (let i = headers.length - 1; i >= 0; i--) {
      const h = headers[i] || '';
      if (typeof h === 'string' && h.trim().toLowerCase().includes(label.toLowerCase())) {
        return i;
      }
    }
    
    return -1;
  });
}

/**
 * Filter rows to only include specified columns
 */
export function filterColumns(rows, columnIndices) {
  return rows.map(row => 
    Array.isArray(row) 
      ? columnIndices.map(i => row[i] || '') 
      : row
  );
}

/**
 * Sort rows by a specific column (assumes numeric values)
 */
export function sortByColumn(rows, columnIndex, descending = true) {
  return rows.slice().sort((a, b) => {
    const aVal = parseFloat((a && a[columnIndex])) || 0;
    const bVal = parseFloat((b && b[columnIndex])) || 0;
    return descending ? bVal - aVal : aVal - bVal;
  });
}

/**
 * Simple table component with consistent styling
 */
export function SimpleTable({ rows, style = {} }) {
  if (!rows || !rows.length) {
    return <p>Ingen data fundet.</p>;
  }

  const headers = rows[0];
  const body = rows.slice(1);

  const defaultTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    ...style
  };

  return (
    <table style={defaultTableStyle}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: 8, borderBottom: '1px solid #ddd', textAlign: 'left' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Dark-themed table component for scoreboards
 */
export function DarkTable({ rows, style = {} }) {
  if (!rows || !rows.length) {
    return <p style={{ color: '#fff' }}>Ingen data fundet.</p>;
  }

  const headers = rows[0];
  const body = rows.slice(1);

  const defaultTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    color: '#fff',
    ...style
  };

  return (
    <table style={defaultTableStyle}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                padding: '10px 8px',
                borderBottom: '2px solid #333',
                textAlign: 'left',
                background: '#2a2a2a'
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td
                key={ci}
                style={{
                  padding: '10px 8px',
                  borderBottom: '1px solid #2b2b2b'
                }}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
