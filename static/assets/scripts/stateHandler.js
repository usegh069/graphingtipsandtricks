// Optimized State Synchronization Utility
class StateSyncUtility {
    constructor() {
        this.compressionEnabled = typeof CompressionStream !== 'undefined';
    }

    // Compress data using CompressionStream if available, return as Blob
    async compressData(data) {
        const jsonString = JSON.stringify(data);
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(jsonString);

        if (!this.compressionEnabled) {
            return new Blob([encodedData]);
        }

        const compressed = new Blob([encodedData]).stream()
            .pipeThrough(new CompressionStream('gzip'));
        
        return new Response(compressed).blob();
    }
    async decompressOldData(compressed) {
        if (!this.compressionEnabled) {
            return JSON.parse(atob(compressed));
        }

        const binaryString = atob(compressed);
        const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
        const decompressed = new Blob([bytes]).stream()
            .pipeThrough(new DecompressionStream('gzip'));

        return new Response(decompressed).text().then(JSON.parse);
    }
    // Decompress data from Blob
    async decompressData(compressed) {
        const stream = compressed.stream();
        
        if (!this.compressionEnabled) {
            const text = await new Response(stream).text();
            return JSON.parse(text);
        }

        const decompressed = stream.pipeThrough(new DecompressionStream('gzip'));
        return new Response(decompressed).text().then(JSON.parse);
    }

    // Optimized localStorage data collection
    getLocalStorageData() {
        return Object.fromEntries(
            Object.entries(localStorage)
                .filter(([key]) => key !== 'ccStatelastSave')
        );
    }

    // Optimized schema extraction
    async getObjectStoreSchema(store) {
        return {
            name: store.name,
            keyPath: store.keyPath,
            autoIncrement: store.autoIncrement,
            indexes: Array.from(store.indexNames, indexName => {
                const index = store.index(indexName);
                return {
                    name: indexName,
                    keyPath: index.keyPath,
                    multiEntry: index.multiEntry,
                    unique: index.unique
                };
            })
        };
    }

    // Export state
    async exportState() {
        try {
            const time = Date.now();
            const state = {
                localStorage: this.getLocalStorageData(),
                indexedDB: await this.getAllIndexedDBData(),
                timestamp: time
            };

            return {
                state: await this.compressData(state),
                timestamp: time
            };
        } catch (error) {
            console.log('[CCPorted State Manager] Error exporting state: ' + error);
            throw error;
        }
    }

