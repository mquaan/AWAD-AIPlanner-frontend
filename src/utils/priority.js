const Priority = Object.freeze({
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
});

// const priorityToString = (number) => {
//   switch (number) {
//     case 0:
//       return "High";
//     case 1:
//       return "Medium";
//     case 2:
//       return "Low";
//     default:
//       return null;
//   }
// };

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "var(--priority-high-color)";
    case "Medium":
      return "var(--priority-medium-color)";
    case "Low":
      return "var(--priority-low-color)";
    default:
      return "var(--neutral-color)";
  }
};

export { getPriorityColor };
export default Priority;