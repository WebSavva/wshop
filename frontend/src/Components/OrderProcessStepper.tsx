import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import ProcessStepper from "./ProcessSteps/ProcessStepper";
import { cloneDeep } from "lodash";

const initialStages = [
  { stepName: "authorization", isPassed: true, stepLink: "/buy/authorization" },
  { stepName: "shipping", isPassed: false, stepLink: "/buy/shipping" },
  { stepName: "payment", isPassed: false, stepLink: "/buy/payment" },
  { stepName: "place order", isPassed: false, stepLink: "/buy/place" },
];

const OrderProcessStepper = () => {
  const { pathname } = useLocation();
  const [processStagesState, setProcessStagesState] =
    useState<typeof initialStages>(initialStages);

  useEffect(() => {
    setProcessStagesState((prevState) => {
      const newState = cloneDeep(prevState);
      let isLinkPassed = false;
      for (let i = 0; i < newState.length; i++) {
        newState[i].isPassed = !isLinkPassed;

        if (newState[i].stepLink === pathname) {
          isLinkPassed = true;
        }
      }
      return newState;
    });
  }, [pathname]);
  return <ProcessStepper steps={processStagesState} />;
};

export default OrderProcessStepper;
