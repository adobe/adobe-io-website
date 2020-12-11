/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable */
const { Runtime } = require('@adobe/htlengine');

function run($) {


  return $.run(function* () {

  const global = $.globals;
  let content = $.globals["content"];
  let request = $.globals["request"];
  let context = $.globals["context"];
  let payload = $.globals["payload"];
    let $t, $n = $.dom.start();
    $n = $.dom.doctype($n,'html');
    $.dom.text($n,"\r\n");
    $t = $.dom.create("html",false,false);
    const var_attrMap0 = content["document"]["documentElement"]["attributesMap"];
    const var_ignoredAttributes1 = {};
    for (const var_attrIndex4 of $.col.keys(var_attrMap0)) {
      const var_attrName2 = $.col.get(var_attrMap0, var_attrIndex4);
      const var_attrNameEscaped3 = yield $.xss(var_attrName2, "attributeName");
      if (var_attrNameEscaped3) {
        if (!var_ignoredAttributes1[var_attrName2]) {
          const var_attrContent5 = var_attrMap0[var_attrName2];
          if (!$.col.empty(var_attrContent5)) {
            $.dom.attr($t, var_attrNameEscaped3, var_attrContent5, 'attribute');
          }
        }
      }
    }
    $n = $.dom.push($n,$t);
    $.dom.text($n,"\r\n");
    $t = $.dom.create("head",false,false);
    $n = $.dom.push($n,$t);
    $.dom.text($n,"\r\n  ");
    $t = $.dom.create("title",false,false);
    $n = $.dom.push($n,$t);
    const var_6 = content["title"];
    $.dom.append($n, var_6);
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n  ");
    const hash = content["data"]["sourceHash"];
    if (hash) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'name', "x-source-hash", 'attribute');
      const var_attrValue7 = hash;
      if (!$.col.empty(var_attrValue7)) {
        $.dom.attr($t, 'content', var_attrValue7, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable8 = content["meta"]["url"];
    if (var_testVariable8) {
      $t = $.dom.create("link",true,true);
      $.dom.attr($t, 'rel', "canonical", 'attribute');
      const var_attrValue9 = content["meta"]["url"];
      if (!$.col.empty(var_attrValue9)) {
        $.dom.attr($t, 'href', var_attrValue9, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable10 = content["meta"]["description"];
    if (var_testVariable10) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'name', "description", 'attribute');
      const var_attrValue11 = content["meta"]["description"];
      if (!$.col.empty(var_attrValue11)) {
        $.dom.attr($t, 'content', var_attrValue11, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable12 = content["title"];
    if (var_testVariable12) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "og:title", 'attribute');
      const var_attrValue13 = content["title"];
      if (!$.col.empty(var_attrValue13)) {
        $.dom.attr($t, 'content', var_attrValue13, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable14 = content["meta"]["description"];
    if (var_testVariable14) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "og:description", 'attribute');
      const var_attrValue15 = content["meta"]["description"];
      if (!$.col.empty(var_attrValue15)) {
        $.dom.attr($t, 'content', var_attrValue15, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable16 = content["meta"]["url"];
    if (var_testVariable16) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "og:url", 'attribute');
      const var_attrValue17 = content["meta"]["url"];
      if (!$.col.empty(var_attrValue17)) {
        $.dom.attr($t, 'content', var_attrValue17, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable18 = content["meta"]["imageUrl"];
    if (var_testVariable18) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "og:image", 'attribute');
      const var_attrValue19 = content["meta"]["imageUrl"];
      if (!$.col.empty(var_attrValue19)) {
        $.dom.attr($t, 'content', var_attrValue19, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable20 = content["meta"]["imageUrl"];
    if (var_testVariable20) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "og:image:secure_url", 'attribute');
      const var_attrValue21 = content["meta"]["imageUrl"];
      if (!$.col.empty(var_attrValue21)) {
        $.dom.attr($t, 'content', var_attrValue21, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable22 = content["meta"]["modifiedTime"];
    if (var_testVariable22) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "og:updated_time", 'attribute');
      const var_attrValue23 = content["meta"]["modified_time"];
      if (!$.col.empty(var_attrValue23)) {
        $.dom.attr($t, 'content', var_attrValue23, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable26 = content["meta"]["tags"];
    if (var_testVariable26) {
      const var_collectionVar24 = $.col.init(content["meta"]["tags"]);
      const var_size25 = $.col.len(var_collectionVar24);
      if (var_size25) {
        for (const var_index27 of $.col.keys(var_collectionVar24)) {
          const tag = $.col.get(var_collectionVar24, var_index27);
          const taglist = $.listInfo(var_index27, var_size25);
          $.dom.text($n,"\r\n    ");
          $t = $.dom.create("meta",true,true);
          $.dom.attr($t, 'property', "article:tag", 'attribute');
          const var_attrValue28 = tag;
          if (!$.col.empty(var_attrValue28)) {
            $.dom.attr($t, 'content', var_attrValue28, 'attribute');
          }
          $n = $.dom.push($n,$t);
          $n = $.dom.pop($n);
          $.dom.text($n,"\r\n  ");
        }
      }
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable29 = content["meta"]["section"];
    if (var_testVariable29) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "article:section", 'attribute');
      const var_attrValue30 = section;
      if (!$.col.empty(var_attrValue30)) {
        $.dom.attr($t, 'content', var_attrValue30, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable31 = content["meta"]["published_time"];
    if (var_testVariable31) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "article:published_time", 'attribute');
      const var_attrValue32 = content["meta"]["published_time"];
      if (!$.col.empty(var_attrValue32)) {
        $.dom.attr($t, 'content', var_attrValue32, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable33 = content["meta"]["modified_time"];
    if (var_testVariable33) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'property', "article:modified_time", 'attribute');
      const var_attrValue34 = content["meta"]["modified_time"];
      if (!$.col.empty(var_attrValue34)) {
        $.dom.attr($t, 'content', var_attrValue34, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable35 = content["title"];
    if (var_testVariable35) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'name', "twitter:title", 'attribute');
      const var_attrValue36 = content["title"];
      if (!$.col.empty(var_attrValue36)) {
        $.dom.attr($t, 'content', var_attrValue36, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable37 = content["meta"]["description"];
    if (var_testVariable37) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'name', "twitter:description", 'attribute');
      const var_attrValue38 = content["meta"]["description"];
      if (!$.col.empty(var_attrValue38)) {
        $.dom.attr($t, 'content', var_attrValue38, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    const var_testVariable39 = content["meta"]["imageUrl"];
    if (var_testVariable39) {
      $t = $.dom.create("meta",true,true);
      $.dom.attr($t, 'name', "twitter:image", 'attribute');
      const var_attrValue40 = content["meta"]["imageUrl"];
      if (!$.col.empty(var_attrValue40)) {
        $.dom.attr($t, 'content', var_attrValue40, 'attribute');
      }
      $n = $.dom.push($n,$t);
      $n = $.dom.pop($n);
    }
    $.dom.text($n,"\r\n  ");
    $t = $.dom.create("esi:include",true,false);
    $.dom.attr($t, 'src', "/head.html", 'attribute');
    $.dom.attr($t, 'onerror', "continue", 'attribute');
    $n = $.dom.push($n,$t);
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n");
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n");
    $t = $.dom.create("body",false,false);
    const var_attrMap41 = content["document"]["body"]["attributesMap"];
    const var_ignoredAttributes42 = {};
    for (const var_attrIndex45 of $.col.keys(var_attrMap41)) {
      const var_attrName43 = $.col.get(var_attrMap41, var_attrIndex45);
      const var_attrNameEscaped44 = yield $.xss(var_attrName43, "attributeName");
      if (var_attrNameEscaped44) {
        if (!var_ignoredAttributes42[var_attrName43]) {
          const var_attrContent46 = var_attrMap41[var_attrName43];
          if (!$.col.empty(var_attrContent46)) {
            $.dom.attr($t, var_attrNameEscaped44, var_attrContent46, 'attribute');
          }
        }
      }
    }
    $n = $.dom.push($n,$t);
    $.dom.text($n,"\r\n  ");
    $.dom.rem($n,"  header ");
    $.dom.text($n,"\r\n  ");
    $t = $.dom.create("header",false,false);
    $n = $.dom.push($n,$t);
    $t = $.dom.create("esi:include",true,false);
    $.dom.attr($t, 'src', "/header.plain.html", 'attribute');
    $.dom.attr($t, 'onerror', "continue", 'attribute');
    $n = $.dom.push($n,$t);
    $n = $.dom.pop($n);
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n  ");
    $.dom.rem($n,"  main content ");
    $.dom.text($n,"\r\n  ");
    $t = $.dom.create("main",false,false);
    $n = $.dom.push($n,$t);
    const var_47 = content["document"]["body"];
    $.dom.append($n, var_47);
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n  ");
    $.dom.rem($n,"  footer ");
    $.dom.text($n,"\r\n  ");
    $t = $.dom.create("footer",false,false);
    $n = $.dom.push($n,$t);
    $t = $.dom.create("esi:include",true,false);
    $.dom.attr($t, 'src', "/footer.plain.html", 'attribute');
    $.dom.attr($t, 'onerror', "continue", 'attribute');
    $n = $.dom.push($n,$t);
    $n = $.dom.pop($n);
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n");
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n");
    $n = $.dom.pop($n);
    $.dom.text($n,"\r\n");
    return $.dom.end();

  });
}

module.exports.main = async function main(context) {
  const global = Object.assign({}, context);
  global.payload = new Proxy(global, {
      get: function(obj, prop) {
        process.emitWarning(`payload.${prop}: The use of the global 'payload' variable is deprecated in HTL. use 'context.${prop}' instead.`);
        return obj[prop];
      },
  });
  global.context = context;
  const runtime = new Runtime();
  runtime.setGlobal(global);
  if (context.content && context.content.document && context.content.document.implementation) {
    runtime.withDomFactory(new Runtime.VDOMFactory(context.content.document.implementation));
  }
  return await run(runtime);
};
//# sourceMappingURL=html.script.js.map
