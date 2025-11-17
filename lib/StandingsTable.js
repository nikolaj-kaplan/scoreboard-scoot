import { formatIfNumericDK } from './tableUtils';

export default function StandingsTable({ dataRows }) {
  return (
    <table style={{ 
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 6px',
      marginTop: 18
    }}>
      <thead>
        <tr>
          <th style={{ 
            background: 'linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%)',
            color: '#fff',
            padding: '16px 24px',
            textAlign: 'center',
            fontSize: 28,
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
            padding: '16px 32px',
            textAlign: 'left',
            fontSize: 28,
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
            padding: '16px 28px',
            textAlign: 'center',
            fontSize: 28,
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
            padding: '16px 28px',
            textAlign: 'center',
            fontSize: 28,
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
            padding: '16px 32px',
            textAlign: 'center',
            fontSize: 28,
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
              padding: '18px 24px',
              fontSize: 42,
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
              padding: '18px 26px',
              fontSize: 34,
              fontWeight: 700,
              boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.12), inset 0 -4px 0 rgba(0,0,0,0.5), 0 3px 6px rgba(0,0,0,0.3)',
              textShadow: '0 3px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)'
            }}>
              {row.name}
              {row.heatCode && (
                <span style={{ 
                  fontSize: 24, 
                  fontWeight: 400, 
                  opacity: 0.8,
                  marginLeft: 10
                }}>
                  ({row.heatCode})
                </span>
              )}
            </td>
            <td style={{ 
              background: 'linear-gradient(to bottom, #2a2a2a 0%, #1a1a1a 100%)',
              color: '#fff',
              padding: '18px 20px',
              fontSize: 34,
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
              padding: '18px 20px',
              fontSize: 34,
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
              padding: '18px 26px',
              fontSize: 38,
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
