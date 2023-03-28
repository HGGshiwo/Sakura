function SetUrlQuery(in_url, in_query, in_val) {
    var reg = new RegExp('[?&]+'+in_query+'=([^&]*)');
    var re_resl = in_url.match(reg);
    if(re_resl){
      var set_val = (re_resl[0].slice(0,1)+in_query+'='+encodeURIComponent(in_val));
      in_url = in_url.replace(re_resl[0], set_val);
    }else {
      var xuu = GetXUU(in_url);
      in_url += (xuu+in_query+'='+encodeURIComponent(in_val));
    }
    return in_url;
  }
  

function GetUrlQuery(in_url, in_query) {
    var reg = new RegExp('[?&]+'+in_query+'=([^&]*)');
    var re_resl = in_url.match(reg);
    if(re_resl){
      var qVal = re_resl[1];
      if(qVal){
        qVal = qVal.replace(/[+]{1}/g, ' ');
        qVal = decodeURIComponent(qVal);
        return qVal;
      }
    }
    return null;
  }

  // __set_tieba_video_rpt

export {GetUrlQuery}