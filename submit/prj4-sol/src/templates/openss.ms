<!DOCTYPE html>
<html>
  <head>
    <title>CS 444/544 Spreadsheet Selection</title>
    <link rel="stylesheet" href="/style.css" type="text/css"/>
  </head>

  <body>
    <h1> CS 444/544 Spreadsheet Selection</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
     <p>Open Spreadsheet Name</p>
    <form id="openssform" action="/" method="POST">
    {{#fields}}
      <label for="ssName">
      <span class="label">
        {{#isRequired}}* {{/isRequired}}{{friendlyName}}:
      </span>
     
      <input id="ssName" name="ssName"  value="" />
      </label>
      <br/>
      {{#errorMessage}}
        <span class="error" id="ssNameError">{{errorMessage}}</span><br/>
       {{/errorMessage}}
    {{/fields}}
     <!-- <input name="{{name}}" type="text" value="{{value}}" id="{{name}}"/>-->
      <input name="open"type="submit" value="Open" class="control" onClick="return getDynamicAction();" />
    </form>

    <script>
      function getDynamicAction(){
        document.getElementById("openssform").action = "{{{base}}}/ss/"+document.getElementById("ssName").value;
      }
    </script>

{{#openss}}
<p class="openss">{{msg}}</p>
{{/openss}}
</body>
</html>
