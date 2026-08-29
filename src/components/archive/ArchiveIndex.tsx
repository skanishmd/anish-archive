import { useState, useMemo } from 'react';

interface ArchiveItem {
  slug: string;
  collection: string;
  title: string;
  date: string;
  type: string;
  status: string;
  fields: string[];
  tags: string[];
  description: string;
  featured: boolean;
}

interface Props {
  items: ArchiveItem[];
}

type ViewMode = 'time' | 'field' | 'type';

const TYPE_COLORS: Record<string, string> = {
  research: '#FF2A00',
  project: '#0038FF',
  writing: '#00FF66',
  achievement: '#FFAA00',
  creative: '#9D00FF',
  experiment: '#00F0FF',
  observation: '#00FF66',
};

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const group = key(item);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function ArchiveIndex({ items }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('time');

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [items]
  );

  const grouped = useMemo(() => {
    switch (viewMode) {
      case 'time':
        return groupBy(sortedItems, (item) => new Date(item.date).getFullYear().toString());
      case 'type':
        return groupBy(sortedItems, (item) => item.type.toUpperCase());
      case 'field':
        // Flatten: each item appears under each of its fields
        const fieldGroups: Record<string, ArchiveItem[]> = {};
        sortedItems.forEach((item) => {
          item.fields.forEach((field) => {
            if (!fieldGroups[field]) fieldGroups[field] = [];
            fieldGroups[field].push(item);
          });
        });
        return fieldGroups;
      default:
        return groupBy(sortedItems, (item) => new Date(item.date).getFullYear().toString());
    }
  }, [sortedItems, viewMode]);

  const viewModes: { key: ViewMode; label: string }[] = [
    { key: 'time', label: 'TIME' },
    { key: 'type', label: 'TYPE' },
    { key: 'field', label: 'FIELD' },
  ];

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-8">
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '13px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            color: '#6A6A6A',
          }}
        >
          VIEW BY:
        </span>
        {viewModes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setViewMode(mode.key)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              padding: '4px 12px',
              border: '1px solid',
              borderColor: viewMode === mode.key ? '#F0EDE8' : '#2A2A2A',
              color: viewMode === mode.key ? '#F0EDE8' : '#6A6A6A',
              background: viewMode === mode.key ? '#F0EDE8' : 'transparent',
              ...(viewMode === mode.key && { color: '#0A0A0A' }),
              cursor: 'pointer',
              transition: 'all 150ms ease-out',
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Grouped Content */}
      {Object.entries(grouped)
        .sort(([a], [b]) => (viewMode === 'time' ? b.localeCompare(a) : a.localeCompare(b)))
        .map(([group, groupItems]) => (
          <div key={group} className="mb-12">
            <h2
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '13px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                color: '#6A6A6A',
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid #2A2A2A',
              }}
            >
              {group}
            </h2>
            <div className="flex flex-col gap-1">
              {groupItems.map((item) => (
                <a
                  key={`${item.collection}-${item.slug}`}
                  href={`/archive/${item.collection}/${item.slug}`}
                  className="group"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr auto',
                    gap: '16px',
                    alignItems: 'baseline',
                    padding: '12px 0',
                    borderBottom: '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 150ms ease-out',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderBottomColor = '#2A2A2A';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent';
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
                    {formatDate(item.date)}
                  </span>
                  <div>
                    <span
                      style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#F0EDE8',
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: '#6A6A6A',
                        marginTop: '2px',
                      }}
                    >
                      {item.description}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase' as const,
                      padding: '2px 8px',
                      border: '1px solid',
                      borderColor: TYPE_COLORS[item.type] || '#6A6A6A',
                      color: TYPE_COLORS[item.type] || '#6A6A6A',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.type}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
