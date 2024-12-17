const Status = Object.freeze({
  TODO: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  EXPIRED: 3,
});

// const statusToString = (number) => {
//   switch (number) {
//     case 0:
//       return "ToDo";
//     case 1:
//       return "InProgress";
//     case 2:
//       return "Completed";
//     case 3:
//       return "Expired";
//     default:
//       return null;
//   }
// };

const statusToStringDisplay = (string) => {
  switch (string) {
    case "ToDo":
      return "To Do";
    case "InProgress":
      return "In Progress";
    case "Completed":
      return "Completed";
    case "Expired":
      return "Expired";
    default:
      return null;
  }
}

const getStatusBgColor = (status) => {
  switch (status) {
    case "ToDo":
      return "var(--todo-background-color)";
    case "InProgress":
      return "var(--in-progress-background-color)";
    case "Completed":
      return "var(--completed-background-color)";
    case "Expired":
      return "var(--expired-background-color)";
    default:
      return "var(--neutral-color)";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "ToDo":
      return "var(--todo-color)";
    case "InProgress":
      return "var(--in-progress-color)";
    case "Completed":
      return "var(--completed-color)";
    case "Expired":
      return "var(--expired-color)";
    default:
      return "var(--neutral-color)";
  }
};

export { statusToStringDisplay, getStatusBgColor, getStatusColor };
export default Status;