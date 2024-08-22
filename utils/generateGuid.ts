export default () => {
  // create a 32-bit random number
  const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];

  // pad the string to make it 8 characters long
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (randomValue & (0x1 | (Math.random() * 16))) >> 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
