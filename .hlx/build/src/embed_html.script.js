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
    $t = $.dom.create("div",false,false);
    const var_attrValue0 = ("embed embed-internal embed-internal-") + (content["meta"]["basename"]) + (" embed-internal-") + (content["meta"]["dirname"]);
    if (!$.col.empty(var_attrValue0)) {
      $.dom.attr($t, 'class', var_attrValue0, 'attribute');
    }
    $n = $.dom.push($n,$t);
    $.dom.text($n,"\r\n");
    const var_1 = content["document"]["body"];
    $.dom.append($n, var_1);
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
//# sourceMappingURL=embed_html.script.js.map
