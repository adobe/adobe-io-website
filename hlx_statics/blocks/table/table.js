/*
 * Table Block
 * Recreate a table
 * https://www.hlx.live/developer/block-collection/table
 */

function buildCell(rowIndex) {
  const cell = document.createElement('td');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default async function decorate(block) {
  const table = document.createElement('table');
  table.classList.add('spectrum-Table','spectrum-Table--sizeM','spectrum-Table--spacious');
  const thead = document.createElement('thead');
  thead.classList.add('spectrum-Table-head');
  const tbody = document.createElement('tbody');
  tbody.classList.add('spectrum-Table-body');
  table.append(thead, tbody);
  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    row.classList.add('spectrum-Table-row');
    if (i) tbody.append(row);
    else thead.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(i);
      cell.classList.add('spectrum-Table-cell');
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);
}
