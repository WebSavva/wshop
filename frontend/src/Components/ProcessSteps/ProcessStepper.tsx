import ProcessStage from "./ProcessStage";

const OrderProcessSteps: React.FC<{
  steps: Array<{
    stepName: string;
    isPassed: boolean;
    stepLink: string;
  }>;
}> = ({ steps }) => {
  return (
    <div className="steps">
      {steps.map((stepData, i) => {
        return (
          <ProcessStage
            key={stepData.stepName}
            stageName={stepData.stepName}
            isActive={stepData.isPassed}
            isStart={!i}
            stepLink={stepData.stepLink}
          />
        );
      })}
    </div>
  );
};

export default OrderProcessSteps;
