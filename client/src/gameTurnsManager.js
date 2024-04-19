import { delay } from "./utils";
import ConnectFourServerApi from "./server";

const updateTurnsDelayInMs = 500;
const renderTurnsDelayInMs = 1000;

/** Provides functionality for managing the turns associated with a game */
export class GameTurnsManager {

  constructor(gameId, setTurns) {
    this.gameId = gameId;
    this.clientTurns = [];
    this.setTurns = setTurns;
    this.pollForTurns = false;
  }

  async updateTurns() {
    console.log('updateTurns() called')
    const serverTurns = await ConnectFourServerApi.getTurnsForGame(this.gameId);
    console.log(`server turns retrieved:`, serverTurns);
    const newTurns = this.getNewTurns(serverTurns);
    console.log('final set of new turns:', newTurns);
    for (let turn of newTurns) {
      console.log("updating turns to trigger re-render");
      this.clientTurns.push(turn);
      this.setTurns(this.clientTurns);
      await delay(renderTurnsDelayInMs);
    }
  }

  getNewTurns(serverTurns) {
    console.log("getNewTurns() called");
    const newTurnCount = serverTurns.length - this.clientTurns.length;
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

  enablePolling() {
    this.pollForTurns = true;
    this.poll();
  }

  disablePolling() {
    this.pollForTurns = false;
  }

  async poll() {
    while (this.pollForTurns) {
      await this.updateTurns();
      await delay(updateTurnsDelayInMs);
    }
  }
}