//樱花动漫api
import {getDomFromString} from '../../public/Dom';

class Vp {
  constructor(_url) {
    this._url = _url;
    this.title = '';
    this.episode = '';
    this.src = '';
  }

  async __getset_play(_getplay_url, times) {
    console.log(`尝试第${times}次`);
    return fetch(_getplay_url, {
      headers: {
        referer: this._url,
      },
    }).then(response => {
      console.log(response.status);
      if (response.status != 200) {
        return this.__getset_play(_getplay_url, times + 1);
      } else {
        return response.text();
      }
    });
  }

  load(callback) {
    fetch(this._url)
      .then(response => response.text())
      .then(responseText => {
        const document = getDomFromString(responseText);
        let tit = document.getElementsByClass('tit')[0];
        this.title = tit.getElementsByTagName('a')[0].innerHTML;
        this.episode = tit.getElementsByTagName('span')[0].innerHTML;
        const _getplay_url = __yh_cb_getplay_url(this._url);
        this._getplay_url = _getplay_url;
        return _getplay_url;
      })
      .then(() => {
        return this.__getset_play(this._getplay_url, 1);
      })
      .then(_json_text => {
        console.log(_json_text);
        if (_json_text.includes('ipchk:操')) {
          if (callback) {
            callback();
          }
          return;
        }
        var _json_obj = JSON.parse(_json_text);
        var _purl = __getplay_rev_data(_json_obj['purl']);
        var _vurl = __getplay_rev_data(_json_obj['vurl']);
        var _play_ex = _json_obj['ex'];
        var vlt_lr = __get_vlt_lr(_play_ex);
        var _vurlp2_getplay_url =
          '&getplay_url=' + encodeURIComponent(this._getplay_url);
        var src = ___make_url_vlt_param(
          _purl + _vurl + _vurlp2_getplay_url,
          vlt_lr,
        );
        return src;
      })
      .then(src => {
        //内嵌播放器的url
        var url = this._url.replace(/\/vp\/(\d+?)-(\d+?)-(\d+?)\.html.*/, src);
        this.src = GetVUrl(url);
        console.log(this.src);
      })
      .then(() => {
        console.log('use callback');
        if (callback) {
          callback();
        }
      })
      .catch(err => {
        console.log('load err', err);
      });
  }
}
function __yh_cb_getplay_url(_url) {
  //_url: 请求网址的url
  const _rand = Math.random();
  const _getplay_url =
    _url.replace(
      /\/vp\/(\d+?)-(\d+?)-(\d+?)\.html.*/,
      '/_getplay?aid=$1&playindex=$2&epindex=$3',
    ) +
    '&r=' +
    _rand;
  return _getplay_url;
}

function ___make_url_vlt_param(_in_url, vlt_lr) {
  var xxx = _in_url.indexOf('?') > 0 ? '&' : '?';
  _in_url += xxx + 'vlt_l=' + vlt_lr[0] + '&vlt_r=' + vlt_lr[1];
  return _in_url;
}

