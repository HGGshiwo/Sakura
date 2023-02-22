import {__getplay_pck } from './yx_runtimelib';
import {__getplay_pck2} from './yx_dett'
export {__getset_play};

const document = {'cookie':''};
////////////////////////////

function __qpic_chkvurl_converting(_in_vurl) {
  const vurl = decodeURIComponent(_in_vurl);
  const match_resl = vurl.match(
    /^http.+\.f20\.mp4\?ptype=http\?w5=0&h5=0&state=1$/,
  );
  if (match_resl) {
    return true;
  }
  //
  return false;
}

////////////////////////////

function __get_vlt_lr(_in_ex) {
  const re_resl = _in_ex.match(/^#ex=.+#vlt=L(\d+)R(\d+)/);
  var vlt_lr = [0, 0];
  if (re_resl) {
    vlt_lr = [__key_enc_vlt(re_resl[1]), __key_enc_vlt(re_resl[2])];
  }
  return vlt_lr;
}

function ___make_url_vlt_param(_in_url, vlt_lr) {
  var xxx = _in_url.indexOf('?') > 0 ? '&' : '?';
  _in_url += xxx + 'vlt_l=' + vlt_lr[0] + '&vlt_r=' + vlt_lr[1];
  return _in_url;
}

//
function dettchk() {
  return true;
}
/////////////////

/////////////////////////////

function __ipchk_getplay(_in_data) {
  const match_resl = _in_data.match(/^ipchk:(.+)/);
  if (match_resl) {
    return true;
  }
  //
  return false;
}

////////////////////////////

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

function __yx_purl_rev(_href, _purl) {
  //
  if (_href.match(/^http:\/\//)) {
    _purl = _purl.replace(
      'https://bos.nj.bpc.baidu.com/tieba-smallvideo/',
      'http://boscdn.bpc.baidu.com/tieba-smallvideo/',
    );
  }
  return _purl;
}

var GETSET_PLAY_CNT = 0;
function __getset_play(_url, callback, cb_cnt) {
  debugger;
  //
  function cb_getplay_url() {
    //
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
  const _getplay_url = cb_getplay_url();
  if (dettchk()) {
    fetch(_getplay_url, {
      headers: {
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh,zh-TW;q=0.9,zh-CN;q=0.8',
        cookie: document['cookie'],
        referer: _url,
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      },
    })
      .then(response => {console.log(response); return response.text()})
      .then(function (_in_data) {
        
        console.log(_in_data)
        debugger;
        if ('err:timeout' == _in_data) {
          if (cb_cnt > 0) {
            __getplay_pck(document);
            // __getplay_pck2(document);
            return __getset_play(_url, callback, cb_cnt - 1);
          } else {
            callback(false, 'err:timeout');
            return false;
          }
        }

        //
        if (__ipchk_getplay(_in_data)) {
          callback(false, _in_data);
          return false;
        }

        //
        var _json_obj = JSON.parse(_in_data);
        var _purl = __getplay_rev_data(_json_obj['purl']);
        var _purl_mp4 = _json_obj['purl_mp4'];
        var _vurl = __getplay_rev_data(_json_obj['vurl']);
        var _vurl_bak = _json_obj['vurl_bak'];
        var _play_ex = _json_obj['ex'];
        var _play_inv = _json_obj['inv'];
        var vlt_lr = __get_vlt_lr(_play_ex);

        //
        if (__qpic_chkvurl_converting(_vurl)) {
          callback(false, '视频转码中, 请稍后再试');
          return false;
        }

        //
        var _playid = _json_obj['playid'];
        var _vurlp2_getplay_url = '';
        if (true || _playid.indexOf('<play>PC-') >= 0) {
          _vurlp2_getplay_url =
            '&getplay_url=' + encodeURIComponent(_getplay_url);
        }

        //
        _purl = __yx_purl_rev(_url, _purl);

        //
        if (!_vurl || '1' == _play_inv) {
          if (++GETSET_PLAY_CNT < 4) {
            setTimeout(function () {
              return __getset_play(_url, callback, cb_cnt);
            }, 4000);
            callback(false, '');
            return false;
          }
        }

        //
        let src = ___make_url_vlt_param(
          _purl + _vurl + _vurlp2_getplay_url,
          vlt_lr,
        );
        callback(true, src);
        //
        return true;
      })
      .catch(err => console.log(err));
  }

  //
  return false;
}
