let script = document.createElement('script');
script.type='text/javascript';

if(window.location.host.indexOf('hlx.page') >= 0 || window.location.host.indexOf('hlx.live') >= 0 || window.location.host.indexOf('localhost') >= 0 || window.location.host.indexOf('stage.adobe') >= 0){
  script.src = 'https://auth-stg1.services.adobe.com/imslib/imslib.js';
} else {
  script.src = 'https://auth.services.adobe.com/imslib/imslib.min.js'
}

document.getElementsByTagName('head')[0].appendChild(script);