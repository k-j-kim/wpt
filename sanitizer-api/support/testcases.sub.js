const testcases = [
  {config_input: {}, config_value: {}, value: "test", result: "test", message: "string"},
  {config_input: {}, config_value: {}, value: "<b>bla</b>", result: "<b>bla</b>", message: "html fragment"},
  {config_input: {}, config_value: {}, value: "<a<embla", result: "", message: "broken html"},
  {config_input: {}, config_value: {}, value: {}, result: "[object Object]", message: "empty object"},
  {config_input: {}, config_value: {}, value: 1, result: "1", message: "number"},
  {config_input: {}, config_value: {}, value: 000, result: "0", message: "zeros"},
  {config_input: {}, config_value: {}, value: 1+2, result: "3", message: "arithmetic"},
  {config_input: {}, config_value: {}, value: "", result: "", message: "empty string"},
  {config_input: {}, config_value: {}, value: undefined, result: "undefined", message: "undefined"},
  {config_input: {}, config_value: {}, value: null, result: "null", message: "null"},
  {config_input: {}, config_value: {}, value: "<html><head></head><body>test</body></html>", result: "test", message: "document"},
  {config_input: {}, config_value: {}, value: "<div>test", result: "<div>test</div>", message: "html without close tag"},
  {config_input: {}, config_value: {}, value: "<script>alert('i am a test')<\/script>", result: "", message: "scripts"},
  {config_input: {}, config_value: {}, value: "<p onclick='a= 123'>Click.</p>", result: "<p>Click.</p>", message: "onclick scripts"},
  {config_input: {dropElements: []}, config_value: {dropElements:[]}, value: "test", result: "test", message: "empty dropElements list"},
  {config_input: {dropElements: ["div"]}, config_value: {dropElements:["DIV"]}, value: "<div>test</div><c>bla", result: "<c>bla</c>", message: "test html without close tag with dropElements list ['div']"},
  {config_input: {dropElements: ["script"]}, config_value: {dropElements:["SCRIPT"]}, value: "<script>alert('i am a test')<\/script>", result: "", message: "test script with [\"script\"] as dropElements list"},
  {config_input: {dropElements: ["test", "i"]}, config_value: {dropElements:["TEST","I"]}, value: "<div>balabala<i>test</i></div><test>t</test>", result: "<div>balabala</div>", message: "dropElements list [\"test\", \"i\"]}"},
  {config_input: {dropElements: ["I", "AM"]}, config_value: {dropElements:["I", "AM"]}, value: "<div>balabala<am>test</am></div>", result: "<div>balabala</div>", message: "dropElements list [\"I\", \"AM\"]}"},
  {config_input: {dropElements: ["am", "p"]}, config_value: {dropElements:["AM","P"]}, value: "<div>balabala<i>i</i><p>t</p><test>a</test></div>", result: "<div>balabala<i>i</i><test>a</test></div>", message: "dropElements list [\"am\", \"p\"]}"},
  {config_input: {dropElements: [123, [], "test", "i"]}, config_value: {dropElements:["123","","TEST","I"]}, value: "<div>balabala<i>test</i></div><test>t</test>", result: "<div>balabala</div>", message: "dropElements list with invalid values}"},
  {config_input: {blockElements: [123, [], "test", "i"]}, config_value: {blockElements:["123","","TEST","I"]}, value: "<div>balabala<i>test</i></div><test>t</test>", result: "<div>balabala<p>test</p></div><p>t</p>", message: "blockElements list with invalid values}"},
  {config_input: {allowElements: [123, [], "test", "i"]}, config_value: {allowElements: ["123","","TEST","I"]}, value: "<div>balabala<i>test</i></div><test>t</test>", result: "<div>balabala<i>test</i></div><test>t</test>", message: "allowElements lists with invalid values}"},
  {config_input: {dropAttributes: ["onclick"]}, config_value: {dropAttributes: ["onclick"]}, value: "<p onclick='a= 123'>Click.</p>", result: "<p>Click.</p>", message: "dropAttributes list [\"onclick\"] with onclick scripts"},
  {config_input: {dropAttributes: []}, config_value: {dropAttributes: []}, value: "<p onclick='a= 123'>Click.</p>", result: "<p onclick=\"a= 123\">Click.</p>", message: "empty dropAttributes list with onclick scripts"},
  {config_input: {dropAttributes: ["id"]}, config_value: {dropAttributes: ["id"]}, value: "<p onclick='a= 123'>Click.</p>", result: "<p onclick=\"a= 123\">Click.</p>", message: "dropAttributes list [\"id\"] with onclick scripts"},
  {config_input: {dropAttributes: ["ONCLICK"]}, config_value: {dropAttributes: ["onclick"]}, value: "<p onclick='a= 123'>Click.</p>", result: "<p>Click.</p>", message: "dropAttributes list [\"ONCLICK\"] with onclick scripts"},
  {config_input: {dropAttributes: ["data-attribute-with-dashes"]}, config_value: {dropAttributes: ["data-attribute-with-dashes"]}, value: "<p id='p' data-attribute-with-dashes='123'>Click.</p><script>document.getElementById('p').dataset.attributeWithDashes=123;</script>", result: "<p id=\"p\">Click.</p><script></script>", message: "dropAttributes list [\"data-attribute-with-dashes\"] with dom dataset js access."},
  {config_input: {blockAttributes: ["onclick"]}, config_value: {blockAttributes: ["onclick"]}, value: "<p onclick='a= 123'>Click.</p>", result: "<p>Click.</p>", message: "blockAttributes list [\"onclick\"] with onclick scripts"},
  {config_input: {blockpAttributes: []}, config_value: {blockAttributes: []}, value: "<p onclick='a= 123'>Click.</p>", result: "<p onclick=\"a= 123\">Click.</p>", message: "empty blockAttributes list with onclick scripts"},
  {config_input: {blockAttributes: ["id"]}, config_value: {blockAttributes: ["id"]}, value: "<p onclick='a= 123'>Click.</p>", result: "<p onclick=\"a= 123\">Click.</p>", message: "blockAttributes list [\"id\"] with onclick scripts"},
  {config_input: {blockAttributes: ["ONCLICK"]}, config_value: {blockAttributes: ["onclick"]}, value: "<p onclick='a= 123'>Click.</p>", result: "<p>Click.</p>", message: "blockAttributes list [\"ONCLICK\"] with onclick scripts"},
  {config_input: {blockAttributes: ["data-attribute-with-dashes"]}, config_value: {blockAttributes: ["data-attribute-with-dashes"]}, value: "<p id='p' data-attribute-with-dashes='123'>Click.</p><script>document.getElementById('p').dataset.attributeWithDashes=123;</script>", result: "<p id=\"p\">Click.</p><script></script>", message: "blockAttributes list [\"data-attribute-with-dashes\"] with dom dataset js access."},
  {config_input: {allowAttributes: ["onclick"]}, config_value: {allowAttributes: ["onclick"]}, value: "<p onclick='a= 123'>Click.</p>", result: "<p onclick='a= 123'>Click.</p>", message: "allowAttributes list [\"onclick\"] with onclick scripts"},
];
