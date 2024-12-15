const Priority = Object.freeze({
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
});

const priorityToString = (number) => {
  switch (number) {
    case 0:
      return "High";
    case 1:
      return "Medium";
    case 2:
      return "Low";
    default:
      return null;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "var(--priority-1)";
    case "Medium":
      return "var(--priority-2)";
    case "Low":
      return "var(--priority-3)";
    default:
      return "var(--neutral-color)";
  }
};

export { priorityToString, getPriorityColor };
export default Priority;