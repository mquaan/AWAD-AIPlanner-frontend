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

export { priorityToString };
export default Priority;