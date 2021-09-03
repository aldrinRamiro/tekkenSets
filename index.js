const constants = require("./constants.js");
const { GraphQLClient } = require("graphql-request");

const ENDPOINT = "https://api.smash.gg/gql/alpha";
const AUTH_TOKEN = constants.AUTH_TOKEN;

let playerId = "249741";
let gameId = "17"; //Tekken

const USERID_SET_QUERY = `\
    query SetsByPlayer ($playerId: ID!) {\
        player(id: $playerId) {\
        gamerTag\
        sets(perPage: 999) {\
            nodes {\
            displayScore\
            event {\
                videogame {\
                id,\
                displayName\
                }\
            }\
            }\
        }\
        }\
    }\
`;

const REQUEST_VARIABLES = `{"playerId": "${playerId}"}`;

async function main() {
  const graphQLClient = new GraphQLClient(ENDPOINT, {
    headers: {
      authorization: "Bearer " + AUTH_TOKEN,
    },
  });

  const rawData = await graphQLClient.request(
    USERID_SET_QUERY,
    JSON.parse(REQUEST_VARIABLES)
  );

  let sets = rawData.player.sets.nodes;

  let filteredSets = sets.reduce(function (filtered, set) {
    if (set.displayScore != "DQ" && set.event.videogame.id == "17") {
      filtered.push(set.displayScore);
    }

    return filtered;
  }, []);

  console.dir(filteredSets, { maxArrayLength: null });
}

main().catch((error) => console.error(error));
