// Hàm format thời gian
export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();

  const isCurrentYear = date.getFullYear() === now.getFullYear();

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    ...(isCurrentYear ? {} : { year: 'numeric' }),
  };

  return new Intl.DateTimeFormat('vi-VN', options).format(date);
};