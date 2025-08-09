import React from "react";

const ProgressSteps = ({ title, progressSteps }) => {
  return (
    <div className="progress-header">
      <div className="progress-label">
        <span style={{ marginRight: "12px" }}>{title}</span>
      </div>
      <div className="progress-steps">
        {progressSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`progress-dot ${step.completed ? "completed" : ""} ${
                step.active ? "active" : ""
              }`}
            >
              <div className="progress-dot-inner"></div>
            </div>
            {index < progressSteps.length - 1 && (
              <div
                className={`progress-line ${step.completed ? "completed" : ""}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
