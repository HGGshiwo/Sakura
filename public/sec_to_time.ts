var sec_to_time = (s: number): string => {
  var t = '';
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = Math.floor(s % 60);
    if(hour > 0) {
      t = hour < 10? `0${hour}:`:`${hour}:`;
    }
    t = min < 10? `${t}0${min}`:`${t}${min}`;
    t = sec < 10? `${t}:0${sec}`:`${t}:${sec}`
  }
  return t;
};

export default sec_to_time