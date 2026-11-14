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
          padding: '72px 80px',
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
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: 20,
              letterSpacing: '0.25em',
              color: '#8E8E93',
              textTransform: 'uppercase',
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 9999,
                backgroundColor: '#FFFFFF',
              }}
            />
            <span>THOMAS PAYNE // DEVELOPER HUD v1.2</span>
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: '0.2em',
              color: '#8E8E93',
              border: '1px solid #333333',
              padding: '8px 16px',
              borderRadius: 8,
            }}
          >
            NEXT.JS 16 // REACT 19 // SUPABASE
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 1.05,
            }}
          >
            THOMAS PAYNE
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#A1A1AA',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            Software Engineer &amp; Systems Architect. Built on military discipline, deterministic engineering, and obsidian minimalism.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #222222',
            paddingTop: '28px',
            fontSize: 18,
            letterSpacing: '0.18em',
            color: '#8E8E93',
            textTransform: 'uppercase',
          }}
        >
          <span>PORTFOLIO // WRITING // TELEMETRY // CLI HUD</span>
          <span style={{ color: '#FFFFFF' }}>THOMASPAYNE.DEV _</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
