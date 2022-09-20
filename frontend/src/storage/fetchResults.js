import axios from 'axios'
const { PORT } = require('../endpoint')
const fetchFriendsMetadata = async (_formObject) => {

    if (_formObject.seedGenesInDatabaseObj.length === 1) {
        const friendsDataTemp = await axios.post(PORT + '/find-friends-metadata-single-gene', {
            seedGenesInDatabaseObj: _formObject.seedGenesInDatabaseObj || [],
            species: _formObject.species,
            dataSource: _formObject.dataSource,
            tissue: _formObject.tissue,
            threshold: _formObject.threshold
        })
        return (friendsDataTemp.data.length === 0) ? [] : friendsDataTemp.data

    } else if (_formObject.seedGenesInDatabaseObj.length > 1) {
        const friendsDataTemp = await axios.post(PORT + '/find-friends-metadata-many-genes', {
            seedGenesInDatabaseObj: _formObject.seedGenesInDatabaseObj || [],
            species: _formObject.species,
            dataSource: _formObject.dataSource,
            tissue: _formObject.tissue
        })
        return (friendsDataTemp.data.length === 0) ? [] : friendsDataTemp.data
    }
    else {
        return []
    }
}

const fetchFriendsDavidData = async (_formObject) => {
    const davidDataTemp = await axios.post(PORT + '/find-friends-david-data', {
        genesForDavidArr: _formObject.friendsMetadata.map(_n => _n.nodeidentifier) || [],
        species: _formObject.species,
        dataSource: _formObject.dataSource,
        tissue: _formObject.tissue
    })
    return (davidDataTemp.data.length === 0) ? [] : JSON.parse(davidDataTemp.data)
}

export { fetchFriendsMetadata, fetchFriendsDavidData }

/*
            toast.add({
                severity: 'info',
                summary: 'Status',
                detail: 'No Friends were found in our database.',
                life: 10000
            })
*/

/*

            toast.add({
                severity: 'error',
                summary: 'Status',
                detail: 'DAVID third party server is DOWN.',
                life: 10000
            })
*/