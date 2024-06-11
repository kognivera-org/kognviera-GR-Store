import React, { Component } from 'react'
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = ({page, stepsLabels, steps}) => {

  const renderSteps = Array(steps).fill().map((_, i) => i);
  
  const changePercentaje = () => {
    let porcentTable = {
      '4' : {
        '1': 16,
        '2': 49,
        '3': 82,
        '4': 100
      },
      '2': {
        '1': 49.5,
        '2': 100,
      }
    }
    return porcentTable[steps] ? porcentTable[steps][page] ? porcentTable[steps][page] : porcentTable[steps][1] : 0;
  };


  return (
    <React.Fragment>
      <ProgressBar percent={changePercentaje()}>
        {
          renderSteps.map((index) => {
             return <Step key={index}>
             {({ accomplished }) => (
             <React.Fragment>
               <div className={`indexedStep ${accomplished ? "completed" : ""}`}>
             {index + 1}
               </div>
               <div className={`textStep0 ${accomplished ? "textCompleted" : ""}`}>{stepsLabels[index]}</div>
             </React.Fragment>
         )}
           </Step> 
          })
        }
     </ProgressBar>
      </React.Fragment>
  )
}
export default MultiStepProgressBar;