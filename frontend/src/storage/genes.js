import axios from "axios"
import { fetchFriendsMetadata, fetchFriendsDavidData } from './fetchResults'
const { PORT } = require('../endpoint')

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

const genesStore = {
    state() {
        return {
            input: {
                species: "ENS",
                dataSource: "SRA",
                selectedObjectType: "G",
                selectedTissue: "0",
                selectedSeedGenes: ""
            },
            setup: {},
            friendsMetadataLoading: true,
            friendsMetadata: [],
            david: {
                loading: true,
                data: []
            },
            allSavedData: [],
            notifications: []
        }
    },
    getters: {
        setupReady: state => (state.setup.seedGenesInDatabaseObj || state.setup.seedGenesInDatabaseObj?.length > 0),
        singleGene: state => (state.setup.seedGenesInDatabaseObj.length === 1),
        friendsMetadataEmpty: state => !(state.friendsMetadata.length > 0),
        davidDataEmpty: state => !(state.david.data.length > 0)
    },
    mutations: {
        saveInput(state, payload) {
            state.input = payload
            axios.post(PORT + '/validate', {
                seedGenes: payload.seedGenes,
                species: payload.species,
                dataSource: payload.dataSource,
                tissue: payload.tissue,
                objectType: payload.objectType
            })
                .then(geneGroups => {
                    state.setup.seedGenesInDatabaseObj = geneGroups.data[0]
                    state.setup.excluded = geneGroups.data[1]
                    state.setup.included = geneGroups.data[2]

                    if (state.setup.seedGenesInDatabaseObj.length != 0) {
                        state.setup.setupNextBottomState = false

                        if (state.setup.seedGenesInDatabaseObj.length != 1) {    // did multiple genes where found in the database genes?
                            state.setup.flagSingleGene = false
                        } else {
                            state.setup.flagSingleGene = true
                        }
                    }
                })
        },
        async lookForFriends(state, payload) {

            try {
                state.friendsMetadataLoading = true

                let friendsMetadata = await fetchFriendsMetadata({
                    seedGenesInDatabaseObj: state.setup.seedGenesInDatabaseObj,
                    species: state.input.species,
                    dataSource: state.input.dataSource,
                    tissue: state.input.tissue,
                    threshold: payload.threshold
                })

                state.friendsMetadata = friendsMetadata;
            }
            catch (error) {
                console.log(error)
                state.notifications.unshift("No friends were found.")
            }
            finally{
                state.friendsMetadataLoading = false
            }


            try {

                let davidFriends = await fetchFriendsDavidData({
                    friendsMetadata: state.friendsMetadata,
                    species: state.input.species,
                    dataSource: state.input.dataSource,
                    tissue: state.input.tissue
                })

                state.david.data = davidFriends;
            }
            catch (error) {
                console.log(error.response.status)
                if(error.response.status !== 504){
                    state.notifications.unshift("DAVID third party server is DOWN.")
                }
            }
            finally {
                state.david.loading = false;
            }

        },
        clearInit(state){
            state.input = {}
        },
        clearSetup(state){
            state.setup = {}
        },
        clearInit(state){
            state.input = {}
            state.setup = {}
        },
        clearResults(state) {
            state.friendsMetadata = []
            state.david = {
                loading: true,
                data: []
            }
            console.log(state.david)
        },
        saveDataToIDB(state, payload) {
            let transaction = db.transaction(collectionName, "readwrite");
            let objectStore = transaction.objectStore(collectionName);
            objectStore.add({
                timestamp: Date.now(),
                name: payload.name,
                data: JSON.stringify({
                    input: state.input,
                    setup: state.setup,
                    friendsMetadata: state.friendsMetadata,
                    david: state.david
                })
            })
        },
        loadDataToMemory(state) {
            let transaction = db.transaction(collectionName, "readonly");
            let objectStore = transaction.objectStore(collectionName);
            let query = objectStore.getAll()
            query.onsuccess = () => {
                state.allSavedData = query.result
            }
            query.onerror = (e) => {
                console.error(e)
            }
        },
        deleteResultById(state, ts) {
            let transaction = db.transaction(collectionName, "readwrite");
            let objectStore = transaction.objectStore(collectionName);
            let query = objectStore.delete(ts)
            query.onsuccess = () => {
                state.allSavedData = state.allSavedData.filter(d => d.timestamp !== ts)
            }
            query.onerror = (e) => {
                console.error(e)
            }
        },
        loadResultById(state, payload) {
            let result = JSON.parse(state.allSavedData.find(d => d.timestamp === Number(payload)).data)

            state.input = result.input
            state.setup = result.setup
            state.friendsMetadata = result.friendsMetadata
            state.david = result.david
        },
        pushNotification(state, payload){
            state.notifications.unshift(payload)
            console.log("Added")
        }
    },
    actions: {
        saveInput(context, payload) {
            context.commit("saveInput", payload)
        },
        lookForFriends(context, payload) {
            context.commit("clearResults")
            context.commit("lookForFriends", payload)
        },
        clearInit(context){
            context.commit("clearInit")
        },
        clearInput(context){
            context.commit("clearInput")
        },
        clearSetup(context){
            context.commit("clearSetup")
        },
        clearResults(context) {
            context.commit("clearResults")
        },
        getAllData(context) {
            context.commit('loadDataToMemory')
        },
        deleteById(context, ts) {
            context.commit('deleteResultById', ts)
        },
        saveDataToIDB(context, payload) {
            context.commit("saveDataToIDB", payload)
        },
        loadResultById(context, payload) {
            context.commit("loadResultById", payload)
        },
        pushNotification(context, payload){
            context.commit("pushNotification", payload)
        }
    }
}
export { genesStore }