const VNSigns = [
  "aAeEoOuUiIdDyY",
  "áàạảãâấầậẩẫăắằặẳẵ",
  "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
  "éèẹẻẽêếềệểễ",
  "ÉÈẸẺẼÊẾỀỆỂỄ",
  "óòọỏõôốồộổỗơớờợởỡ",
  "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
  "úùụủũưứừựửữ",
  "ÚÙỤỦŨƯỨỪỰỬỮ",
  "íìịỉĩ",
  "ÍÌỊỈĨ",
  "đ",
  "Đ",
  "ýỳỵỷỹ",
  "ÝỲỴỶỸ"
];

const withoutVNSign = (str: string) => {
  for (let i = 1; i < VNSigns.length; i++)
    for (let j = 0; j < VNSigns[i].length; j++)
      str = str.replace(VNSigns[i][j], VNSigns[0][i - 1]);
  return str;
};

export {
  withoutVNSign
};