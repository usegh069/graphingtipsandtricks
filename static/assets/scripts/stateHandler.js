// State Synchronization Utility
class StateSyncUtility {
    constructor() {
        this.compressionEnabled = typeof CompressionStream !== 'undefined';
    }

    // Compress data using CompressionStream if available
    async compressData(data) {
        if (!this.compressionEnabled) {
            return btoa(JSON.stringify(data));
        }

        const jsonString = JSON.stringify(data);
        const encoder = new TextEncoder();
        const compressed = new Blob([encoder.encode(jsonString)]).stream()
            .pipeThrough(new CompressionStream('gzip'));

        return new Response(compressed).arrayBuffer()
            .then(buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))));
    }

    // Decompress data
    async decompressData(compressed) {
        if (!this.compressionEnabled) {
            return JSON.parse(atob(compressed));
        }

        const binaryString = atob(compressed);
        const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
        const decompressed = new Blob([bytes]).stream()
            .pipeThrough(new DecompressionStream('gzip'));

        return new Response(decompressed).text().then(JSON.parse);
    }

    // Get all localStorage data
    getLocalStorageData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        return data;
    }

    // Extract schema information from an object store
    async getObjectStoreSchema(db, storeName) {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        // Get index information
        const indexes = Array.from(store.indexNames).map(indexName => {
            const index = store.index(indexName);
            return {
                name: indexName,
                keyPath: index.keyPath,
                multiEntry: index.multiEntry,
                unique: index.unique
            };
        });

        return {
            name: storeName,
            keyPath: store.keyPath,
            autoIncrement: store.autoIncrement,
            indexes
        };
    }

    // Get all IndexedDB databases, their schemas and content
    async getAllIndexedDBData() {
        const databases = await window.indexedDB.databases();
        const data = {};

        for (const dbInfo of databases) {
            const dbName = dbInfo.name;
            data[dbName] = {
                version: dbInfo.version,
                stores: {},
                schema: {}
            };

            const connection = await new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });

            const stores = Array.from(connection.objectStoreNames);

            // Get schema for each store
            for (const storeName of stores) {
                data[dbName].schema[storeName] = await this.getObjectStoreSchema(
                    connection,
                    storeName
                );

                // Get data from each store
                const transaction = connection.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);

                data[dbName].stores[storeName] = await new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => resolve(request.result);
                });

                // If the store uses a keyPath, get all keys as well
                if (store.keyPath) {
                    data[dbName].stores[`${storeName}_keys`] = await new Promise((resolve, reject) => {
                        const request = store.getAllKeys();
                        request.onerror = () => reject(request.error);
                        request.onsuccess = () => resolve(request.result);
                    });
                }
            }

            connection.close();
        }

        return data;
    }

    // Export all browser state
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
            console.error('Error exporting state:', error);
            throw error;
        }
    }

    // Import state into localStorage
    async importLocalStorageState(data) {
        localStorage.clear();
        for (const [key, value] of Object.entries(data)) {
            localStorage.setItem(key, value);
        }
    }

    // Create object store with schema
    createObjectStore(db, schema) {
        const store = db.createObjectStore(schema.name, {
            keyPath: schema.keyPath,
            autoIncrement: schema.autoIncrement
        });

        // Create indexes
        for (const indexSchema of schema.indexes) {
            store.createIndex(indexSchema.name, indexSchema.keyPath, {
                unique: indexSchema.unique,
                multiEntry: indexSchema.multiEntry
            });
        }

        return store;
    }

    // Import state into IndexedDB
    async importIndexedDBState(data) {
        for (const [dbName, dbData] of Object.entries(data)) {
            // Delete existing database if it exists
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

                    // Create stores with their schemas
                    for (const [storeName, storeSchema] of Object.entries(dbData.schema)) {
                        this.createObjectStore(db, storeSchema);
                    }
                };

                request.onsuccess = () => resolve(request.result);
            });

            // Populate stores with data
            for (const [storeName, storeSchema] of Object.entries(dbData.schema)) {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const data = dbData.stores[storeName];
                const keys = dbData.stores[`${storeName}_keys`];

                // If we have both keys and data, use them together
                if (keys && data) {
                    for (let i = 0; i < data.length; i++) {
                        await new Promise((resolve, reject) => {
                            const request = store.put(data[i], keys[i]);
                            request.onerror = () => reject(request.error);
                            request.onsuccess = () => resolve();
                        });
                    }
                } else {
                    // Otherwise just add the data
                    for (const item of data) {
                        await new Promise((resolve, reject) => {
                            const request = store.add(item);
                            request.onerror = () => reject(request.error);
                            request.onsuccess = () => resolve();
                        });
                    }
                }
            }

            db.close();
        }
    }

    // Import state from compressed string
    async importState(compressedState) {
        try {
            const state = await this.decompressData(compressedState);
            return {
                success: true,
                timestamp: state.timestamp,
                import: async () => {
                    await this.importLocalStorageState(state.localStorage);
                    await this.importIndexedDBState(state.indexedDB);
                }
            };
        } catch (error) {
            console.error('Error importing state:', error);
            throw error;
        }
    }

    // Set up automatic state export
    setupAutoSync(callback, interval = 5 * 60 * 1000) {
        setInterval(async () => {
            try {
                const state = await this.exportState();
                await callback(state.state, state.timestamp);
            } catch (error) {
                console.error('Auto-sync failed:', error);
            }
        }, interval);
    }
}

class GameStateSync {
    constructor(userId, client) {
        this.userId = userId;
        this.client = client;
        this.syncUtil = new StateSyncUtility();
    }

    async initialize() {
        // Set up automatic sync
        this.syncUtil.setupAutoSync(async (state, timestamp) => {
            sessionStorage.setItem('lastSave', timestamp);
            await this.saveToServer(state);
        });
        await this.loadFromServer();
    }

    async saveToServer(compressedState) {
        try {
            const { error } = await this.client
                .from('save_states')
                .upsert({
                    user_id: this.userId,
                    state: compressedState
                });
            // update last save time
            if (error) {
                console.error('Error saving state:', error);
                throw error;
            }
        } catch (error) {
            console.error('Error saving state:', error);
            throw error;
        }
    }

    async loadFromServer() {
        try {
            const { data: state } = await this.client
                .from('save_states')
                .select('state')
                .eq('user_id', this.userId)
                .single();
            if (state) {
                const result = await this.syncUtil.importState(state.state);
                if (result.success) {
                    console.log('State loaded successfully');
                    if (result.timestamp) {
                        console.log('Last saved at:', new Date(result.timestamp).toLocaleString());
                        console.log(`Current save from ${new Date(parseInt(sessionStorage.getItem('lastSave')) || 0).toLocaleString()}`);
                        const currentSave = parseInt(sessionStorage.getItem('lastSave'));
                        sessionStorage.setItem('lastSave',(result.timestamp));
                        if (!currentSave || currentSave == null || result.timestamp > currentSave) {
                            console.log('Game state has been updated');
                            await result.import();

                            location.reload();
                        }
                    }
                } else {
                    console.error('Error loading state:', result.error);
                    throw result.error;
                }
            }
        } catch (error) {
            console.error('Error loading state:', error);
            throw error;
        }
    }
}