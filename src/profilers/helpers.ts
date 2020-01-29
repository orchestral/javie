let microtime = function (): number {
  let time = new Date().getTime();

  return parseInt(`${(time/1000)}`, 10);
};

let seconds = function (): string {
  let time: number = new Date().getTime();
  let ms: number = parseInt(`${(time/1000)}`, 10);

  return `${(time-(ms*1000))/1000} sec`;
};


export {
  microtime,
  seconds,
}