    // Optimized localStorage import
    async importLocalStorageState(data) {
        const ccStatelastSave = localStorage.getItem('ccStatelastSave');
        localStorage.clear();
        localStorage.setItem('ccStatelastSave', ccStatelastSave);
        Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });
    }

    // Optimized store creation
    createObjectStore(db, schema) {
        const store = db.createObjectStore(schema.name, {
            keyPath: schema.keyPath,
            autoIncrement: schema.autoIncrement
        });

        schema.indexes.forEach(indexSchema => {
            store.createIndex(indexSchema.name, indexSchema.keyPath, {
                unique: indexSchema.unique,
                multiEntry: indexSchema.multiEntry
            });
        });

        return store;
    }

    // Optimized IndexedDB import
    async getAllIndexedDBData() {
        const databases = await window.indexedDB.databases();
        const data = {};

        await Promise.all(databases.map(async dbInfo => {
            const dbName = dbInfo.name;
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });

            data[dbName] = {
                version: dbInfo.version,
                stores: {},
                schema: {}
            };

            const stores = Array.from(db.objectStoreNames);
            await Promise.all(stores.map(async storeName => {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);

                data[dbName].schema[storeName] = await this.getObjectStoreSchema(store);

                // Always collect both data and keys for every store
                const [storeData, storeKeys] = await Promise.all([
                    new Promise((resolve, reject) => {
                        const request = store.getAll();
                        request.onerror = () => reject(request.error);
                        request.onsuccess = () => resolve(request.result);
                    }),
                    new Promise((resolve, reject) => {
                        const request = store.getAllKeys();
                        request.onerror = () => reject(request.error);
                        request.onsuccess = () => resolve(request.result);
                    })
                ]);

                data[dbName].stores[storeName] = storeData;
                data[dbName].stores[`${storeName}_keys`] = storeKeys;
            }));

            db.close();
        }));

        return data;
    }

    async importIndexedDBState(data) {
        await Promise.all(Object.entries(data).map(async ([dbName, dbData]) => {
            // Delete existing database
            await new Promise((resolve, reject) => {
                const request = indexedDB.deleteDatabase(dbName);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });

            // Create new database with schema
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, dbData.version || 1);
                request.onerror = () => reject(request.error);
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    Object.values(dbData.schema).forEach(storeSchema => {
                        this.createObjectStore(db, storeSchema);
                    });
                };
                request.onsuccess = () => resolve(request.result);
            });

            // Import data for each store
            await Promise.all(Object.entries(dbData.schema).map(async ([storeName, storeSchema]) => {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const storeData = dbData.stores[storeName];
                const storeKeys = dbData.stores[`${storeName}_keys`];

                if (!storeData || !storeKeys) {
                    console.warn(`Missing data or keys for store '${storeName}'`);
                    return;
                }

                // Always use keys with put operation for maximum compatibility
                await Promise.all(storeData.map((item, i) => 
                    new Promise((resolve, reject) => {
                        const request = store.put(item, storeKeys[i]);
                        request.onerror = (error) => {
                            console.error(`Error putting data in store '${storeName}':`, error);
                            reject(request.error);
                        };
                        request.onsuccess = () => resolve();
                    })
                ));
            }));

            db.close();
        }));
    }


    // Import state from blob
    async importState(compressedState, compressed = false) {
        try {
            let state;
            if(!compressed) {
                state = await this.decompressData(compressedState);
            }else{
                state = compressedState;
            }
            return {
                success: true,
                timestamp: state.timestamp,
                import: async () => {
                    await this.importLocalStorageState(state.localStorage);
                    await this.importIndexedDBState(state.indexedDB);
                }
            };
        } catch (error) {
            console.log('[CCPorted State Manager] Error importing state: '+  error);
            throw error;
        }
    }

    setupAutoSync(callback, interval = 5 * 60 * 1000) {
        setInterval(async () => {
            try {
                // preload loading image
                const img = new Image();
                img.src = '/assets/images/loading.gif';

                console.log("[CCPorted State Manager] auto syncing....")
                const state = await this.exportState();
                await callback(state.state, state.timestamp);
            } catch (error) {
                console.log('[CCPorted State Manager] Auto-sync failed: '+  JSON.stringify(error) + ' ' + error.message + '\n' + error + '\n' + error.stack);
            }
        }, interval);
    }
}

class GameStateSync {
    constructor(userId, client) {
        this.userId = userId;
        this.client = client;
        this.syncUtil = new StateSyncUtility();
        this.stateFileName = `${userId}_save_state.state`;
    }

    async initialize() {
        this.syncUtil.setupAutoSync(async (state, timestamp) => {
            var notification = showAutoSaveNotification();
            localStorage.setItem('ccStatelastSave', timestamp);
            await this.saveToServer(state, timestamp);
            if(notification.getAttribute('data-creation-time') + notification.getAttribute('data-min-visible-time') < Date.now()){
                notification.remove();
            }else{
                setTimeout(() => {
                    notification.remove();
                }, notification.getAttribute('data-creation-time') + notification.getAttribute('data-min-visible-time') - Date.now());
            }
        });
        await this.loadFromServer();
    }

    async saveToServer(stateBlob, timestamp) {
        try {
            const { error } = await this.client
                .storage
                .from('save_states')
                .upload(this.stateFileName, stateBlob, {
                    upsert: true,
                    contentType: 'application/octet-stream'
                });
            const { error: error2 } = await this.client
                .from('u_profiles')
                .update({ last_save_state: timestamp})
                .eq('id', this.userId);

            if (error) {
                console.log('[CCPorted State Manager] Error saving state: ' + error);
                throw error;
            }
        } catch (error) {
            console.log('[CCPorted State Manager] Error saving state: ' + error);
            throw error;
        }
    }

