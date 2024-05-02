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

  /** Conductor function:
   * - Retrieves updated set of turns from the server
   * - Calls this.getNewTurns() to get a list of new turns (not known by client)
   * - For every turn, adds it to this.clientTurns and calls the callback function
   * provided on construction with the updated clientTurns list. By default, the
   * callback function should be a function of the PlayGame component which triggers
   * a re-render of the entire board including the new piece represented by the added turn.
   * - Delays evaluating next turn (if there is one) until renderTurnsDelayInMs has transpired
   */
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

  /** Returns the set of new turns based on comparing this.clientTurns
   * against a provided list of serverTurns and returning any server turns
   * not found in the client turns list.
   */
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

  /** Enables polling and initiates polling (via this.poll()) */
  enablePolling() {
    this.pollForTurns = true;
    this.poll();
  }

  /** Disables polling such that on next poll, polling will cease. */
  disablePolling() {
    this.pollForTurns = false;
  }

  /** Polling function which calls this.updateTurns() and then
   * awaits updateTurnsDelayInMs to transpire before calling again.
   */
  async poll() {
    while (this.pollForTurns) {
      await this.updateTurns();
      await delay(updateTurnsDelayInMs);
    }
  }
}