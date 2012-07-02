/**
 * MathQuill Plugin for TinyMCE editor
 *
 * @author Roché Compaan
 * @copyright Copyright © 2012 Roché Compaan
 *
 */

(function() {
    tinymce.PluginManager.requireLangPack('mathquill');

    tinymce.create('tinymce.plugins.mathquill', {
        init : function(ed, url) {

            var t = this;

            ed.onInit.add(function(ed) {
                doc = ed.getDoc();

                link = doc.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = 'tinymce/jscripts/tiny_mce/plugins/mathquill/css/mathquill.css';

                head = doc.getElementsByTagName('head')[0];
                head.appendChild(link);

                script = doc.createElement('script');
                script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.js';
                script.type = 'text/javascript';

                head = doc.getElementsByTagName('head')[0];
                head.appendChild(script);

                setTimeout(function() {
                    script = doc.createElement('script');
                    script.src = 'tinymce/jscripts/tiny_mce/plugins/mathquill/js/mathquill.js';
                    script.type = 'text/javascript';

                    head = doc.getElementsByTagName('head')[0];
                    head.appendChild(script);
                }, 10);
            });

            // Add a node change handler, selects the button in the UI
            // when MathQuill span is selected
            ed.onNodeChange.add(function(ed, cm, n) {
                selected = ed.dom.select('span.mceItemVisualAid');
                for (var i=0; i < selected.length; i++) {
                    math = selected[i];
                    ed.dom.removeClass(math, 'mceItemVisualAid');
                };
                var mathspan = ed.dom.getParent(n, 'span.mathquill-rendered-math');
                cm.setActive('mathquill', mathspan != null);
                if (mathspan) {
                    ed.dom.addClass(mathspan, 'mceItemVisualAid')
                }
            });

            ed.onKeyPress.add(function(ed, e) {
                // delete math span when delete or backspace key is pressed
                if (e.keyCode == 46 || e.keyCode == 8) {
                    node = ed.selection.getNode();
                    var mathspan = ed.dom.getParent(node, 'span.mathquill-rendered-math');
                    if (mathspan) {
                        mathspan.parentNode.removeChild(mathspan);
                    }
                }

                // place the caret after the math span when pressing
                // enter, spacebar, down or right arrow
                if (e.keyCode == 13 || e.keyCode == 0 ||
                    e.keyCode == 37 || e.keyCode == 38 ||
                    e.keyCode == 39 || e.keyCode == 40) {
                    var rng, mathspan, dom = ed.dom;

                    rng = ed.selection.getRng();
                    mathspan = dom.getParent(rng.startContainer, 'span.mathquill-rendered-math');

                    if (mathspan) {
                        rng = dom.createRng();

                        if (e.keyCode == 37 || e.keyCode == 38) {
                            rng.setStartBefore(mathspan);
                            rng.setEndBefore(mathspan);
                        } else {
                            rng.setStartAfter(mathspan);
                            rng.setEndAfter(mathspan);
                        }
                        ed.selection.setRng(rng);
                    }
                }
            });


            // Fix caret position
            ed.onInit.add(function(ed) {
                if (!tinymce.isIE) {
                    function fixCaretPos() {
                        var last = ed.getBody().lastChild;
                        if (last && last.nodeName == 'SPAN' && last.className =='mathquill-rendered-math') {
                            br = ed.dom.create('br', {'mce_bogus' : '1'});
                            ed.getBody().appendChild(br);
                        }
                    };
                    fixCaretPos();
                };
                ed.onKeyUp.add(fixCaretPos);
                ed.onSetContent.add(fixCaretPos);
                ed.onVisualAid.add(fixCaretPos);
            });

            ed.addCommand('mceInsertMath', function(val) {
                selected = ed.selection.getNode();
                var mathspan = ed.dom.getParent(
                    selected, 'span.mathquill-rendered-math');
                if (mathspan) {
                    mathspan.innerHTML = val;
                } else {
                    mathspan = ed.dom.create(
                        'span', {'class': 'mathquill-rendered-math'});
                    mathspan.innerHTML = val;
                    selected.appendChild(mathspan);
                }
            });

            ed.addCommand('mceMathquillPopup', function() {
                var latex = '';
                var el = ed.selection.getNode();
                var mathspan = ed.dom.getParent(el, 'span.mathquill-rendered-math');
                if (mathspan) {
                    for (var i=0; i<mathspan.children.length; i++) {
                        var n = mathspan.children[i];
                        if (n.className == 'selectable') {
                            latexsource = n.innerHTML;
                            latex = latexsource.slice(1,-1);
                        }
                    }
                }

                ed.windowManager.open({
                    file : url + '/popup.html',
                    width : 630,
                    height : 390,
                    inline : 1
                }, {
                    plugin_url : url, // Plugin absolute URL
                    latex: latex,
                });
                
            });

            ed.addButton('mathquill', {
                title : 'mathquill.desc',
                cmd : 'mceMathquillPopup',
                image : url + '/img/ed_mathformula2.gif'
            });

        },

        getInfo : function() {
            return {
                longname : 'MathQuill Plugin',
                author : 'Roché Compaan',
                authorurl : 'http://github.com/rochecompaan',
                infourl : '',
                version : "1.0"
            };
        },

    });

    // Register plugin
    tinymce.PluginManager.add('mathquill', tinymce.plugins.mathquill);
})();