    async loadFromServer() {
        try {
            const { data: profile, error: profileError } = await this.client
                .from('u_profiles')
                .select('last_save_state')
                .eq('id', this.userId)
                .single();
            if (profileError) {
                console.log('[CCPorted State Manager] Error loading state: ' + profileError);
                throw profileError;
            }
            const lastSave = profile.last_save_state || 0;
            if(!profile.last_save_state){
                console.log('[CCPorted State Manager] No saved state found, checking old save method');
                // they may be using the old save method
                const { data: oldSave, error: oldSaveError } = await this.client
                    .from('save_states')
                    .select('*')
                    .eq('user_id', this.userId);
                if(oldSaveError){
                    console.log('[CCPorted State Manager] Error loading state: ' + oldSaveError);
                    throw oldSaveError;
                }
                if(oldSave.length === 0){
                    console.log('[CCPorted State Manager] No saved state found (old or new)');
                    return;
                }
                console.log('[CCPorted State Manager] Old save found');
                // old data is of type text
                const decomp = await this.syncUtil.decompressOldData(oldSave[0].state);
                const timestamp = decomp.timestamp;
                console.log('[CCPorted State Manager] [old] Last save timestamp: ' + timestamp);
                const currentSave = localStorage.getItem('ccStatelastSave');
                console.log('[CCPorted State Manager] [old] Current save timestamp: ' + currentSave);
                if (!currentSave || timestamp > currentSave) {
                    console.log('[CCPorted State Manager] Game state has been updated');
                    localStorage.setItem('ccStatelastSave', timestamp);
                    console.log("[CCPorted State Manager] Importing state....");
                    const result = await this.syncUtil.importState(decomp, true);
                    if (result.success) {
                        console.log('[CCPorted State Manager] State loaded successfully');
                        await result.import();
                        location.reload();
                    } else {
                        console.log('[CCPorted State Manager] [310] Error loading state: ' + result.error);
                        throw result.error;
                    }
                }else{
                    console.log('[CCPorted State Manager] Transitioning to new save method');
                    const compressed = await this.syncUtil.compressData(decomp);
                    await this.saveToServer(compressed, timestamp);
                    console.log('[CCPorted State Manager] Old save transitioned');
                    console.log('[CCPorted State Manager] Deleting old save');
                    await this.client
                        .from('save_states')
                        .delete()
                        .eq('user_id', this.userId);
                    console.log('[CCPorted State Manager] Old save deleted');
                    return;
                }
            }
            const { data, error } = await this.client
                .storage
                .from('save_states')
                .download(this.stateFileName + '?timestampbuster=' + lastSave);
            if (error) {
                if (error.message.includes('Object not found')) {
                    console.log('[CCPorted State Manager] No saved state found');
                    return;
                }
                throw error;
            }
            const decomp = await this.syncUtil.decompressData(data);

            const timestamp = decomp.timestamp;
            console.log('[CCPorted State Manager] Last save timestamp: ' + timestamp);
            const currentSave = localStorage.getItem('ccStatelastSave');
            console.log('[CCPorted State Manager] Current save timestamp: ' + currentSave);
            if (!currentSave || timestamp > currentSave) {
                console.log('[CCPorted State Manager] Game state has been updated');
                localStorage.setItem('ccStatelastSave', timestamp);
                console.log('[CCPorted State Manager] Importing state....');
                const result = await this.syncUtil.importState(decomp, true);
                if (result.success) {
                    console.log('[CCPorted State Manager] State loaded successfully');
                    await result.import();
                    location.reload();
                } else {
                    console.log('[CCPorted State Manager] [310] Error loading state: ' + result.error);
                    throw result.error;
                }
            }
        } catch (error) {
            console.log('[CCPorted State Manager] [315] Error loading state: '+ error);
            throw error;
        }
    }
}


function showAutoSaveNotification() {
    var notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '10px';
    notification.style.borderRadius = '5px';
    notification.style.textAlign = 'center';
    notification.style.zIndex = '9999';
    notification.innerText = 'Auto-saving...';
    notification.setAttribute('data-creation-time', Date.now());
    notification.setAttribute('data-min-visible-time', '3000');

    const loading = document.createElement('img');
    loading.src = '/assets/images/loading.gif';
    loading.style.width = '20px';
    loading.style.height = '20px';
    loading.style.verticalAlign = 'middle';
    loading.style.marginRight = '10px';
    notification.insertBefore(loading, notification.firstChild);

    document.body.appendChild(notification);
    return notification;
}
