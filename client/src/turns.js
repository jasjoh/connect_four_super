import { delay } from "./utils";
import ConnectFourServerApi from "./server";

const checkTurnsDelayInMs = 500;
const renderTurnsDelayInMs = 1000;

/** Provides functionality for managing the turns associated with a game */
class GameTurnsManager {

  constructor(gameId, setTurns) {
    this.gameId = gameId;
    this.clientTurns = [];
    this.setTurns = setTurns;
  }

  async checkTurnsPeriodically() {
    this.updateTurns();
    delay(checkTurnsDelayInMs);
  }

  async updateTurns() {
    console.log('updateTurns() called')
    const serverTurns = await ConnectFourServerApi.getTurnsForGame(this.gameId);
    console.log(`server turns retrieved:`, serverTurns);
    const newTurns = this.getNewTurns(serverTurns);
    console.log('final set of a new turns:', newTurns);
    for (let turn of newTurns) {
      console.log("updating turns to trigger re-render");
      this.clientTurns.push(turn);
      this.setTurns(this.clientTurns);
      delay(renderTurnsDelayInMs);
    }
  }

  getNewTurns(serverTurns) {
    console.log("getNewTurns() called");
    const newTurnCount = newTurns.length - serverTurns.length;
    console.log("newTurnCount calculated as:", newTurnCount);
    const newTurns = [];
    let turnsAdded = 0;
    while (turnsAdded < newTurnCount) {
      console.log("adding a new turn");
      turnsAdded++;
      newTurns.unshift(serverTurns[serverTurns.length - turnsAdded]);
    }
    return newTurns;
  }
}