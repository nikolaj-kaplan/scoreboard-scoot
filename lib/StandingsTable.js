import { formatIfNumericDK } from './tableUtils';

export default function StandingsTable({ dataRows }) {
  return (
    <table style={{ 
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 4px',
      marginTop: 14
    }}>
      <thead>
        <tr>
          <th style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            color: '#fff',
            padding: '12px 18px',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
            textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap'
          }}>
            #
          </th>
          <th style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            color: '#fff',
            padding: '12px 26px',
            textAlign: 'left',
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
            textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap'
          }}>
            Navn
          </th>
          <th style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            color: '#fff',
            padding: '12px 22px',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
            textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap'
          }}>
            Run 1
          </th>
          <th style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            color: '#fff',
            padding: '12px 22px',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
            textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap'
          }}>
            Run 2
          </th>
          <th style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            color: '#fff',
            padding: '12px 26px',
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)',
            textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)',
            whiteSpace: 'nowrap'
          }}>
            Best Run
          </th>
        </tr>
      </thead>
      <tbody>
        {dataRows.map((row, i) => (
          <tr key={i}>
            <td style={{ 
              background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
              color: '#fff',
              padding: '14px 18px',
              fontSize: 34,
              fontWeight: 900,
              textAlign: 'center',
              boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), inset 0 -5px 0 rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.3)',
              textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
            }}>
              {row.rank}
            </td>
            <td style={{ 
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              color: '#fff',
              padding: '14px 20px',
              fontSize: 28,
              fontWeight: 700,
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
              textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
            }}>
              {row.name}
              {row.heatCode && (
                <span style={{ 
                  fontSize: 20, 
                  fontWeight: 400, 
                  opacity: 0.8,
                  marginLeft: 8
                }}>
                  ({row.heatCode})
                </span>
              )}
            </td>
            <td style={{ 
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              color: '#fff',
              padding: '14px 16px',
              fontSize: 28,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
              textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
            }}>
              {row.run1 ? formatIfNumericDK(row.run1) : '-'}
            </td>
            <td style={{ 
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              color: '#fff',
              padding: '14px 16px',
              fontSize: 28,
              fontWeight: 600,
              textAlign: 'center',
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
              textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
            }}>
              {row.run2 ? formatIfNumericDK(row.run2) : '-'}
            </td>
            <td style={{ 
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              color: '#fff',
              padding: '14px 20px',
              fontSize: 32,
              fontWeight: 900,
              textAlign: 'center',
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
              textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6), 2px 2px 0 rgba(0,0,0,0.5)'
            }}>
              {row.bestRun ? formatIfNumericDK(row.bestRun) : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
