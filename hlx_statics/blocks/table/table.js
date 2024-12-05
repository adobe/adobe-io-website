/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

function buildCell(rowIndex) {
  const cell = document.createElement('td');
  cell.classList.add('spectrum-Table-cell');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

function buildCellHead(rowIndex) {
  const cell = document.createElement('th');
  cell.classList.add('spectrum-Table-headCell');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  block.setAttribute('daa-lh', 'table');
  block.setAttribute('dir', 'ltr');

  const table = document.createElement('table');
  table.classList.add('spectrum-Table', 'spectrum-Table--sizeM', 'spectrum-Table--spacious');

  const thead = document.createElement('thead');
  thead.classList.add('spectrum-Table-head');

  const tbody = document.createElement('tbody');
  tbody.classList.add('spectrum-Table-body');

  const hasHeader = !block.classList.contains('no-header');
  if (hasHeader) {
    table.append(thead);
  }
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const isHeader = hasHeader && i === 0;
    const row = document.createElement('tr');

    if (isHeader) {
      thead.append(row);
    } else {
      row.classList.add('spectrum-Table-row');
      tbody.append(row);
    }

    [...child.children].forEach((col) => {
      const rowIndex = hasHeader ? i : i + 1;
      const cell = isHeader ? buildCellHead(rowIndex) : buildCell(rowIndex);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });

  block.innerHTML = '';
  block.append(table);
  
}
