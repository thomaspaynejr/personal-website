import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#000000',
          color: '#FFFFFF',
          padding: '80px',
          fontFamily: 'monospace',
          border: '2px solid #222222',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderBottom: '1px solid #222222',
            paddingBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '20px',
              letterSpacing: '0.25em',
              color: '#888888',
              textTransform: 'uppercase',
            }}
          >
            THOMAS PAYNE // DEVELOPER HUD v2.0
          </div>
          <div
            style={{
              fontSize: '16px',
              letterSpacing: '0.2em',
              color: '#FFFFFF',
              border: '1px solid #333333',
              padding: '6px 14px',
              borderRadius: '6px',
            }}
          >
            SYSTEMS ONLINE
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#FFFFFF',
              textTransform: 'uppercase',
            }}
          >
            THOMAS PAYNE
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#AAAAAA',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Software Engineer &amp; Systems Architect
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#666666',
              maxWidth: '820px',
              lineHeight: 1.5,
            }}
          >
            Next.js 16 • React 19 • TypeScript • Supabase SSR • Monochromatic Obsidian Minimalism
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid #222222',
            paddingTop: '24px',
            fontSize: '16px',
            color: '#777777',
            letterSpacing: '0.15em',
          }}
        >
          <div>THOMASPAYNE.DEV</div>
          <div>DISCIPLINE OVER MOTIVATION _</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
