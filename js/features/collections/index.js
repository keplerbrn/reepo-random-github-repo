import { eventBus } from '../../core/eventBus.js';
import { EVENTS } from '../../core/constants.js';
import { stateManager } from '../../core/stateManager.js';
import { collectionService } from '../../services/collectionService.js';
import { localization } from '../../core/localization.js';

export function initializeCollectionsFeature() {
  // These functions will be called when UI events happen (passed as callbacks from appController)
  return {
    onSearch: (term) => {
      // Search is handled locally in appController by filtering state
    },
    onSort: (type) => {
      // Sort is handled locally in appController
    },
    onCreateCollection: () => {
      const name = prompt(localization.t('collections.promptName'));
      if (name && name.trim()) {
        const col = collectionService.createCollection(name.trim());
        eventBus.emit(EVENTS.COLLECTION_CREATED, { collection: col });
      }
    },
    onRenameCollection: (id) => {
      const name = prompt(localization.t('collections.promptRename'));
      if (name && name.trim()) {
        collectionService.renameCollection(id, name.trim());
        eventBus.emit(EVENTS.COLLECTION_UPDATED, { id, name: name.trim() });
      }
    },
    onDeleteCollection: (id) => {
      if (confirm(localization.t('collections.confirmDelete'))) {
        collectionService.deleteCollection(id);
        eventBus.emit(EVENTS.COLLECTION_DELETED, { id });
      }
    },
    onSelectCollection: (id) => {
      // Future: Open collection detail view
      console.log('Collection selected:', id);
    },
    onRemoveRepo: (repoId) => {
      if (confirm(localization.t('collections.confirmRemoveRepo'))) {
        collectionService.removeRepository(repoId);
        eventBus.emit(EVENTS.REPOSITORY_REMOVED, { repository: { id: repoId } });
      }
    },
    onAssignRepo: (repoId, collectionId) => {
      collectionService.addRepoToCollection(collectionId, repoId);
      eventBus.emit(EVENTS.REPOSITORY_ASSIGNED, { repoId, collectionId });
    },
    onExport: () => {
      const data = collectionService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reepo-collections.json';
      a.click();
      URL.revokeObjectURL(url);
      eventBus.emit(EVENTS.EXPORT_COMPLETED);
    },
    onImport: (jsonString) => {
      const result = collectionService.importData(jsonString);
      if (result.success) {
        alert(localization.t('collections.importSuccess', { 
          collections: result.collectionsImported, 
          repos: result.repositoriesImported 
        }));
        eventBus.emit(EVENTS.IMPORT_COMPLETED, result);
      } else {
        alert(localization.t('collections.importError', { error: result.error }));
      }
    }
  };
}