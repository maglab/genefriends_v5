let neo4j = require('neo4j-driver');

let neo4jUser = (process.env.DATABASEUSER || "neo4j");
let neo4jPassword = (process.env.DATABASEPASSWORD || "");
let neo4jConnectionString = (process.env.DATABASEURL || "bolt://neo4j:7687");
//let neo4jConnectionString = (process.env.DATABASEURL || "bolt://178.79.132.82:7687");

console.log(neo4jConnectionString)

let driver = neo4j.driver(
    neo4jConnectionString,
    neo4j.auth.basic(neo4jUser, neo4jPassword)
)

const neo4jGetSession = (_db) => {
    return driver.session({
        database: _db,
        defaultAccessMode: neo4j.session.READ
    })
}

module.exports = { neo4jGetSession }