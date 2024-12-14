const Status = Object.freeze({
  TODO: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  EXPIRED: 3,
});

const statusToString = (number) => {
  switch (number) {
    case 0:
      return "ToDo";
    case 1:
      return "InProgress";
    case 2:
      return "Completed";
    case 3:
      return "Expired";
    default:
      return null;
  }
};

export { statusToString };
export default Status;