function __get_vlt_lr(_in_ex) {
  const re_resl = _in_ex.match(/^#ex=.+#vlt=L(\d+)R(\d+)/);
  var vlt_lr = [0, 0];
  if (re_resl) {
    vlt_lr = [__key_enc_vlt(re_resl[1]), __key_enc_vlt(re_resl[2])];
  }
  return vlt_lr;
}

function __getplay_rev_data(_in_data) {
  if (_in_data.indexOf('{') < 0) {
    var encode_version = 'jsjiami.com.v5',
      unthu = '__0xb5aef',
      __0xb5aef = [
        'wohHHQdR',
        'dyXDlMOIw5M=',
        'dA9wwoRS',
        'U8K2w7FvETZ9csKtEFTCjQ==',
        'wo7ChVE=',
        'VRrDhMOnw6I=',
        'wr5LwoQkKBbDkcKwwqk=',
      ];
    (function (_0x22b97e, _0x2474ca) {
      var _0x5b074e = function (_0x5864d0) {
        while (--_0x5864d0) {
          _0x22b97e['push'](_0x22b97e['shift']());
        }
      };
      _0x5b074e(++_0x2474ca);
    })(__0xb5aef, 0x1ae);
    var _0x2c0f = function (_0x19a33a, _0x9a1ebf) {
      _0x19a33a = _0x19a33a - 0x0;
      var _0x40a3ce = __0xb5aef[_0x19a33a];
      if (_0x2c0f['initialized'] === undefined) {
        (function () {
          var _0x4d044c =
            typeof window !== 'undefined'
              ? window
              : typeof process === 'object' &&
                typeof require === 'function' &&
                typeof global === 'object'
              ? global
              : this;
          var _0x1268d6 =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
          _0x4d044c['atob'] ||
            (_0x4d044c['atob'] = function (_0x2993de) {
              var _0x467e1d = String(_0x2993de)['replace'](/=+$/, '');
              for (
                var _0x22a01d = 0x0,
                  _0x1ee2a1,
                  _0x2cf5ea,
                  _0x3a84f7 = 0x0,
                  _0x5c0e64 = '';
                (_0x2cf5ea = _0x467e1d['charAt'](_0x3a84f7++));
                ~_0x2cf5ea &&
                ((_0x1ee2a1 =
                  _0x22a01d % 0x4 ? _0x1ee2a1 * 0x40 + _0x2cf5ea : _0x2cf5ea),
                _0x22a01d++ % 0x4)
                  ? (_0x5c0e64 += String['fromCharCode'](
                      0xff & (_0x1ee2a1 >> ((-0x2 * _0x22a01d) & 0x6)),
                    ))
                  : 0x0
              ) {
                _0x2cf5ea = _0x1268d6['indexOf'](_0x2cf5ea);
              }
              return _0x5c0e64;
            });
        })();
        var _0x3c81da = function (_0x457f21, _0x6cb980) {
          var _0x133a9b = [],
            _0x749ec5 = 0x0,
            _0x3ceeee,
            _0x1df5a4 = '',
            _0x35a2a6 = '';
          _0x457f21 = atob(_0x457f21);
          for (
            var _0x9a0e47 = 0x0, _0x4a71aa = _0x457f21['length'];
            _0x9a0e47 < _0x4a71aa;
            _0x9a0e47++
          ) {
            _0x35a2a6 +=
              '%' +
              ('00' + _0x457f21['charCodeAt'](_0x9a0e47)['toString'](0x10))[
                'slice'
              ](-0x2);
          }
          _0x457f21 = decodeURIComponent(_0x35a2a6);
          for (var _0x2ef02e = 0x0; _0x2ef02e < 0x100; _0x2ef02e++) {
            _0x133a9b[_0x2ef02e] = _0x2ef02e;
          }
          for (_0x2ef02e = 0x0; _0x2ef02e < 0x100; _0x2ef02e++) {
            _0x749ec5 =
              (_0x749ec5 +
                _0x133a9b[_0x2ef02e] +
                _0x6cb980['charCodeAt'](_0x2ef02e % _0x6cb980['length'])) %
              0x100;
            _0x3ceeee = _0x133a9b[_0x2ef02e];
            _0x133a9b[_0x2ef02e] = _0x133a9b[_0x749ec5];
            _0x133a9b[_0x749ec5] = _0x3ceeee;
          }
          _0x2ef02e = 0x0;
          _0x749ec5 = 0x0;
          for (
            var _0xa5d5ef = 0x0;
            _0xa5d5ef < _0x457f21['length'];
            _0xa5d5ef++
          ) {
            _0x2ef02e = (_0x2ef02e + 0x1) % 0x100;
            _0x749ec5 = (_0x749ec5 + _0x133a9b[_0x2ef02e]) % 0x100;
            _0x3ceeee = _0x133a9b[_0x2ef02e];
            _0x133a9b[_0x2ef02e] = _0x133a9b[_0x749ec5];
            _0x133a9b[_0x749ec5] = _0x3ceeee;
            _0x1df5a4 += String['fromCharCode'](
              _0x457f21['charCodeAt'](_0xa5d5ef) ^
                _0x133a9b[
                  (_0x133a9b[_0x2ef02e] + _0x133a9b[_0x749ec5]) % 0x100
                ],
            );
          }
          return _0x1df5a4;
        };
        _0x2c0f['rc4'] = _0x3c81da;
        _0x2c0f['data'] = {};
        _0x2c0f['initialized'] = !![];
      }
      var _0x4222af = _0x2c0f['data'][_0x19a33a];
      if (_0x4222af === undefined) {
        if (_0x2c0f['once'] === undefined) {
          _0x2c0f['once'] = !![];
        }
        _0x40a3ce = _0x2c0f['rc4'](_0x40a3ce, _0x9a1ebf);
        _0x2c0f['data'][_0x19a33a] = _0x40a3ce;
      } else {
        _0x40a3ce = _0x4222af;
      }
      return _0x40a3ce;
    };
    var panurl = _in_data;
    var hf_panurl = '';
    const keyMP = 0x100000;
    const panurl_len = panurl['length'];
    for (var i = 0x0; i < panurl_len; i += 0x2) {
      var mn = parseInt(panurl[i] + panurl[i + 0x1], 0x10);
      mn = (mn + keyMP - (panurl_len / 0x2 - 0x1 - i / 0x2)) % 0x100;
      hf_panurl = String[_0x2c0f('0x0', '1JYE')](mn) + hf_panurl;
    }
    _in_data = hf_panurl;
    (function (_0x5be96b, _0x58d96a, _0x2d2c35) {
      var _0x13ecbc = {
        luTaD: function _0x478551(_0x58d2f3, _0x3c17c5) {
          return _0x58d2f3 !== _0x3c17c5;
        },
        dkPfD: function _0x52a07f(_0x5999d5, _0x5de375) {
          return _0x5999d5 === _0x5de375;
        },
        NJDNu: function _0x386503(_0x39f385, _0x251b7b) {
          return _0x39f385 + _0x251b7b;
        },
        mNqKE: '版本号，js会定期弹窗，还请支持我们的工作',
        GllzR: '删除版本号，js会定期弹窗',
      };
      _0x2d2c35 = 'al';
      try {
        _0x2d2c35 += _0x2c0f('0x1', 's^Zc');
        _0x58d96a = encode_version;
        if (
          !(
            _0x13ecbc[_0x2c0f('0x2', '(fbB')](
              typeof _0x58d96a,
              _0x2c0f('0x3', '*OI!'),
            ) && _0x13ecbc[_0x2c0f('0x4', '8iw%')](_0x58d96a, 'jsjiami.com.v5')
          )
        ) {
          _0x5be96b[_0x2d2c35](
            _0x13ecbc[_0x2c0f('0x5', '(fbB')]('删除', _0x13ecbc['mNqKE']),
          );
        }
      } catch (_0x57623d) {
        _0x5be96b[_0x2d2c35](_0x13ecbc[_0x2c0f('0x6', '126j')]);
      }
    })(window);
    encode_version = 'jsjiami.com.v5';
  }
  return _in_data;
}

function GetVUrl(url) {
  var vurl = GetUrlQuery(url, 'url');
  if (vurl) {
    var dpvt = GetDPVT(url);
    var xup = '&';
    if (vurl.indexOf('?') < 0) {
      xup = '?';
    }
    vurl += xup + 'dpvt=' + dpvt;
  }
  return vurl;
}

function GetUrlQuery(in_url, in_query) {
  var reg = new RegExp('[?&]+' + in_query + '=([^&]*)');
  var re_resl = in_url.match(reg);
  if (re_resl) {
    var qVal = re_resl[1];
    if (qVal) {
      qVal = qVal.replace(/[+]{1}/g, ' ');
      qVal = decodeURIComponent(qVal);
      return qVal;
    }
  }
  return null;
}

function GetDPVT(url) {
  var dpvt = Math.round(new Date().getTime() / 1000 / 1800);
  //
  var r_host = /^http(s)?:\/\/(.*?)\//.exec(url)[2];
  debugger;
  var host_t = '';
  for (var i = r_host.length - 1; i >= 0; i--) {
    host_t += '' + r_host[i].charCodeAt();
  }
  //
  return dpvt + host_t;
}

export {Vp};
