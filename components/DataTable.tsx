import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ChevronUp, ChevronDown } from '@/components/Icons';
import Colors from '@/constants/colors';

export interface Column {
  key: string;
  title: string;
  width?: number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowPress?: (row: any) => void;
  keyExtractor?: (item: any, index: number) => string;
}

export default function DataTable({
  columns,
  data,
  onRowPress,
  keyExtractor = (item, index) => `row-${index}`,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortKey, sortOrder]);

  const getAlignStyle = (align?: string) => {
    switch (align) {
      case 'center':
        return { textAlign: 'center' as const };
      case 'right':
        return { textAlign: 'right' as const };
      default:
        return { textAlign: 'left' as const };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {columns.map((column, index) => (
              <TouchableOpacity
                key={column.key}
                style={[
                  styles.headerCell,
                  { width: column.width || 120 },
                  index === 0 && styles.firstCell,
                  index === columns.length - 1 && styles.lastCell,
                ]}
                onPress={() => column.sortable !== false && handleSort(column.key)}
                disabled={column.sortable === false}
              >
                <Text style={[styles.headerText, getAlignStyle(column.align)]}>
                  {column.title}
                </Text>
                {column.sortable !== false && sortKey === column.key && (
                  <View style={styles.sortIcon}>
                    {sortOrder === 'asc' ? (
                      <ChevronUp size={14} color={Colors.light.primary} />
                    ) : (
                      <ChevronDown size={14} color={Colors.light.primary} />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.bodyScroll}>
            {sortedData.map((row, rowIndex) => (
              <TouchableOpacity
                key={keyExtractor(row, rowIndex)}
                style={[
                  styles.dataRow,
                  rowIndex % 2 === 0 && styles.evenRow,
                ]}
                onPress={() => onRowPress?.(row)}
                disabled={!onRowPress}
              >
                {columns.map((column, colIndex) => (
                  <View
                    key={`${rowIndex}-${column.key}`}
                    style={[
                      styles.dataCell,
                      { width: column.width || 120 },
                      colIndex === 0 && styles.firstCell,
                      colIndex === columns.length - 1 && styles.lastCell,
                    ]}
                  >
                    <Text
                      style={[styles.cellText, getAlignStyle(column.align)]}
                      numberOfLines={2}
                    >
                      {row[column.key] ?? '-'}
                    </Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  table: {
    minWidth: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primaryDark,
  },
  headerCell: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  firstCell: {
    paddingLeft: 16,
  },
  lastCell: {
    paddingRight: 16,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#fff',
    flex: 1,
  },
  sortIcon: {
    marginLeft: 4,
  },
  bodyScroll: {
    maxHeight: 500,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray200,
  },
  evenRow: {
    backgroundColor: Colors.light.gray100,
  },
  dataCell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 13,
    color: Colors.light.text,
  },
});
