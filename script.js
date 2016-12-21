var ReplaceIt = function(MTag) {
	
  JSON.copy = function(json){
    return JSON.parse(JSON.stringify(json));
  }

  var self = this; // Scope of public function ReplaceIt
  var _Prototype; // Prototype object changed  
  var _Type = MTag.tagName; // Prototype object changed  

  var _ParseTo = function(json){
    if(json){
      json = json.replace(/\s{2,}/g, ' ')
                 .replace(/\n/g, ' ')
                 .replace(/\'/g, '"')
                 .replace(/[^ {}]+\:/g, function(match){
                    match = match.replace(/\"/g, '').replace(/\'/g, "'");
                    return '"'+match.substring(0, match.length-1)+'"'+":"
                 });
      return JSON.parse(json);
    }else{
      return undefined;
    }
  }

  var _TriggerAll = function (array) {
    array.forEach(function(callback, index) {
      callback();
    });
  }

  var _CheckSupport = function(elem, property){
      function _FirstUpper(srt){
        return srt.charAt(0).toUpperCase() + str.string(1, str.length);
      }
      if(elem.style[property] != undefined || elem.style['webkit'+_FirstUpper(property)] != undefined || elem.style['moz'+_FirstUpper(property)] != undefined){
        return true;
      }else{
        return false;
      }
  }

  var _ = function(element){
    return {
      addClass: function(newClass){
        var classes = element.className.split(' ');
        if(Array.isArray(classes)){
          if(classes.indexOf(newClass) < 0){
            classes.push(newClass);
            element.className = classes.filter(function(curClass) {
              return (curClass != "" && curClass != " ");
            }).join(' ');  
          }
        }
      },
      removeClass: function(oldClass){
        var classes = element.className.split(' ');
        var index = classes.indexOf(oldClass);
        if(index > -1){
          classes.splice(index, 1);
        }
        element.className = classes.join(' ');
      },
      attrs: function(){
        if(arguments.length > 1){
          var attr = arguments[0];
          var value = arguments[1];
          element.setAttribute(attr, value);
        }else{
          if(typeof arguments[0] == "string"){
            return element.getAttribute(arguments[0]);
          }else{
            var attrs = arguments[0];
            for(attr in attrs){
              element.setAttribute(attr, attrs[attr]);
            }
          }
        }
      },
      append: function(){
        if(arguments[0] instanceof HTMLElement || arguments[0] instanceof Element){
          element.appendChild(arguments[0]);
        }else if(Array.isArray(arguments[0])){
          var newChildren = arguments[0];
          newChildren.forEach(function(newChild){
            element.appendChild(newChild);
          })
        }else if(typeof arguments[0] == "string"){
          var newChild = document.createElement(arguments[0]);
          element.appendChild(newChild);
          return arguments[0];
        }
      },
      replaceWith: function(newElement){
        element.parentNode.replaceChild(newElement, element);
      },
      css: function(){
        if(arguments.length > 1 && typeof arguments[0] == 'string'){
          element.style[arguments[0]] = arguments[1];
        }else if(arguments[0] instanceof Object){
          var styles = arguments[0];
          for(style in styles){
            element.style[style] = styles[style];
          };
        };
      },
      html: function(html){
        element.innerHTML = html;
      },
      text: function(text){
        element.textContent = element.innerText = text;
      }
    };
  };

  
  var _Functions = {};
  var _Events = {};

  var props = {};

  if (_Type == "M-PROGRESSLINE") {
    var progressLine = MTag;
    _Functions._Properting = function(newProps) {
      if (!newProps) {
        newProps = {
          "steps": parseFloat(_(progressLine).attrs("steps").toString() || props["steps"] || 3),
          "current": parseFloat(_(progressLine).attrs("current").toString() || props["current"] || 1),
          "done": parseFloat(_(progressLine).attrs("done").toString() || props["done"] || '0'),
          "color": _(progressLine).attrs("color").toString() || props["color"] || "#3c948b"
        };
      };

      props = {
        steps: (newProps['steps'] || props["steps"]),
        current: (newProps['current'] || props["current"]) > (newProps['steps'] || props["steps"]) ? (newProps['steps'] || props["steps"]) : (newProps['current'] || props["current"]),
        done: (newProps['done'] || props["done"]) > (newProps['steps'] || props["steps"]) ? (newProps['steps'] || props["steps"]) : (newProps['done'] || props["done"]),
        color: (newProps['color'] || props["color"])
      };
    }

    var docFragment, // Document Fragment which will content all the element
      PL_Container, // Div as container of the widget
      PL_Line, // Div as line that include progress
      PL_Line_Done, // Div with current progress 
      PL_Markers; // steps markers 1, 2, 3...

    _Functions._Creating = function() {
      docFragment = document.createDocumentFragment();
      PL_Container = document.createElement('div');
      PL_Line = document.createElement('div');
      PL_Line_Done = document.createElement('div');
      PL_Markers = document.createElement('div');
      for (var i = 1; i <= props.steps; i++) {
        _(PL_Markers).append('div');
      };
    };

    _Functions._Setting = function() {
      [].forEach.call(progressLine.attributes, function(attribute) {
        _(PL_Container).attrs(attribute.name, attribute.value);
      });
      _(PL_Container).addClass("progressLine-container");
      _(PL_Container).attrs("role", "progressLine");
      _(PL_Line).addClass("progressLine-line");
      _(PL_Line_Done).addClass("progressLine-line-done");
      _(PL_Markers).addClass("progressLine-markers");
    }

    _Functions._Styling = function() {

      _(PL_Line_Done).css({
      	width: "calc(" + Math.floor((100 / (props.steps - 1)) * (props.done - 1)) + "% + 5px)",
        background: props.color
      });

      for (var i = 0; i < PL_Markers.children.length; i++) {
        var marker = PL_Markers.children[i];
        _(marker).addClass("progressLine-marker");
        _(marker).attrs('id', "marker-" + (i + 1));
        if ((i + 1) <= props.done) {
          _(marker).html("&#10003;");
          _(marker).addClass("passed");
        } else {
          _(marker).html(i + 1);
        }
        if ((i + 1) <= props.current) {
          _(marker).css('background', props.color);
          _(marker).addClass("passed");
        } else {
          _(marker).removeClass("passed");
          _(marker).css('background', '#ccc');
        }
      };
    };

    _Functions._Appending = function() {
      _(PL_Line).append(PL_Line_Done);
      _(PL_Container).append([PL_Line, PL_Markers]);
      _(docFragment).append(PL_Container);
      _(progressLine).replaceWith(docFragment);
    };
    
    _Prototype = {
      update: function(newProps) {
        _Functions._Properting(newProps);
        _Functions._Styling();
      },
      prop: {
        get steps(){
          return props["steps"];
        },
        get current(){
          return props["current"];
        },
        get done(){
          return props["done"];
        },
        get color(){
          return props["color"];
        } 
      },
      get type(){
        return _Type.toLowerCase();
      }
    };

  }else if(_Type == "M-PROGRESSBAR"){
    var progressBar = MTag;

    var val_Percent;

    _Functions._Properting = function(newProps) {
      var standartStyle = {
        value: {
          "striped": true,
          "background-color": "cornflowerblue",
          "border-radius": "5px",
          "box-shadow": "0 0 2px 0px rgba(0,0,0,0.4)"
        },
        bar: {
          "background": "whitesmoke",
          "border-radius": "5px",
          "box-shadow": "inset 0 0 5px 0px rgba(0,0,0,0.1)"
        }
      };
      if (!newProps) {
        newProps = {
          "step": parseFloat(_(progressBar).attrs("step") || props["step"] || 1),
          "max": parseFloat(_(progressBar).attrs("max") || props["max"] || 100),
          "min": parseFloat(_(progressBar).attrs("min") || props["min"] || '0'),
          "showText": _(progressBar).attrs("show-text") || props["showText"] || 'percent',
          "mStyle": props["mStyle"] || standartStyle
        };

        var style = _ParseTo(_(progressBar).attrs("m-style"));
        if(style != undefined){
          for(mStyleEl in newProps['mStyle']){
            if(style[mStyleEl] != undefined){
              for(mStyle in newProps['mStyle'][mStyleEl]){
                if(style[mStyleEl][mStyle] != undefined){
                  newProps['mStyle'][mStyleEl][mStyle] = style[mStyleEl][mStyle];
                }
              };
            }
          };
        }

        newProps["value"] = parseFloat(_(progressBar).attrs("value") || props["value"] || newProps['max']/2);
      };

      props = {
        "step": (newProps['step'] || props["step"]),
        "max": (newProps['max'] == undefined ? props["max"] : newProps['max']),
        "min": (newProps['min'] || props["min"]),
        "showText": (newProps['showText'] || props["showText"]),
        "mStyle": (newProps['mStyle'] || props["mStyle"])
      };

      if(newProps['value'] == undefined){
        props['value'] = props["value"];
      }else if(newProps['value'] > props['max']){
        props['value'] = props["max"];
      }else{
        props['value'] = newProps['value'];
      }

      val_Percent = (props.value/props.max)*100;

    }

    var docFragment,
        PB_Container,
        PB_Value_Box,
        PB_Value,
        PB_Text_Box,
        PB_Text;

    _Functions._Creating = function() {
      docFragment = document.createDocumentFragment(); // Creating DocumentFragment that will replace the MTag
      
      /* Creating element of Widget */
      PB_Container = document.createElement('div'); 
      PB_Value_Box = document.createElement('div');
      PB_Value = document.createElement('div');
      PB_Text_Box = document.createElement('div');
      PB_Text = document.createElement('span');
    };

    _Functions._Setting = function() {
      [].forEach.call(progressBar.attributes, function(attribute) {
        _(PB_Container).attrs(attribute.name, attribute.value);
      });
      _(PB_Container).addClass("progressBar-container");
      _(PB_Container).attrs("role", "progressBar");
      _(PB_Value_Box).addClass("progressBar-value-box");
      _(PB_Value).addClass("progressBar-value");
      _(PB_Text_Box).addClass("progressBar-text-box");
      _(PB_Text).addClass("progressBar-text");
    }

    _Functions._Styling = function() {

      var valueStyle = JSON.copy(props.mStyle.value);

      if(valueStyle.striped){
        _(PB_Value).addClass('striped');
      }

      _(PB_Value).css(valueStyle);

      _(PB_Value).css({
        width: val_Percent + "%"
      });
      _(PB_Container).css(props.mStyle.bar);

      if(props.showText == "percent"){
        _(PB_Text).html(val_Percent + "%");
      }else if(props.showText == "number"){
        _(PB_Text).html(props.value + "/" + props.max);
      }

    };

    _Functions._Appending = function() {
      _(PB_Text_Box).append(PB_Text);
      _(PB_Value).append(PB_Text_Box);
      _(PB_Value_Box).append(PB_Value);
      _(PB_Container).append(PB_Value_Box);
      _(docFragment).append(PB_Container);
      _(progressBar).replaceWith(docFragment);
    };

    _Events = {
      loading: [],
      loaded: [],
    }

    _Prototype = {
      update: function(_newProps) {
        _Functions._Properting(_newProps);
        _Functions._Styling();

        if(_newProps['value']){
          if(_newProps['value'] == props["value"]){
            _TriggerAll(_Events.loading);

            if(props["value"] >= props["max"]){
              _TriggerAll(_Events.loaded);
              _(PB_Text).addClass('center');
            }
          } 
        }

        return self;
      },
      on: function(event, callback){
        if(_Events[event] != undefined){
          _Events[event].push(callback);
        }
        return self;
      },
      prop: {
        get value(){
          return props["value"];
        },
        get max(){
          return props["max"];
        },
        get min(){
          return props["min"];
        },
        get step(){
          return props["step"];
        } ,
        get mStyle(){
          return props["mStyle"];
        } 
      },
      get type(){
        return _Type;
      }
    };
  };

  _Prototype.do = function(){
    _Functions._Properting();
    _Functions._Creating();
    _Functions._Setting();
    _Functions._Styling();
    _Functions._Appending();
    return self;
  }
    
  for(property in _Prototype){
  	self[property] = _Prototype[property];
  };

};