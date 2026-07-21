import { localization } from '../core/localization.js';

export function createImportExportButtons(onExport, onImport) {
  const container = document.createElement('div');
  container.className = 'import-export-bar';

  const exportBtn = document.createElement('button');
  exportBtn.className = 'btn btn-secondary';
  exportBtn.textContent = localization.t('collections.export');
  exportBtn.addEventListener('click', onExport);

  const importBtn = document.createElement('button');
  importBtn.className = 'btn btn-secondary';
  importBtn.textContent = localization.t('collections.import');
  importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => onImport(event.target.result);
      reader.readAsText(file);
    });
    input.click();
  });

  container.appendChild(exportBtn);
  container.appendChild(importBtn);
  return container;
}