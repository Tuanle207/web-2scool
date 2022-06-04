import { Util } from '../interfaces';


const extToMines: Util.IObject<string> = {
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  
  // Add supported minetypes here
};

export const getExtension = (mineType: string): string | undefined => {
  return Object.keys(extToMines).find(x => extToMines[x] === mineType);
};

export const getMineType = (ext: string): string | undefined => {
  return extToMines[ext];
};

export const saveBlobAsFile = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  const ext = getExtension(data.type);
  link.setAttribute('download', `${filename}.${ext || 'txt'}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};