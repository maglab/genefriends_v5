let db;
let collectionName = "savedData"
let requestDB = window.indexedDB.open("GeneFriends", 1);

requestDB.onerror = (event) => {
    console.error("Database error: " + event.target.errorCode);
};

requestDB.onsuccess = (event) => {
    db = event.target.result;
};

requestDB.onupgradeneeded = (event) => {
    let db = event.target.result;

    let objectStore = db.createObjectStore(collectionName, { keyPath: "timestamp" })

    objectStore.createIndex("timestamp", "timestamp", { unique: false })
};

const dataStore = {
    state() {
        return {
            data: []
        }
    },
    getters: {
        getResultById : (state) => (ts) => {
            //let transaction = db.transaction(collectionName, "readonly");
            //let objectStore = transaction.objectStore(collectionName);
            //let query = objectStore.get(Number(ts))
            //return query.onsuccess = () => {
            //    console.log(query.result)
            //    return query.result
            //}
            
            return state.data.find(d => d.timestamp === Number(ts)) 
        }
    },
    mutations: {
        saveDataToIDB(state, payload) {
            let transaction = db.transaction(collectionName, "readwrite");
            let objectStore = transaction.objectStore(collectionName);
            objectStore.add({
                timestamp: Date.now(),
                name: payload.name,
                data: JSON.parse(payload.data)
            })
        },
        loadDataToMemory(state){
            let transaction = db.transaction(collectionName, "readonly");
            let objectStore = transaction.objectStore(collectionName);
            let query = objectStore.getAll()
            query.onsuccess = () => { 
                state.data = query.result
            }
            query.onerror = (e) => {
                console.error(e)
            }
        },
        deleteResultById(state, ts){
            let transaction = db.transaction(collectionName, "readwrite");
            let objectStore = transaction.objectStore(collectionName);
            let query = objectStore.delete(ts)
            query.onsuccess = () => {
                store.commit('loadDataToMemory')
            }
            query.onerror = (e) => {
                console.error(e)
            }
        }
    },
    actions: {
        getAllData(context) {
            context.commit('loadDataToMemory')
        },
        deleteById(context, ts) {
            context.commit('deleteResultById', ts)
        }
    }
}

export { dataStore }