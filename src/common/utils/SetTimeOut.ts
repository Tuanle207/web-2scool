const timeout = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const sleepWithCallback = async (fn: Function, ms: number) => {
  await timeout(ms || 1000);
  return fn();
};

const sleep =  async ( ms: number) => {
  await timeout(ms || 1000);
};

export {
  sleep,
  sleepWithCallback
};