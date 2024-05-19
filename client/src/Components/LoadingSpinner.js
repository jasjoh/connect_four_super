import "./LoadingSpinner.css"

import { useEffect, useState } from "react";
import { delay } from "../utils";

/** A simple loading spinner to display while awaiting network requests
 *
 * Props:
 *  - None
 *
 * State:
 *  - None
 *
 * BoardPlayCell -> LoadingSpinner*/
function LoadingSpinner() {
  // console.log("LoadingSpinner re-rendered");

  const [extendedLoading, setExtendedLoading] = useState(false);

  useEffect(function startExtendedLoadingTimerOnMount(){
    async function startExtendedLoadingTimer(){
      console.log("startExtendedLoadingTimerOnMount() called thus component is being re-mounted");
      await delay(5000);
      setExtendedLoading(true);
    }
    startExtendedLoadingTimer();
  }, [])

  return (
    <div className="LoadingSpinner">
      <div className="LoadingSpinner-spinner"></div>
      { !extendedLoading ?        (
          <div className="LoadingSpinner-text">Loading ...</div> ) :
        ( <div className="LoadingSpinner-text">Extended loading detected - server warming up - please wait 60s and reload page if necessary ...</div> )
      }
    </div>
  );
}

export default LoadingSpinner;