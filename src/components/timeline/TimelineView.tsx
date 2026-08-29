import { useState, useMemo } from 'react';

interface TimelineNode {
  id: string;
  title: string;
  institution?: string;
  startDate: string;
  endDate: string | null;
  status: string;
  description: string;
  tags: string[];
  technologies?: string[];
  archiveSlug?: string;
}

interface Track {
  id: string;
  label: string;
  color: string;
  nodes: TimelineNode[];
}

interface Props {
  tracks: Track[];
}

function formatYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

function formatPeriod(start: string, end: string | null): string {
  const s = new Date(start);
  const startStr = `${s.getFullYear()}.${String(s.getMonth() + 1).padStart(2, '0')}`;
  if (!end) return `${startStr} — PRESENT`;
  const e = new Date(end);
  return `${startStr} — ${e.getFullYear()}.${String(e.getMonth() + 1).padStart(2, '0')}`;
}

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  published: { bg: '#10B981', label: 'COMPLETED' },
  'in-progress': { bg: '#F59E0B', label: 'IN PROGRESS' },
  completed: { bg: '#10B981', label: 'COMPLETED' },
  planned: { bg: '#3B82F6', label: 'PLANNED' },
};

export default function TimelineView({ tracks }: Props) {
  const [activeTracks, setActiveTracks] = useState<Set<string>>(
    new Set(tracks.map((t) => t.id))
  );
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  const toggleTrack = (id: string) => {
    setActiveTracks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredTracks = useMemo(
    () => tracks.filter((t) => activeTracks.has(t.id)),
    [tracks, activeTracks]
  );

  return (
    <div>
      {/* Track Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => toggleTrack(track.id)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              border: '1px solid',
              borderColor: activeTracks.has(track.id) ? track.color : '#2A2A2A',
              color: activeTracks.has(track.id) ? track.color : '#6A6A6A',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 150ms ease-out',
            }}
          >
            {track.label}
          </button>
        ))}
      </div>

      {/* Timeline Tracks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {filteredTracks.map((track) => (
          <div key={track.id}>
            <h3
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: track.color,
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: `1px solid ${track.color}33`,
              }}
            >
              {track.label}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {track.nodes.map((node) => {
                const isExpanded = expandedNode === node.id;
                const statusInfo = STATUS_STYLES[node.status] || STATUS_STYLES['in-progress'];

                return (
                  <div key={node.id}>
                    <button
                      onClick={() => setExpandedNode(isExpanded ? null : node.id)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr auto',
                        gap: '16px',
                        alignItems: 'center',
                        padding: '12px 0',
                        borderBottom: '1px solid #2A2A2A',
                        background: 'transparent',
                        border: 'none',
                        borderBottomWidth: '1px',
                        borderBottomStyle: 'solid',
                        borderBottomColor: '#2A2A2A',
                        cursor: 'pointer',
                        color: '#F0EDE8',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '13px',
                          letterSpacing: '0.05em',
                          color: '#6A6A6A',
                        }}
                      >
                        {formatPeriod(node.startDate, node.endDate)}
                      </span>
                      <span
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          fontSize: '1rem',
                          fontWeight: 600,
                        }}
                      >
                        {node.title}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: statusInfo.bg,
                            display: 'inline-block',
                          }}
                        />
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: '#6A6A6A',
                          }}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div
                        style={{
                          padding: '16px 0 16px 136px',
                          borderBottom: '1px solid #2A2A2A',
                          background: '#111111',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.9375rem',
                            color: '#B0ADA8',
                            marginBottom: '12px',
                            lineHeight: 1.6,
                          }}
                        >
                          {node.description}
                        </p>

                        {node.institution && (
                          <p
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '12px',
                              color: '#6A6A6A',
                              marginBottom: '8px',
                            }}
                          >
                            {node.institution}
                          </p>
                        )}

                        {node.technologies && node.technologies.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                            {node.technologies.map((tech) => (
                              <span
                                key={tech}
                                style={{
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontSize: '11px',
                                  letterSpacing: '0.05em',
                                  color: '#6A6A6A',
                                  border: '1px solid #2A2A2A',
                                  padding: '1px 6px',
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {node.archiveSlug && (
                          <a
                            href={`/archive/${node.archiveSlug}`}
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '13px',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              color: track.color,
                              textDecoration: 'none',
                            }}
                          >
                            → VIEW FULL OBJECT
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
