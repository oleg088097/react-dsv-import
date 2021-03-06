import React from 'react';
import { useDSVImport } from '../../features/context';

export interface TablePreviewProps {
  className?: string;
}

export const TablePreview: React.FC<TablePreviewProps> = (props) => {
  const [context] = useDSVImport();

  const getCellValidationError = (columnKey: string, rowIndex: number) => {
    if (context.validation) {
      return context.validation.filter((e) => e.column === columnKey && e.row === rowIndex);
    }
  };

  const Cell: React.FC<{ columnKey: string; rowIndex: number }> = (props) => {
    const errors = getCellValidationError(props.columnKey, props.rowIndex);
    const messages = errors?.map((e) => e.message).join(';');

    return (
      <td className={messages ? 'error' : ''} title={messages}>
        {props.children}
      </td>
    );
  };

  return (
    <table className={props.className}>
      <thead>
        <tr>
          {context.columns.map((column, columnIndex) => (
            <th key={columnIndex}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {context.parsed
          ? context.parsed.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {context.columns.map((column, columnIndex) => {
                  return (
                    <Cell key={columnIndex} columnKey={column.key.toString()} rowIndex={rowIndex}>
                      {row[column.key]}
                    </Cell>
                  );
                })}
              </tr>
            ))
          : null}
      </tbody>
    </table>
  );
};
