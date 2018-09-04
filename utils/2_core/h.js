// COMMAND FORMAT:
// HTML_SELECTOR_INSTRUCTION_STRING|HTML_ATTRIBUTES_INSTRUCTIONS_STRING|ACSS_INSTRUCTIONS_STRING
// ACSS IS ALLOWED ONLY FOR BODYTAG ELEMENTS
// ELEMENT ID AND CLASSES ARE ALLOWED ONLY FOR BODYTAG ELEMENTS
// BOTH ATTRIBUTES AND ACSS INSTRUCTIONS MUST HAVE PARENS () - THIS IS DIFFERENT FROM YAHOO'S ACSS WHICH SUPPORTS HELPERS WITHOUT THEM
// EACH BODYTAG ELEMENT THAT DEFINES ACSS STYLES HAS GENERATED ACSS ID (AN CSS CLASS) TO SIMPLE REFERENCE THIS ELEMENT IN CSS STYLES
// OUR ACSS DOES NOT INTENTIONALLY SUPPORT <combinator> AND ALL PARTS LOCATED BEFORE IT - THIS MEANS YOU MUST WORK WITH DOM PLACEHOLDERS AND REDRAW WHOLE COMPONENT INSTEAD OF JUST ADDING STATE CLASS TO PARENT ELEMENT
// OUR ACSS IS STRICT ORDERED, SCORE ORDER IS COMPUTED LIKE: <@mediaQuery><:pseudoClass><::pseudoElement>
// OUR ACSS USES "left" and "right" instead of "start" and "end" - OUR ACSS HAS NO RTL FUNCTIONALITY SUPPORT
// OUR ACSS RULES MUST HAVE ALWAYS 1 ARGUMENT -> LEADS TO BETTER IDEA WHAT CSS WILL BE ACTUALLY GENERATED AS RESULT. STANDARD ACSS SUPPORTS MULTIPLE ARGUMENTS SEPARATED BY COMMAS
// SET HTML5 DATA BY PASSING OBJECT TO "a" ARGUMENT
function h(cmd, a, b) {
    /**
     * CONSTANTS
     */
    var REG_BASE_CMD_NO_SPACE_AT_START = /^\s/;
    var REG_BASE_CMD_NO_SPACE_AT_END = /\s$/;
    var REG_BASE_CMD_NO_SPACE_FOLLOWED_BY_COMMA = /\s,/;
    var REG_BASE_CMD_NO_MULTIPLE_SPACES = /\s{2,}/;
    var REG_BASE_CMD_NO_MULTIPLE_COMMAS = /,\s*,/;
    var REG_BASE_CMD_NO_MULTIPLE_PIPES = /\|{2,}/;
    var REG_BASE_CMD_NO_SPACES_AROUND_PIPE = /(?:\s+\|)|(?:\|\s+)/;
    var REG_BASE_CMD_NO_PIPE_AT_END = /\|$/;
    var REG_BASE_CMD_NO_SPACE_AFTER_OPEN_PAREN = /\(\s/;
    var REG_BASE_CMD_NO_SPACE_BEFORE_CLOSE_PAREN = /\s\)/;
    // -----------------------------------------------------------------------> REGEX PARTS ARE SORTED ALPHABETICALLY (IGNORE CASE)
    var REG_BASE_CMD_IS_METATAG = /^(Doc|Head|Link|Meta|Title)(?![A-Za-z0-9_-])/;
    var REG_BASE_CMD_IS_BODYTAG = /^(A|Abbr|Address|Area|Article|Aside|Audio|B|Base|Bdi|Bdo|BlockQuote|Body|Br|Button|Canvas|Caption|Cite|Code|Col|ColGroup|DataList|Dd|Del|Details|Dfn|Dialog|Div|Dl|Dt|Em|Embeded|FieldSet|FigCaption|Figure|Footer|Form|H1|H2|H3|H4|H5|H6|Header|Hr|I|Iframe|Img|Input|Ins|Kbd|Label|Legend|Li|Main|Map|Mark|Menu|MenuItem|Meter|Nav|NoScript|Object|Ol|OptGroup|Option|Output|P|Param|Picture|Pre|Progress|Q|Rp|Rt|Ruby|S|Samp|Script|Section|Select|Small|Source|Span|Strong|Sub|Summary|Sup|Svg|Table|Tbody|Td|Template|TextArea|TFoot|Th|THead|Time|Tr|Track|U|Ul|Var|Video|Wbr)(?![A-Za-z0-9_-])/; // https://www.w3schools.com/tags/default.asp

    var REG_BASE_CMD_SPLIT_BY_PIPE = /\|/;

    var REG_BASE_CMD_IS_PROBABLY_HTML_ATTRIBUTES_INSTRUCTIONS_STRING = /(?:^|\s)(?:Accept|Alt|Charset|Chckd|Content|Disabled|For|Href|HttpEquiv|Lang|Multiple|Name|Ph|Property|Rel|Ro|Slctd|Src|Type|Val)(?![A-Za-z0-9])/;
    var REG_BASE_CMD_IS_PROBABLY_ACSS_INSTUCTIONS_STRING = /(?:^|\s)(?:Ac|Ai|Anim|Animdel|Animdir|Animdur|Animfm|Animic|Animn|Animps|Animtf|Ap|As|B|BdA|Bda|BdB|Bdb|Bdbc|Bdbs|Bdbw|Bdc|Bdcl|BdL|Bdl|Bdlc|Bdls|Bdlw|BdR|Bdr|Bdrad|Bdradbl|Bdradbr|Bdradtl|Bdradtr|Bdrc|Bdrs|Bdrw|Bds|Bdsp|BdT|Bdt|Bdtc|Bdts|Bdtw|Bdw|BdX|Bdx|BdY|Bdy|BfcHack|Bfv|Bg|Bga|Bgc|Bgcp|Bgi|Bgo|Bgp|Bgpx|Bgpy|Bgr|Bgz|Blur|Brightness|Bxsh|Bxz|C|Cf|Cl|Cnt|Contrast|Cur|D|Dropshadow|Ell|Ff|Fil|Fill|Fl|Fs|Fv|Fw|Fx|Fxb|Fxd|Fxf|Fxg|Fxs|Fxw|Fz|Grayscale|H|Hidden|HueRotate|Hy|IbBox|Invert|Jc|L|Lh|LineClamp|Lisi|Lisp|List|Lts|M|Mah|Matrix|Matrix3d|Maw|Mb|Mih|Miw|Ml|Mr|Mt|Mx|My|O|Op|Opacity|Or|Ov|Ovs|Ovx|Ovy|P|Pb|Pe|Pl|Pos|Pr|Prs|Prso|Pt|Px|Py|R|Rotate|Rotate3d|RotateX|RotateY|RotateZ|Row|Rsz|Saturate|Scale|Scale3d|ScaleX|ScaleY|Sepia|Skew|SkewX|SkewY|Stk|Stklc|Stklj|Stkw|StretchedBox|T|Ta|Tal|Tbl|Td|Ti|Tov|Tr|Translate|Translate3d|TranslateX|TranslateY|TranslateZ|Tren|Trf|Trfo|Trfs|Trs|Trsde|Trsdu|Trsp|Trstf|Tsh|Tt|Us|V|Va|W|Whs|Whsc|Wob|Wow|Z|Zoom)(?![A-Za-z0-9])/; // LAST CLOSURE IS NEEDED, OTHERWISE Stkljaaaa WOULD MATCH

    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_SPACES = /\s+/g; // FOR EXAMPLE TO CHECK IF STRING CONTAINS SOMETHING MORE THAN ONLY SPACES
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_METATAG_CHAR = /[^\w]/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_BODYTAG_CHAR = /[^\w-_#.]/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_DOTS = /\.{2,}/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_HASHES = /#{2,}/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_DOT_AT_END = /\.$/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_AT_END = /#$/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_FOLLOWED_BY_DOT = /#\./;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_DOT_FOLLOWED_BY_HASH = /\.#/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_NAME_SEPARATOR_AT_BOUNDARY = /[#.][-_]|[-_]\.|[-_]$/;

    var REG_HTML_SELECTOR_INSTRUCTION_STRING_MATCH_COMPONENTS = /[-_A-Z][-_A-Za-z0-9]*|[.#][-_A-Za-z0-9]+/g;

    var REG_HTML_ATTRIBUTES_INSTRUCTIONS_STRING_NO_MISSING_SPACE_BETWEEN_INSTRUCTIONS = /\)(?![\s)]|$)/;
    var REG_HTML_ATTRIBUTES_INSTRUCTIONS_STRING_MATCH_INSTRUCTION_STRINGS = /\S*\(.*?\)/g;
    var REG_HTML_ATTRIBUTES_INSTRUCTION_STRING_MATCH_COMPONENTS = /([^\s(]+)\((.*)\)/;
    var REG_HTML_ATTRIBUTES_INSTRUCTION_VALUE_NO_UNALLOWED_CHAR = /[()]/;
    var REG_HTML_ATTRIBUTES_INSTRUCTION_VALUE_NO_MISSING_SPACE_AFTER_COMMA = /,\S/;

    var REG_ACSS_INSTRUCTIONS_STRING_NO_MISSING_SPACE_BETWEEN_INSTRUCTIONS = /\)\S*\(/;
    var REG_ACSS_INSTRUCTIONS_STRING_MATCH_INSTRUCTION_STRINGS = /\S*\(.*?\)\S*/g;
    // https://regex101.com/r/tIaCUX/20 - MATCH ACSS INSTRUCTION COMPONENTS - WITH COMBINATOR - TEST
    // https://regex101.com/r/D7wlXm/20 - MATCH ACSS INSTRUCTION COMPONENTS - WITH COMBINATOR
    var REG_ACSS_INSTRUCTION_STRING_MATCH_COMPONENTS = /^([^:_>+()!@]+)\(([^()]*)\)((?=!)!|)((?=:[^:_>+()!@])(?::[^:_>+()!@]+)+|)((?=::[^:_>+()!@])(?:::[^:_>+()!@]+)+|)((?=@[^:_>+()!@])@[^:_>+()!@]+|)$/;
    var REG_ACSS_INSTRUCTION_VALUE_NO_MISSING_SPACE_AFTER_COMMA = /,\S/;
    var REG_ACSS_INSTRUCTION_VALUE_NO_MISSING_SPACE_AFTER_COMMA_SKIP = /url\[(.*?)\]/g;
    var REG_ACSS_INSTRUCTION_VALUE_BRACKETS = [/\[/g, /\]/g];
    // https://regex101.com/r/Mcr8Np/17 - MATCH NEXT ACSS COLOR - TEST
    // https://regex101.com/r/dJsNNd/13 -  MATCH NEXT ACSS COLOR - JS
    var REG_ACSS_INSTRUCTION_VALUE_MATCH_NEXT_COLOR = /(^|\s|,)(?=#)(?:#([^.,\s]+))((?=\.)\.[^#,\s]*|)(?:\s|,|$)+/;
    var REG_ACSS_COLOR_HEX_NO_LOWERCASED_LETTER = /[a-z]/;
    var REG_ACSS_COLOR_HEX_NO_INVALID_HEX_VALUE = /[^0-9A-F]/;
    var REG_ACSS_COLOR_HEX_TO_RGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i; // https://github.com/acss-io/atomizer/blob/1bd685fe5970af5d1984f96ecfccd5df37e4601f/src/lib/utils.js#L10
    var REG_ACSS_MATCH_PSEUDO_CLASSES = /(?=:)(:[^:]+)/g;
    var REG_ACSS_MATCH_PSEUDO_ELEMENTS = /(?=::)(::[^:]+)/g;
    var ACSS_COMMENT_TEMPLATE = '/* -------------------> $ */';

    var HTML_TEMPLATES = {
        Doc: '<!DOCTYPE html><html[[modifiers]]>[[content]]</html>',
        Head: '<head>[[content]]</head>',
        Meta: '<meta[[modifiers]]>',
        Title: '<title>[[content]]</title>',
        Link: '<link[[modifiers]]>',
        Body: '<body>[[content]]</body>',
        Div: '<div[[modifiers]]>[[content]]</div>',
        P: '<p[[modifiers]]>[[content]]</p>',
        Span: '<span[[modifiers]]>[[content]]</span>',
        I: '<i[[modifiers]]>[[content]]</i>',
        H1: '<h1[[modifiers]]>[[content]]</h1>',
        H2: '<h2[[modifiers]]>[[content]]</h2>',
        H3: '<h3[[modifiers]]>[[content]]</h3>',
        H4: '<h4[[modifiers]]>[[content]]</h4>',
        H5: '<h5[[modifiers]]>[[content]]</h5>',
        A: '<a[[modifiers]]>[[content]]</a>',
        Button: '<button[[modifiers]]>[[content]]</button>',
        Img: '<img[[modifiers]]>',
        Hr: '<hr[[modifiers]]>',
        Label: '<label[[modifiers]]>[[content]]</label>',
        Input: '<input[[modifiers]]>',
        Select: '<select[[modifiers]]>[[content]]</select>',
        Option: '<option[[modifiers]]>[[content]]</option>',
        Script: '<script[[modifiers]]></script>'
    };
    var HTML_ATTRIBUTES = {
        Doc: [{
            name: 'Language',
            func: 'Lang',
            allowArgument: true,
            html: 'lang=$',
            noMissingSpaceAfterComma: true
        }],
        Head: [],
        Meta: [{ // MANDATORY ORDER
            name: 'Charset',
            func: 'Charset',
            allowArgument: true,
            html: 'charset=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Content',
            func: 'Content',
            allowArgument: true,
            html: 'content=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'HttpEquiv',
            func: 'HttpEquiv',
            allowArgument: true,
            html: 'http-equiv=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Name',
            func: 'Name',
            allowArgument: true,
            html: 'name=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Property',
            func: 'Property',
            allowArgument: true,
            html: 'property=$',
            noMissingSpaceAfterComma: true
        }],
        Title: [],
        Link: [{
            name: 'Href',
            func: 'Href',
            allowArgument: true,
            html: 'href=$',
            noMissingSpaceAfterComma: false
        }, {
            name: 'Rel',
            func: 'Rel',
            allowArgument: true,
            html: 'rel=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Type',
            func: 'Type',
            allowArgument: true,
            html: 'type=$',
            noMissingSpaceAfterComma: true
        }],
        Body: [],
        Div: [],
        P: [],
        Span: [],
        I: [],
        H1: [],
        H2: [],
        H3: [],
        H4: [],
        H5: [],
        A: [{
            name: 'Href',
            func: 'Href',
            allowArgument: true,
            html: 'href=$',
            noMissingSpaceAfterComma: false
        }],
        Button: [{
            name: 'Disabled',
            func: 'Disabled',
            allowArgument: false,
            html: 'disabled',
            noMissingSpaceAfterComma: false
        }, {
            name: 'Type',
            func: 'Type',
            allowArgument: true,
            html: 'type=$',
            noMissingSpaceAfterComma: true
        }],
        Img: [{
            name: 'Src',
            func: 'Src',
            allowArgument: true,
            html: 'src=$',
            noMissingSpaceAfterComma: false
        }, {
            name: 'Alt',
            func: 'Alt',
            allowArgument: true,
            html: 'alt=$',
            noMissingSpaceAfterComma: true
        }],
        Hr: [],
        Label: [{
            name: 'For',
            func: 'For',
            allowArgument: true,
            html: 'for=$',
            noMissingSpaceAfterComma: true
        }],
        Input: [{
            name: 'Accept',
            func: 'Accept',
            allowArgument: true,
            html: 'accept=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Checked',
            func: 'Chckd',
            allowArgument: false,
            html: 'checked',
            noMissingSpaceAfterComma: false
        }, {
            name: 'Disabled',
            func: 'Disabled',
            allowArgument: false,
            html: 'disabled',
            noMissingSpaceAfterComma: false
        }, {
            name: 'Multiple',
            func: 'Multiple',
            allowArgument: false,
            html: 'multiple',
            noMissingSpaceAfterComma: false
        }, {
            name: 'Name',
            func: 'Name',
            allowArgument: true,
            html: 'name=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Placeholder',
            func: 'Ph',
            allowArgument: true,
            html: 'placeholder=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Readonly',
            func: 'Ro',
            allowArgument: false,
            html: 'readonly',
            noMissingSpaceAfterComma: false
        }, {
            name: 'Type',
            func: 'Type',
            allowArgument: true,
            html: 'type=$',
            noMissingSpaceAfterComma: true
        }, {
            name: 'Value',
            func: 'Val',
            allowArgument: true,
            html: 'value=$',
            noMissingSpaceAfterComma: false
        }],
        Select: [{
            name: 'Disabled',
            func: 'Disabled',
            allowArgument: false,
            html: 'disabled',
            noMissingSpaceAfterComma: false
        }],
        Option: [{
            name: 'Selected',
            func: 'Slctd',
            allowArgument: false,
            html: 'selected',
            noMissingSpaceAfterComma: false
        }],
        Script: [{
            name: 'Src',
            func: 'Src',
            allowArgument: true,
            html: 'src=$',
            noMissingSpaceAfterComma: false
        }]
    };

    /**
     * ACSS CONSTANTS
     */
    var ACSS_COLOR_ARGUMENTS = {
        t: 'transparent',
        cc: 'currentColor',
        n: 'none'
    };

    var ACSS_RULES = [{ // ---------------------------------------------------> MANDATORY ORDER
        name: 'Align content',
        func: 'Ac',
        css: 'align-content: $',
        expanders: {
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            sb: 'space-between',
            sa: 'space-around',
            st: 'stretch'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Align items',
        func: 'Ai',
        css: 'align-items: $',
        expanders: {
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            b: 'baseline',
            st: 'stretch'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation',
        func: 'Anim',
        css: 'animation: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation delay',
        func: 'Animdel',
        css: 'animation-delay: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation direction',
        func: 'Animdir',
        css: 'animation-direction: $',
        expanders: {
            a: 'alternate',
            ar: 'alternate-reverse',
            n: 'normal',
            r: 'reverse'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation duration',
        func: 'Animdur',
        css: 'animation-duration: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation fill mode',
        func: 'Animfm',
        css: 'animation-fill-mode: $',
        expanders: {
            b: 'backwards',
            bo: 'both',
            f: 'forwards',
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation iteration count',
        func: 'Animic',
        css: 'animation-iteration-count: $',
        expanders: {
            i: 'infinite'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation name',
        func: 'Animn',
        css: 'animation-name: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation play state',
        func: 'Animps',
        css: 'animation-play-state: $',
        expanders: {
            p: 'paused',
            r: 'running'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Animation timing function',
        func: 'Animtf',
        css: 'animation-timing-function: $',
        expanders: {
            e: 'ease',
            ei: 'ease-in',
            eo: 'ease-out',
            eio: 'ease-in-out',
            l: 'linear',
            se: 'step-end',
            ss: 'step-start'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Appearance',
        func: 'Ap',
        css: 'appearance: $',
        expanders: {
            a: 'auto',
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Align self',
        func: 'As',
        css: 'align-self: $',
        expanders: {
            a: 'auto',
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            b: 'baseline',
            st: 'stretch'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Bottom',
        func: 'B',
        css: 'bottom: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border All Edges',
        func: 'BdA',
        css: [
            '.[[el]] {',
            '    border-width: 1px;',
            '    border-style: solid;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Border All Edges',
        func: 'Bda',
        css: 'border: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border Bottom 1px solid',
        func: 'BdB',
        css: [
            '.[[el]] {',
            '    border-top-width: 0;',
            '    border-right-width: 0;',
            '    border-bottom-width: 1px;',
            '    border-left-width: 0;',
            '    border-style: solid;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Border bottom',
        func: 'Bdb',
        css: 'border-bottom: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border bottom color',
        func: 'Bdbc',
        css: 'border-bottom-color: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border bottom style',
        func: 'Bdbs',
        css: 'border-bottom-style: $',
        expanders: {
            d: 'dotted',
            da: 'dashed',
            do: 'double',
            g: 'groove',
            h: 'hidden',
            i: 'inset',
            n: 'none',
            o: 'outset',
            r: 'ridge',
            s: 'solid'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border bottom width',
        func: 'Bdbw',
        css: 'border-bottom-width: $',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border color',
        func: 'Bdc',
        css: 'border-color: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border collapse',
        func: 'Bdcl',
        css: 'border-collapse: $',
        expanders: {
            c: 'collapse',
            s: 'separate'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border Left 1px solid',
        func: 'BdL',
        css: [
            '.[[el]] {',
            '    border-top-width: 0;',
            '    border-right-width: 0;',
            '    border-bottom-width: 0;',
            '    border-left-width: 1px;',
            '    border-style: solid;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Border left',
        func: 'Bdl',
        css: 'border-left: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border left color',
        func: 'Bdlc',
        css: 'border-left-color: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border left style',
        func: 'Bdls',
        css: 'border-left-style: $',
        expanders: {
            d: 'dotted',
            da: 'dashed',
            do: 'double',
            g: 'groove',
            h: 'hidden',
            i: 'inset',
            n: 'none',
            o: 'outset',
            r: 'ridge',
            s: 'solid'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border left width',
        func: 'Bdlw',
        css: 'border-left-width: $',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border Right 1px solid',
        func: 'BdR',
        css: [
            '.[[el]] {',
            '    border-top-width: 0;',
            '    border-right-width: 1px;',
            '    border-bottom-width: 0;',
            '    border-left-width: 0;',
            '    border-style: solid;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Border right',
        func: 'Bdr',
        css: 'border-right: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border radius',
        func: 'Bdrad',
        css: 'border-radius: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border radius bottom left',
        func: 'Bdradbl',
        css: 'border-bottom-left-radius: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border radius bottom right',
        func: 'Bdradbr',
        css: 'border-bottom-right-radius: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border radius top left',
        func: 'Bdradtl',
        css: 'border-top-left-radius: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border radius top right',
        func: 'Bdradtr',
        css: 'border-top-right-radius: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border right color',
        func: 'Bdrc',
        css: 'border-right-color: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border right style',
        func: 'Bdrs',
        css: 'border-right-style: $',
        expanders: {
            d: 'dotted',
            da: 'dashed',
            do: 'double',
            g: 'groove',
            h: 'hidden',
            i: 'inset',
            n: 'none',
            o: 'outset',
            r: 'ridge',
            s: 'solid'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border right width',
        func: 'Bdrw',
        css: 'border-right-width: $',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border style',
        func: 'Bds',
        css: 'border-style: $',
        expanders: {
            d: 'dotted',
            da: 'dashed',
            do: 'double',
            g: 'groove',
            h: 'hidden',
            i: 'inset',
            n: 'none',
            o: 'outset',
            r: 'ridge',
            s: 'solid'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border spacing',
        func: 'Bdsp',
        css: 'border-spacing: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border Top 1px solid',
        func: 'BdT',
        css: [
            '.[[el]] {',
            '    border-top-width: 1px;',
            '    border-right-width: 0;',
            '    border-bottom-width: 0;',
            '    border-left-width: 0;',
            '    border-style: solid;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Border top',
        func: 'Bdt',
        css: 'border-top: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border top color',
        func: 'Bdtc',
        css: 'border-top-color: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border top style',
        func: 'Bdts',
        css: 'border-top-style: $',
        expanders: {
            d: 'dotted',
            da: 'dashed',
            do: 'double',
            g: 'groove',
            h: 'hidden',
            i: 'inset',
            n: 'none',
            o: 'outset',
            r: 'ridge',
            s: 'solid'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border top width',
        func: 'Bdtw',
        css: 'border-top-width: $',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border width',
        func: 'Bdw',
        css: 'border-width: $',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border X 1px solid',
        func: 'BdX',
        css: [
            '.[[el]] {',
            '    border-top-width: 0;',
            '    border-right-width: 1px;',
            '    border-bottom-width: 0;',
            '    border-left-width: 1px;',
            '    border-style: solid;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Border X',
        func: 'Bdx',
        css: [
            'border-left: $',
            'border-right: $'
        ],
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Border Y 1px solid',
        func: 'BdY',
        css: [
            '.[[el]] {',
            '    border-top-width: 1px;',
            '    border-right-width: 0;',
            '    border-bottom-width: 1px;',
            '    border-left-width: 0;',
            '    border-style: solid;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Border Y',
        func: 'Bdy',
        css: [
            'border-top: $',
            'border-bottom: $'
        ],
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Block-formatting context',
        func: 'BfcHack',
        css: [
            '.[[el]] {',
            '    display: table-cell;',
            '    width: 1600px;',
            '    *width: auto;',
            '    zoom: 1;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Backface visibility',
        func: 'Bfv',
        css: 'backface-visibility: $',
        expanders: {
            h: 'hidden',
            v: 'visible'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background',
        func: 'Bg',
        css: 'background: $',
        expanders: {
            n: 'none',
            t: 'transparent'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background attachment',
        func: 'Bga',
        css: 'background-attachment: $',
        expanders: {
            f: 'fixed',
            l: 'local',
            s: 'scroll'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background color',
        func: 'Bgc',
        css: 'background-color: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background clip',
        func: 'Bgcp',
        css: 'background-clip: $',
        expanders: {
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background image',
        func: 'Bgi',
        css: 'background-image: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background origin',
        func: 'Bgo',
        css: 'background-origin: $',
        expanders: {
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background position',
        func: 'Bgp',
        css: 'background-position: $',
        expanders: {
            left_t: 'left 0',
            right_t: 'right 0',
            left_b: 'left 100%',
            right_b: 'right 100%',
            left_c: 'left center',
            right_c: 'right center',
            c_b: 'center 100%',
            c_t: 'center 0',
            c: 'center'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background position (X axis)',
        func: 'Bgpx',
        css: 'background-position-x: $',
        expanders: {
            left: 'left',
            right: 'right',
            c: '50%'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background position (Y axis)',
        func: 'Bgpy',
        css: 'background-position-y: $',
        expanders: {
            t: '0',
            b: '100%',
            c: '50%'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background repeat',
        func: 'Bgr',
        css: 'background-repeat: $',
        expanders: {
            nr: 'no-repeat',
            rx: 'repeat-x',
            ry: 'repeat-y',
            r: 'repeat',
            s: 'space',
            ro: 'round'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Background size',
        func: 'Bgz',
        css: 'background-size: $',
        expanders: {
            a: 'auto',
            ct: 'contain',
            cv: 'cover'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Blur (filter)',
        func: 'Blur',
        css: 'filter: blur($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Brightness (filter)',
        func: 'Brightness',
        css: 'filter: brightness($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Box shadow',
        func: 'Bxsh',
        css: 'box-shadow: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Box sizing',
        func: 'Bxz',
        css: 'box-sizing: $',
        expanders: {
            cb: 'content-box',
            pb: 'padding-box',
            bb: 'border-box'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Color',
        func: 'C',
        css: 'color: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Clearfix',
        func: 'Cf',
        css: [
            '.[[el]]:before, .[[el]]:after {',
            '    content: " ";',
            '    display: table;',
            '}',
            '.[[el]]:after {',
            '    clear: both;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Clear',
        func: 'Cl',
        css: 'clear: $',
        expanders: {
            n: 'none',
            b: 'both'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Content',
        func: 'Cnt',
        css: 'content: $',
        expanders: {
            n: 'none',
            nor: 'normal',
            oq: 'open-quote',
            cq: 'close-quote',
            noq: 'no-open-quote',
            ncq: 'no-close-quote'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Contrast (filter)',
        func: 'Contrast',
        css: 'filter: contrast($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Cursor',
        func: 'Cur',
        css: 'cursor: $',
        expanders: {
            a: 'auto',
            as: 'all-scroll',
            c: 'cell',
            cr: 'col-resize',
            co: 'copy',
            cro: 'crosshair',
            d: 'default',
            er: 'e-resize',
            ewr: 'ew-resize',
            g: 'grab',
            gr: 'grabbing',
            h: 'help',
            m: 'move',
            n: 'none',
            nd: 'no-drop',
            na: 'not-allowed',
            nr: 'n-resize',
            ner: 'ne-resize',
            neswr: 'nesw-resize',
            nwser: 'nwse-resize',
            nsr: 'ns-resize',
            nwr: 'nw-resize',
            p: 'pointer',
            pr: 'progress',
            rr: 'row-resize',
            sr: 's-resize',
            ser: 'se-resize',
            swr: 'sw-resize',
            t: 'text',
            vt: 'vertical-text',
            w: 'wait',
            wr: 'w-resize',
            zi: 'zoom-in',
            zo: 'zoom-out'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Display',
        func: 'D',
        css: 'display: $',
        expanders: {
            n: 'none',
            b: 'block',
            f: 'flex',
            if: 'inline-flex',
            i: 'inline',
            ib: 'inline-block',
            tb: 'table',
            tbr: 'table-row',
            tbc: 'table-cell',
            li: 'list-item',
            ri: 'run-in',
            cp: 'compact',
            itb: 'inline-table',
            tbcl: 'table-column',
            tbclg: 'table-column-group',
            tbhg: 'table-header-group',
            tbfg: 'table-footer-group',
            tbrg: 'table-row-group'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Drop shadow (filter)',
        func: 'Dropshadow',
        css: 'filter: drop-shadow($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Ellipsis',
        func: 'Ell',
        css: [
            '.[[el]] {',
            '    max-width: 100%;',
            '    white-space: nowrap;',
            '    overflow: hidden;',
            '    text-overflow: ellipsis;',
            '    hyphens: none;',
            '}',
            '.[[el]]:after {',
            '    content: ".";',
            '    font-size: 0;',
            '    visibility: hidden;',
            '    display: inline-block;',
            '    overflow: hidden;',
            '    height: 0;',
            '    width: 0;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Font family',
        func: 'Ff',
        css: 'font-family: $',
        expanders: {
            c: '"Monotype Corsiva", "Comic Sans MS", cursive',
            f: 'Capitals, Impact, fantasy',
            m: 'Monaco, "Courier New", monospace',
            s: 'Georgia, "Times New Roman", serif',
            ss: 'Helvetica, Arial, sans-serif'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Filter',
        func: 'Fil',
        css: 'filter: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Fill (SVG)',
        func: 'Fill',
        css: 'fill: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Float',
        func: 'Fl',
        css: 'float: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Font style',
        func: 'Fs',
        css: 'font-style: $',
        expanders: {
            n: 'normal',
            i: 'italic',
            o: 'oblique'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Font variant',
        func: 'Fv',
        css: 'font-variant: $',
        expanders: {
            n: 'normal',
            sc: 'small-caps'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Font weight',
        func: 'Fw',
        css: 'font-weight: $',
        expanders: {
            b: 'bold',
            br: 'bolder',
            lr: 'lighter',
            n: 'normal'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Flex',
        func: 'Fx',
        css: 'flex: $',
        expanders: {
            a: 'auto',
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Flex basis',
        func: 'Fxb',
        css: 'flex-basis: $',
        expanders: {
            a: 'auto',
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Flex direction',
        func: 'Fxd',
        css: 'flex-direction: $',
        expanders: {
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Flex flow',
        func: 'Fxf',
        css: 'flex-flow: $',
        expanders: {
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse',
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Flex grow',
        func: 'Fxg',
        css: 'flex-grow: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Flex shrink',
        func: 'Fxs',
        css: 'flex-shrink: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Flex-wrap',
        func: 'Fxw',
        css: 'flex-wrap: $',
        expanders: {
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Font size',
        func: 'Fz',
        css: 'font-size: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Grayscale (filter)',
        func: 'Grayscale',
        css: 'filter: grayscale($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Height',
        func: 'H',
        css: 'height: $',
        expanders: {
            a: 'auto',
            av: 'available',
            bb: 'border-box',
            cb: 'content-box',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Hiding content from sighted users',
        func: 'Hidden',
        css: [
            '.[[el]] {',
            '    position: absolute !important;',
            '    *clip: rect(1px 1px 1px 1px);',
            '    clip: rect(1px, 1px, 1px, 1px);',
            '    padding: 0 !important;',
            '    border: 0 !important;',
            '    height: 1px !important;',
            '    width: 1px !important;',
            '    overflow: hidden;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Hue Rotate (filter)',
        func: 'HueRotate',
        css: 'filter: hue-rotate($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Hyphens',
        func: 'Hy',
        css: 'hyphens: $',
        expanders: {
            a: 'auto',
            n: 'normal',
            m: 'manual'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Inline-block box',
        func: 'IbBox',
        css: [
            '.[[el]] {',
            '    display: inline-block;',
            '    *display: inline;',
            '    zoom: 1;',
            '    vertical-align: top;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Invert (filter)',
        func: 'Invert',
        css: 'filter: invert($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Justify content',
        func: 'Jc',
        css: 'justify-content: $',
        expanders: {
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            sb: 'space-between',
            sa: 'space-around'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Left',
        func: 'L',
        css: 'left: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Line height',
        func: 'Lh',
        css: 'line-height: $',
        expanders: {
            n: 'normal'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Line clamp',
        func: 'LineClamp', // https://github.com/acss-io/atomizer/blob/master/src/helpers.js#L267
        css: [
            '.[[el]] {',
            '    -webkit-line-clamp: [0];',
            '    max-height: [1];',
            '    display: -webkit-box;',
            '    -webkit-box-orient: vertical;',
            '    overflow: hidden;',
            '}',
            '@supports (display:-moz-box) {',
            '    .[[el]] {',
            '        display: block;',
            '    }',
            '}',
            'a.[[el]] {',
            '    display: inline-block;',
            '    display: -webkit-box;',
            '    *display: inline;',
            '    zoom: 1;',
            '}',
            'a.[[el]]:after {',
            '    content: ".";',
            '    font-size: 0;',
            '    visibility: hidden;',
            '    display: inline-block;',
            '    overflow: hidden;',
            '    height: 0;',
            '    width: 0;',
            '}'
        ],
        allowArgument: true,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'List style image',
        func: 'Lisi',
        css: 'list-style-image: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'List style position',
        func: 'Lisp',
        css: 'list-style-position: $',
        expanders: {
            i: 'inside',
            o: 'outside'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'List style type',
        func: 'List',
        css: 'list-style-type: $',
        expanders: {
            n: 'none',
            d: 'disc',
            c: 'circle',
            s: 'square',
            dc: 'decimal',
            dclz: 'decimal-leading-zero',
            lr: 'lower-roman',
            lg: 'lower-greek',
            ll: 'lower-latin',
            ur: 'upper-roman',
            ul: 'upper-latin',
            a: 'armenian',
            g: 'georgian',
            la: 'lower-alpha',
            ua: 'upper-alpha'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Letter spacing',
        func: 'Lts',
        css: 'letter-spacing: $',
        expanders: {
            n: 'normal'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Margin (all edges)',
        func: 'M',
        css: 'margin: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Max height',
        func: 'Mah',
        css: 'max-height: $',
        expanders: {
            a: 'auto',
            maxc: 'max-content',
            minc: 'min-content',
            fa: 'fill-available',
            fc: 'fit-content'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Matrix (transform)',
        func: 'Matrix',
        css: 'transform: matrix($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Matrix 3d (transform)',
        func: 'Matrix3d',
        css: 'transform: matrix($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Max width',
        func: 'Maw',
        css: 'max-width: $',
        expanders: {
            n: 'none',
            fa: 'fill-available',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Margin bottom',
        func: 'Mb',
        css: 'margin-bottom: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Min height',
        func: 'Mih',
        css: 'min-height: $',
        expanders: {
            a: 'auto',
            fa: 'fill-available',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Min width',
        func: 'Miw',
        css: 'min-width: $',
        expanders: {
            a: 'auto',
            fa: 'fill-available',
            fc: 'fit-content',
            ini: 'initial',
            maxc: 'max-content',
            minc: 'min-content'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Margin left',
        func: 'Ml',
        css: 'margin-left: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Margin right',
        func: 'Mr',
        css: 'margin-right: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Margin top',
        func: 'Mt',
        css: 'margin-top: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Margin (X axis)',
        func: 'Mx',
        css: [
            'margin-left: $',
            'margin-right: $'
        ],
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Margin (Y axis)',
        func: 'My',
        css: [
            'margin-top: $',
            'margin-bottom: $'
        ],
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Outline',
        func: 'O',
        css: 'outline: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Opacity',
        func: 'Op',
        css: 'opacity: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Opacity (filter)',
        func: 'Opacity',
        css: 'filter: opacity($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Order',
        func: 'Or',
        css: 'order: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Overflow',
        func: 'Ov',
        css: 'overflow: $',
        expanders: {
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Overflow scrolling',
        func: 'Ovs',
        css: '-webkit-overflow-scrolling: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Overflow (X axis)',
        func: 'Ovx',
        css: 'overflow-x: $',
        expanders: {
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Overflow (Y axis)',
        func: 'Ovy',
        css: 'overflow-y: $',
        expanders: {
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Padding (all edges)',
        func: 'P',
        css: 'padding: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Padding bottom',
        func: 'Pb',
        css: 'padding-bottom: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Pointer events',
        func: 'Pe',
        css: 'pointer-events: $',
        expanders: {
            a: 'auto',
            f: 'fill',
            n: 'none',
            p: 'painted',
            s: 'stroke',
            v: 'visible',
            vf: 'visibleFill',
            vp: 'visiblePainted',
            vs: 'visibleStroke'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Padding left',
        func: 'Pl',
        css: 'padding-left: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Position',
        func: 'Pos',
        css: 'position: $',
        expanders: {
            a: 'absolute',
            f: 'fixed',
            r: 'relative',
            s: 'static',
            st: 'sticky'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Padding right',
        func: 'Pr',
        css: 'padding-right: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Perspective',
        func: 'Prs',
        css: 'perspective: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Perspective origin',
        func: 'Prso',
        css: 'perspective-origin: $',
        expanders: {
            t: 'top',
            c: 'center'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Padding top',
        func: 'Pt',
        css: 'padding-top: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Padding (X axis)',
        func: 'Px',
        css: [
            'padding-left: $',
            'padding-right: $'
        ],
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Padding (Y axis)',
        func: 'Py',
        css: [
            'padding-top: $',
            'padding-bottom: $'
        ],
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Right',
        func: 'R',
        css: 'right: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Rotate (transform)',
        func: 'Rotate',
        css: 'transform: rotate($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Rotate 3d (transform)',
        func: 'Rotate3d',
        css: 'transform: rotate3d($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'RotateX (transform)',
        func: 'RotateX',
        css: 'transform: rotateX($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'RotateY (transform)',
        func: 'RotateY',
        css: 'transform: rotateY($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'RotateZ (transform)',
        func: 'RotateZ',
        css: 'transform: rotateZ($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Row',
        func: 'Row',
        css: [
            '.[[el]] {',
            '    clear: both;',
            '    display: inline-block;',
            '    vertical-align: top;',
            '    width: 100%;',
            '    box-sizing: border-box;',
            '    *display: block;',
            '    *width: auto;',
            '    zoom: 1;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Resize',
        func: 'Rsz',
        css: 'resize: $',
        expanders: {
            n: 'none',
            b: 'both',
            h: 'horizontal',
            v: 'vertical'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Saturate (filter)',
        func: 'Saturate',
        css: 'filter: saturate($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Scale (transform)',
        func: 'Scale',
        css: 'transform: scale($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Scale 3d (transform)',
        func: 'Scale3d',
        css: 'transform: scale3d($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'ScaleX (transform)',
        func: 'ScaleX',
        css: 'transform: scaleX($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'ScaleY (transform)',
        func: 'ScaleY',
        css: 'transform: scaleY($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Sepia (filter)',
        func: 'Sepia',
        css: 'filter: sepia($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Skew (transform)',
        func: 'Skew',
        css: 'transform: skew($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'SkewX (transform)',
        func: 'SkewX',
        css: 'transform: skewX($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'SkewY (transform)',
        func: 'SkewY',
        css: 'transform: skewY($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Stroke (SVG)',
        func: 'Stk',
        css: 'stroke: $',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Stroke linecap (SVG)',
        func: 'Stklc',
        css: 'stroke-linecap: $',
        expanders: {
            b: 'butt',
            r: 'round',
            s: 'square'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Stroke linejoin (SVG)',
        func: 'Stklj',
        css: 'stroke-linejoin: $',
        expanders: {
            b: 'bevel',
            r: 'round',
            m: 'miter'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Stroke width (SVG)',
        func: 'Stkw',
        css: 'stroke-width: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Stretched box',
        func: 'StretchedBox',
        css: [
            '.[[el]] {',
            '    position: absolute;',
            '    top: 0;',
            '    right: 0;',
            '    bottom: 0;',
            '    left: 0;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }, {
        name: 'Top',
        func: 'T',
        css: 'top: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text align',
        func: 'Ta',
        css: 'text-align: $',
        expanders: {
            c: 'center',
            e: 'end',
            j: 'justify',
            mp: 'match-parent',
            s: 'start'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text align last',
        func: 'Tal',
        css: 'text-align-last: $',
        expanders: {
            a: 'auto',
            c: 'center',
            e: 'end',
            j: 'justify',
            s: 'start'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Table layout',
        func: 'Tbl',
        css: 'table-layout: $',
        expanders: {
            a: 'auto',
            f: 'fixed'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text decoration',
        func: 'Td',
        css: 'text-decoration: $',
        expanders: {
            lt: 'line-through',
            n: 'none',
            o: 'overline',
            u: 'underline'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text indent',
        func: 'Ti',
        css: 'text-indent: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text overflow',
        func: 'Tov',
        css: 'text-overflow: $',
        expanders: {
            c: 'clip',
            e: 'ellipsis'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text replace',
        func: 'Tr',
        css: 'text-replace: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Translate (transform)',
        func: 'Translate',
        css: 'transform: translate($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Translate 3d (transform)',
        func: 'Translate3d',
        css: 'transform: translate3d($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Translate X (transform)',
        func: 'TranslateX',
        css: 'transform: translateX($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Translate Y (transform)',
        func: 'TranslateY',
        css: 'transform: translateY($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Translate Z (transform)',
        func: 'TranslateZ',
        css: 'transform: translateZ($)',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text rendering',
        func: 'Tren',
        css: 'text-rendering: $',
        expanders: {
            a: 'auto',
            os: 'optimizeSpeed',
            ol: 'optimizeLegibility',
            gp: 'geometricPrecision'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transform',
        func: 'Trf',
        css: 'transform: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transform origin',
        func: 'Trfo',
        css: 'transform-origin: $',
        expanders: {
            t: 'top',
            c: 'center'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transform style',
        func: 'Trfs',
        css: 'transform-style: $',
        expanders: {
            f: 'flat',
            p: 'preserve-3d'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transition',
        func: 'Trs',
        css: 'transition: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transition delay',
        func: 'Trsde',
        css: 'transition-delay: $',
        expanders: {
            i: 'initial'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transition duration',
        func: 'Trsdu',
        css: 'transition-duration: $',
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transition property',
        func: 'Trsp',
        css: 'transition-property: $',
        expanders: {
            a: 'all'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Transition timing function',
        func: 'Trstf',
        css: 'transition-timing-function: $',
        expanders: {
            e: 'ease',
            ei: 'ease-in',
            eo: 'ease-out',
            eio: 'ease-in-out',
            l: 'linear',
            ss: 'step-start',
            se: 'step-end'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text shadow',
        func: 'Tsh',
        css: 'text-shadow: $',
        expanders: {
            n: 'none'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Text transform',
        func: 'Tt',
        css: 'text-transform: $',
        expanders: {
            n: 'none',
            c: 'capitalize',
            u: 'uppercase',
            l: 'lowercase'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'User select',
        func: 'Us',
        css: 'user-select: $',
        expanders: {
            a: 'all',
            el: 'element',
            els: 'elements',
            n: 'none',
            t: 'text',
            to: 'toggle'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Visibility',
        func: 'V',
        css: 'visibility: $',
        expanders: {
            v: 'visible',
            h: 'hidden',
            c: 'collapse'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Vertical align',
        func: 'Va',
        css: 'vertical-align: $',
        expanders: {
            b: 'bottom',
            bl: 'baseline',
            m: 'middle',
            sub: 'sub',
            sup: 'super',
            t: 'top',
            tb: 'text-bottom',
            tt: 'text-top'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Width',
        func: 'W',
        css: 'width: $',
        expanders: {
            a: 'auto',
            bb: 'border-box',
            cb: 'content-box',
            av: 'available',
            minc: 'min-content',
            maxc: 'max-content',
            fc: 'fit-content'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'White space',
        func: 'Whs',
        css: 'white-space: $',
        expanders: {
            n: 'normal',
            p: 'pre',
            nw: 'nowrap',
            pw: 'pre-wrap',
            pl: 'pre-line'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'White space collapse',
        func: 'Whsc',
        css: 'white-space-collapse: $',
        expanders: {
            n: 'normal',
            ka: 'keep-all',
            l: 'loose',
            bs: 'break-strict',
            ba: 'break-all'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Word break',
        func: 'Wob',
        css: 'word-break: $',
        expanders: {
            ba: 'break-all',
            ka: 'keep-all',
            n: 'normal'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Word wrap',
        func: 'Wow',
        css: 'word-wrap: $',
        expanders: {
            bw: 'break-word',
            n: 'normal'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Z index',
        func: 'Z',
        css: 'z-index: $',
        expanders: {
            a: 'auto'
        },
        type: ACSS_INSTRUCTION_TYPE_rule()
    }, {
        name: 'Zoom',
        func: 'Zoom',
        css: [
            '.[[el]] {',
            '    zoom: 1;',
            '}'
        ],
        allowArgument: false,
        type: ACSS_INSTRUCTION_TYPE_helper()
    }];
    function ACSS_INSTRUCTION_TYPE_rule() {
        return 'RULE';
    }
    function ACSS_INSTRUCTION_TYPE_helper() {
        return 'HELPER';
    }
    var PSEUDO_CLASSES = [{
        acssValue: ':a',
        cssValue: ':active'
    }, {
        acssValue: ':c',
        cssValue: ':checked'
    }, {
        acssValue: ':d',
        cssValue: ':default'
    }, {
        acssValue: ':di',
        cssValue: ':disabled'
    }, {
        acssValue: ':e',
        cssValue: ':empty'
    }, {
        acssValue: ':en',
        cssValue: ':enabled'
    }, {
        acssValue: ':fi',
        cssValue: ':first'
    }, {
        acssValue: ':fc',
        cssValue: ':first-child'
    }, {
        acssValue: ':fot',
        cssValue: ':first-of-type'
    }, {
        acssValue: ':fs',
        cssValue: ':fullscreen'
    }, {
        acssValue: ':f',
        cssValue: ':focus'
    }, {
        acssValue: ':h',
        cssValue: ':hover'
    }, {
        acssValue: ':ind',
        cssValue: ':indeterminate'
    }, {
        acssValue: ':ir',
        cssValue: ':in-range'
    }, {
        acssValue: ':inv',
        cssValue: ':invalid'
    }, {
        acssValue: ':lc',
        cssValue: ':last-child'
    }, {
        acssValue: ':lot',
        cssValue: ':last-of-type'
    }, {
        acssValue: ':l',
        cssValue: ':left'
    }, {
        acssValue: ':li',
        cssValue: ':link'
    }, {
        acssValue: ':oc',
        cssValue: ':only-child'
    }, {
        acssValue: ':oot',
        cssValue: ':only-of-type'
    }, {
        acssValue: ':o',
        cssValue: ':optional'
    }, {
        acssValue: ':oor',
        cssValue: ':out-of-range'
    }, {
        acssValue: ':ro',
        cssValue: ':read-only'
    }, {
        acssValue: ':rw',
        cssValue: ':read-write'
    }, {
        acssValue: ':req',
        cssValue: ':required'
    }, {
        acssValue: ':r',
        cssValue: ':right'
    }, {
        acssValue: ':rt',
        cssValue: ':root'
    }, {
        acssValue: ':s',
        cssValue: ':scope'
    }, {
        acssValue: ':t',
        cssValue: ':target'
    }, {
        acssValue: ':va',
        cssValue: ':valid'
    }, {
        acssValue: ':vi',
        cssValue: ':visited'
    }];

    var PSEUDO_ELEMENTS = [{
        acssValue: '::b',
        cssValue: '::before'
    }, {
        acssValue: '::a',
        cssValue: '::after'
    }, {
        acssValue: '::fl',
        cssValue: '::first-letter'
    }, {
        acssValue: '::fli',
        cssValue: '::first-line'
    }, {
        acssValue: '::ph',
        cssValue: '::placeholder'
    }];

    /**
     * MAIN
     */
    cmd = cmd instanceof RegExp ? cmd.toString().slice(1, -1) : cmd;
    if (!cmd || typeof(cmd) !== 'string') {
        throw new Error('api-cmd');
    }
    var data; // -------------------------------------------------------------> data-[key]=""
    var content;
    var err = BASE_CMD_validate();
    if (err) {
        throw err;
    }
    else {
        return BASE_CMD_process();
    }

    function BASE_CMD_validate() {
        return validateAll(cmd, [
            BASE_CMD_noSpaceAtStart,
            BASE_CMD_noSpaceAtEnd,
            BASE_CMD_noSpaceFollowedByComma,
            BASE_CMD_noMultipleSpaces,
            BASE_CMD_noMultipleCommas,
            BASE_CMD_noMultiplePipes,
            BASE_CMD_noSpacesAroundPipe,
            BASE_CMD_noPipeAtEnd,
            BASE_CMD_noSpaceAfterOpenParen,
            BASE_CMD_noSpaceBeforeCloseParen
        ]);
    }
    function validateAll(str, validations) {
        for (var i = 0, l = validations.length; i < l; i++) {
            var err = validations[i](str);
            if (err) {
                return err;
            }
        }
        return null;
    }
    function BASE_CMD_noSpaceAtStart(v) {
        if (REG_BASE_CMD_NO_SPACE_AT_START.test(v)) {
            return new Error('Base command - No space at start.');
        }
        return null;
    }
    function BASE_CMD_noSpaceAtEnd(v) {
        if (REG_BASE_CMD_NO_SPACE_AT_END.test(v)) {
            return new Error('Base command - No space at end.');
        }
        return null;
    }
    function BASE_CMD_noSpaceFollowedByComma(v) {
        if (REG_BASE_CMD_NO_SPACE_FOLLOWED_BY_COMMA.test(v)) {
            return new Error('Base command - No space followed by comma.');
        }
        return null;
    }
    function BASE_CMD_noMultipleSpaces(v) {
        if (REG_BASE_CMD_NO_MULTIPLE_SPACES.test(v)) {
            return new Error('Base command - No multiple spaces.');
        }
        return null;
    }
    function BASE_CMD_noMultipleCommas(v) {
        if (REG_BASE_CMD_NO_MULTIPLE_COMMAS.test(v)) {
            return new Error('Base command - No multiple commas.');
        }
        return null;
    }
    function BASE_CMD_noMultiplePipes(v) {
        if (REG_BASE_CMD_NO_MULTIPLE_PIPES.test(v)) {
            return new Error('Base command - No multiple pipes.');
        }
        return null;
    }
    function BASE_CMD_noSpacesAroundPipe(v) {
        if (REG_BASE_CMD_NO_SPACES_AROUND_PIPE.test(v)) {
            return new Error('Base command - No spaces around pipe.');
        }
        return null;
    }
    function BASE_CMD_noPipeAtEnd(v) {
        if (REG_BASE_CMD_NO_PIPE_AT_END.test(v)) {
            return new Error('Base command - No pipe at end.');
        }
        return null;
    }
    function BASE_CMD_noSpaceAfterOpenParen(v) {
        if (REG_BASE_CMD_NO_SPACE_AFTER_OPEN_PAREN.test(v)) {
            return new Error('Base command - No space after open paren.');
        }
        return null;
    }
    function BASE_CMD_noSpaceBeforeCloseParen(v) {
        if (REG_BASE_CMD_NO_SPACE_BEFORE_CLOSE_PAREN.test(v)) {
            return new Error('Base command - No space before close paren.');
        }
        return null;
    }
    function BASE_CMD_process() {
        cmd = BASE_CMD_parse();
        return BASE_CMD_generateHTML();
    }
    function BASE_CMD_parse() {
        var type = BASE_CMD_GET_TYPE();
        if (type === BASE_CMD_TYPE_HTML_METATAG() || type === BASE_CMD_TYPE_HTML_BODYTAG()) {
            cmd = BASE_CMD_parseTriple(type);
            var err = HTML_SELECTOR_INSTRUCTION_STRING_validate(type, cmd.htmlSelectorInstructionString);
            if (err) {
                throw err;
            }
            var selector = HTML_SELECTOR_INSTRUCTION_STRING_parse(type, cmd.htmlSelectorInstructionString);
            var attributes = [];
            if (cmd.htmlAttributesInstructionsString) {
                err = HTML_ATTRIBUTES_INSTRUCTIONS_STRING_validate(cmd.htmlAttributesInstructionsString);
                if (err) {
                    throw err;
                }
                attributes = HTML_ATTRIBUTES_INSTRUCTIONS_STRING_parse(selector.tag, cmd.htmlAttributesInstructionsString);
            }
            var acss = ACSS_compose(null, []);
            if (cmd.acssInstructionsString) {
                err = ACSS_INSTRUCTIONS_STRING_validate(cmd.acssInstructionsString);
                if (err) {
                    throw err;
                }
                var styleID = genStyleID();
                acss = ACSS_INSTRUCTIONS_STRING_parse(styleID, cmd.acssInstructionsString);
                selector.classes.unshift(styleID);
            }
            return BASE_CMD_compose(selector, attributes, acss);
        }
        else {
            throw new Error('Unsupported command type.');
        }
    }
    function BASE_CMD_GET_TYPE() {
        if (REG_BASE_CMD_IS_METATAG.test(cmd)) {
            return BASE_CMD_TYPE_HTML_METATAG();
        }
        else if (REG_BASE_CMD_IS_BODYTAG.test(cmd)) {
            return BASE_CMD_TYPE_HTML_BODYTAG();
        }
        else {
            return null;
        }
    }
    function BASE_CMD_TYPE_HTML_METATAG() {
        return 'HTML_METATAG_CMD';
    }
    function BASE_CMD_TYPE_HTML_BODYTAG() {
        return 'HTML_BODYTAG_CMD';
    }
    function BASE_CMD_parseTriple(type) {
        var tmp = cmd.split(REG_BASE_CMD_SPLIT_BY_PIPE);
        if (!Array.isArray(tmp) || tmp.length === 0) {
            throw new Error('Base command - Unable to parse triple.');
        }
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            if (tmp.length > 2) {
                throw new Error('Base command - Max 1 pipe separator.');
            }
        }
        else {
            if (tmp.length > 3) {
                throw new Error('Base command - Max 2 pipe separators.');
            }
        }
        var htmlSelectorInstructionString = tmp[0];
        if (!htmlSelectorInstructionString) {
            throw new Error('Base command - Missing <html-selector>.');
        }
        var htmlAttributesInstructionsString = null;
        var acssInstructionsString = null;
        if (tmp.length === 3) {
            if (tmp[1] && REG_BASE_CMD_IS_PROBABLY_HTML_ATTRIBUTES_INSTRUCTIONS_STRING.test(tmp[1])) {
                htmlAttributesInstructionsString = tmp[1];
            }
            else {
                throw new Error('Base command - Missing or invalid <html-attributes>.');
            }
            if (tmp[2] && REG_BASE_CMD_IS_PROBABLY_ACSS_INSTUCTIONS_STRING.test(tmp[2])) {
                acssInstructionsString = tmp[2];
            }
            else {
                throw new Error('Base command - Missing or invalid <acss>.');
            }
        }
        else {
            if (tmp.length === 2) {
                if (tmp[1]) {
                    if (REG_BASE_CMD_IS_PROBABLY_HTML_ATTRIBUTES_INSTRUCTIONS_STRING.test(tmp[1])) {
                        htmlAttributesInstructionsString = tmp[1];
                    }
                    else if (REG_BASE_CMD_IS_PROBABLY_ACSS_INSTUCTIONS_STRING.test(tmp[1])) {
                        acssInstructionsString = tmp[1];
                    }
                    else {
                        throw new Error('Base command - Unable to classify command at [1].');
                    }
                }
                else {
                    throw new Error('Base command - Unable to classify command at [1].');
                }
            }
        }
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            if (acssInstructionsString) {
                throw new Error('Base command - Metatag command must not define <acss>.');
            }
        }
        return BASE_CMD_composeTripleObject(type, htmlSelectorInstructionString, htmlAttributesInstructionsString, acssInstructionsString);
    }
    function BASE_CMD_composeTripleObject(type, htmlSelectorInstructionString, htmlAttributesInstructionsString, acssInstructionsString) {
        return {
            type: type,
            htmlSelectorInstructionString: htmlSelectorInstructionString,
            htmlAttributesInstructionsString: htmlAttributesInstructionsString,
            acssInstructionsString: acssInstructionsString
        };
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_validate(type, instructionString) {
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            return HTML_SELECTOR_INSTRUCTION_STRING_metaTagValidate(instructionString);
        }
        else if (type === BASE_CMD_TYPE_HTML_BODYTAG()) {
            return HTML_SELECTOR_INSTRUCTION_STRING_bodyTagValidate(instructionString);
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_metaTagValidate(firstPartOfCMD) {
        return validateAll(firstPartOfCMD, [
            HTML_SELECTOR_INSTRUCTION_STRING_noSpaces,
            HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedMetaTagChar
        ]);
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_bodyTagValidate(firstPartOfCMD) {
        return validateAll(firstPartOfCMD, [
            HTML_SELECTOR_INSTRUCTION_STRING_noSpaces,
            HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedBodyTagChar,
            HTML_SELECTOR_INSTRUCTION_STRING_noMultipleDots,
            HTML_SELECTOR_INSTRUCTION_STRING_noMultipleHashes,
            HTML_SELECTOR_INSTRUCTION_STRING_noDotAtEnd,
            HTML_SELECTOR_INSTRUCTION_STRING_noHashAtEnd,
            HTML_SELECTOR_INSTRUCTION_STRING_noHashFollowedByDot,
            HTML_SELECTOR_INSTRUCTION_STRING_noDotFollowedByHash,
            HTML_SELECTOR_INSTRUCTION_STRING_noNameSeparatorAtBoundary
        ]);
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noSpaces(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_SPACES.test(v)) {
            return new Error('HTML selector instruction string - No spaces.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedMetaTagChar(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_METATAG_CHAR.test(v)) {
            return new Error('HTML selector instruction string - No unallowed character.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedBodyTagChar(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_BODYTAG_CHAR.test(v)) {
            return new Error('HTML selector instruction string - No unallowed character.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noMultipleDots(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_DOTS.test(v)) {
            return new Error('HTML selector instruction string - No multiple dots.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noMultipleHashes(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_HASHES.test(v)) {
            return new Error('HTML selector instruction string - No multiple hashes.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noDotAtEnd(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_DOT_AT_END.test(v)) {
            return new Error('HTML selector instruction string - No dot at end.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noHashAtEnd(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_AT_END.test(v)) {
            return new Error('HTML selector instruction string - No hash at end.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noHashFollowedByDot(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_FOLLOWED_BY_DOT.test(v)) {
            return new Error('HTML selector instruction string - No hash followed by dot.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noDotFollowedByHash(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_DOT_FOLLOWED_BY_HASH.test(v)) {
            return new Error('HTML selector instruction string - No dot followed by hash.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_noNameSeparatorAtBoundary(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_NAME_SEPARATOR_AT_BOUNDARY.test(v)) {
            return new Error('HTML selector instruction string - No name separator at boundary.');
        }
        return null;
    }
    function HTML_SELECTOR_INSTRUCTION_STRING_parse(type, instructionString) {
        var components = instructionString.match(REG_HTML_SELECTOR_INSTRUCTION_STRING_MATCH_COMPONENTS);
        var tag = null;
        var id = null;
        var classes = [];
        for (var i = 0, l = components.length; i < l; i++) {
            var component = components[i];
            if (component) {
                if (i > 0) {
                    var ch = component[0];
                    if (ch === '.') {
                        classes.push(component.slice(1));
                    }
                    else if (ch === '#') {
                        if (classes.length > 0) {
                            throw new Error('HTML selector instruction string - No invalid order.');
                        }
                        if (id) {
                            throw new Error('HTML selector instruction string - No multiple IDs. ');
                        }
                        id = component.slice(1);
                    }
                }
                else {
                    tag = component;
                    if (!tag) {
                        throw new Error('Unable to parse HTML selector tag.');
                    }
                    if (!HTML_TEMPLATES[tag]) {
                        throw new Error('Missing template for "' + tag + '" tag.');
                    }
                    else { // ------------------------------------------------> NORMALIZE CONTENT ARGUMENT
                        if (HTML_TEMPLATES[tag].indexOf('[[modifiers]]') >= 0) {
                            if (HTML_TEMPLATES[tag].indexOf('[[content]]') >= 0) {
                                if (['[object Array]', '[object String]', '[object Undefined]'].indexOf(typ(a)) >= 0 && b === undefined) {
                                    data = {};
                                    content = a;
                                }
                                else if (typ(a) === '[object Object]' && ['[object Array]', '[object String]', '[object Undefined]'].indexOf(typ(b)) >= 0) {
                                    data = a;
                                    content = b;
                                }
                                else {
                                    throw new Error("Expected types fn('', [] || '' || undefined, undefined) or fn('', {}, [] || '' || undefined).");
                                }
                            }
                            else { // ----------------------------------------> Meta, Link, Input, Script,...
                                data = {};
                                content = '';
                                if (a !== undefined || b !== undefined) {
                                    throw new Error("Expected types fn('', undefined, undefined).");
                                }
                            }
                        }
                        else if (HTML_TEMPLATES[tag].indexOf('[[content]]') >= 0) {
                            if (['[object Array]', '[object String]', '[object Undefined]'].indexOf(typ(a)) >= 0 && b === undefined) {
                                data = {};
                                content = a;
                            }
                            else {
                                throw new Error("Expected types fn('', [] || '' || undefined, undefined).");
                            }
                        }
                        else {
                            throw new Error('invalidTemplate');
                        }
                        content = Array.isArray(content) ? content.join('') : (content || '');
                    }
                }
            }
        }
        return HTML_SELECTOR_INSTRUCTION_compose(tag, id, classes);
    }
    function HTML_SELECTOR_INSTRUCTION_compose(tag, id, classes) {
        return {
            tag: tag,
            id: id,
            classes: classes
        };
    }
    function HTML_ATTRIBUTES_INSTRUCTIONS_STRING_validate(instructionsString) {
        return validateAll(instructionsString, [
            HTML_ATTRIBUTES_INSTRUCTIONS_STRING_noMissingSpaceBetweenInstructions
        ]);
    }
    function HTML_ATTRIBUTES_INSTRUCTIONS_STRING_noMissingSpaceBetweenInstructions(v) {
        if (REG_HTML_ATTRIBUTES_INSTRUCTIONS_STRING_NO_MISSING_SPACE_BETWEEN_INSTRUCTIONS.test(v)) {
            return new Error('HTML attributes instructions string - No missing space between instructions.');
        }
        return null;
    }
    function HTML_ATTRIBUTES_INSTRUCTIONS_STRING_parse(htmlSelectorTag, instructionsString) {
        var allowedHTMLAttributes = HTML_ATTRIBUTES[htmlSelectorTag] || [];
        var instructionStrings = instructionsString.match(REG_HTML_ATTRIBUTES_INSTRUCTIONS_STRING_MATCH_INSTRUCTION_STRINGS);
        if (!instructionStrings) {
            throw new Error('HTML attributes instructions string - Unable to match any instruction string.');
        }
        var attributes = [];
        var unordered = false;
        for (var i = 0, l = instructionStrings.length; i < l; i++) {
            var instructionString = instructionStrings[i];
            var attribute = HTML_ATTRIBUTES_INSTRUCTION_STRING_parse(instructionString, allowedHTMLAttributes, htmlSelectorTag);
            if (i > 0) {
                var va = attribute.score;
                var vb = attributes[attributes.length - 1].score;
                if (va < vb) {
                    unordered = true;
                }
                else if (va === vb) {
                    throw new Error('HTML attributes instructions string - Duplicate instructions.');
                }
            }
            attributes.push(attribute);
        }
        if (unordered) {
            throw HTML_ATTRIBUTES_INSTRUCTIONS_STRING_composeOrderError(attributes);
        }
        return attributes;
    }
    function HTML_ATTRIBUTES_INSTRUCTION_STRING_parse(instructionString, allowedHTMLAttributes, htmlSelectorTag) {
        var components = instructionString.match(REG_HTML_ATTRIBUTES_INSTRUCTION_STRING_MATCH_COMPONENTS);
        if (!components) {
            throw new Error('HTML attributes instruction string - Instruction must follow <Attribute>(<value>?) syntax.');
        }
        var i = arrFindIndex(allowedHTMLAttributes, 'func', components[1]);
        if (i === -1) {
            throw new Error('Unsupported HTML attribute "' + components[1] + '" for "' + htmlSelectorTag + '" tag.');
        }
        var htmlAttribute = allowedHTMLAttributes[i];
        var err = HTML_ATTRIBUTES_INSTRUCTION_VALUE_validate(htmlAttribute, components[2]);
        if (err) {
            throw err;
        }
        var instructionValue = components[2] || '';
        var score = i;
        return HTML_ATTRIBUTES_INSTRUCTION_compose(instructionString, htmlAttribute, instructionValue, score);
    }
    function HTML_ATTRIBUTES_INSTRUCTION_VALUE_validate(htmlAttribute, v) {
        if (!htmlAttribute.allowArgument) {
            if (v) {
                return new Error('HTML attributes instruction string - Instruction "' + htmlAttribute.func + '" must not define parameter.');
            }
            return null;
        }
        var arr = [HTML_ATTRIBUTES_INSTRUCTION_VALUE_noUnallowedChar];
        if (htmlAttribute.noMissingSpaceAfterComma) {
            arr.push(HTML_ATTRIBUTES_INSTRUCTION_VALUE_noMissingSpaceAfterComma);
        }
        return validateAll(v, arr);
    }
    function HTML_ATTRIBUTES_INSTRUCTION_VALUE_noUnallowedChar(v) {
        if (REG_HTML_ATTRIBUTES_INSTRUCTION_VALUE_NO_UNALLOWED_CHAR.test(v)) {
            return new Error('HTML attributes instruction value - No unallowed char.');
        }
        return null;
    }
    function HTML_ATTRIBUTES_INSTRUCTION_VALUE_noMissingSpaceAfterComma(v) {
        if (REG_HTML_ATTRIBUTES_INSTRUCTION_VALUE_NO_MISSING_SPACE_AFTER_COMMA.test(v)) {
            return new Error('HTML attributes instruction value - No missing space after comma.');
        }
        return null;
    }
    function HTML_ATTRIBUTES_INSTRUCTION_compose(instructionString, htmlAttribute, instructionValue, score) {
        return extend(clone(htmlAttribute), {
            instructionString: instructionString,
            instructionValue: instructionValue,
            score: score
        });
    }
    function HTML_ATTRIBUTES_INSTRUCTIONS_STRING_composeOrderError(attributes) {
        var arr = arrSortByNumberASC(clone(attributes), 'score');
        var ba = [];
        var bb = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            var va = attributes[i].instructionString;
            if (va) {
                ba.push(va);
            }
            var vb = arr[i].instructionString;
            if (vb) {
                bb.push(vb);
            }
        }
        ba = ba.join(' ');
        bb = bb.join(' ');
        var msg = 'HTML attributes instructions string - ';
        msg += (ba && bb) ? ('Found "' + ba + '" expected "' + bb + '".') : 'Invalid instructions order.';
        return new Error(msg);
    }
    function ACSS_INSTRUCTIONS_STRING_validate(instructionsString) {
        return validateAll(instructionsString, [
            ACSS_INSTRUCTIONS_STRING_noMissingSpaceBetweenInstructions
        ]);
    }
    function ACSS_INSTRUCTIONS_STRING_noMissingSpaceBetweenInstructions(v) {
        if (REG_ACSS_INSTRUCTIONS_STRING_NO_MISSING_SPACE_BETWEEN_INSTRUCTIONS.test(v)) {
            return new Error('ACSS instructions string - No missing space between instructions.');
        }
        return null;
    }
    function ACSS_INSTRUCTIONS_STRING_parse(styleID, instructionsString) {
        var instructionStrings = instructionsString.match(REG_ACSS_INSTRUCTIONS_STRING_MATCH_INSTRUCTION_STRINGS);
        if (!instructionStrings) {
            throw new Error('ACSS instructions string - Unable to match any instruction string.');
        }
        var scores = [];
        var rules = [];
        var unordered = false;
        for (var i = 0, l = instructionStrings.length; i < l; i++) {
            var instructionString = instructionStrings[i];
            var rule = ACSS_INSTRUCTION_STRING_parse(instructionString);
            var score = ACSS_INSTRUCTION_composeInstructionScore(instructionString, rule.score, rule.pseudoScore, rule.mediaValue);
            if (i > 0) {
                var va = score.score;
                var vb = scores[scores.length - 1].score;
                if (va < vb) {
                    unordered = true;
                }
                else if (va === vb) {
                    throw new Error('ACSS instructions string - Duplicate ACSS instructions.');
                }
            }
            scores.push(score);
            rules.push(rule);
        }
        if (unordered) {
            throw ACSS_INSTRUCTIONS_STRING_composeOrderError(scores);
        }
        return ACSS_compose(styleID, rules);
    }
    function ACSS_INSTRUCTION_STRING_parse(instructionString) {
        var components = instructionString.match(REG_ACSS_INSTRUCTION_STRING_MATCH_COMPONENTS);
        if (!components) {
            throw new Error('ACSS instruction string - Instruction must follow <Style>[(<value>,<value>?,...)][<!>][:<pseudo-class>][::<pseudo-element>][@<breakpoint-identifier>]');
        }
        var i = arrFindIndex(ACSS_RULES, 'func', components[1]);
        if (i === -1) {
            throw new Error('Unsupported ACSS rule "' + components[1] + '".');
        }
        var score = i + 1;
        var acssRule = ACSS_RULES[i];
        var err = ACSS_INSTRUCTION_VALUE_validate(acssRule, components[2]);
        if (err) {
            throw err;
        }
        if (acssRule.type === ACSS_INSTRUCTION_TYPE_rule()) {
            return ACSS_INSTRUCTION_STRING_parseRule(acssRule, score, components);
        }
        else if (acssRule.type === ACSS_INSTRUCTION_TYPE_helper()) {
            return ACSS_INSTRUCTION_STRING_parseHelper(acssRule, score, components);
        }
        else {
            throw new Error('ACSS config - Missing "type".');
        }
    }
    function ACSS_INSTRUCTION_VALUE_validate(acssRule, v) {
        if (acssRule.type === ACSS_INSTRUCTION_TYPE_helper()) {
            if (!acssRule.allowArgument && v) {
                return new Error('ACSS instruction value - Instruction "' + acssRule.func + '" must not define parameter."');
            }
        }
        else if (!strTrim(v)) {
            return new Error('ACSS instruction value - Instruction "' + acssRule.func + '" must define parameter.');
        }
        return ACSS_INSTRUCTION_VALUE_noMissingSpaceAfterComma(v);
    }
    function ACSS_INSTRUCTION_VALUE_noMissingSpaceAfterComma(v) {
        v = v.replace(REG_ACSS_INSTRUCTION_VALUE_NO_MISSING_SPACE_AFTER_COMMA_SKIP, '');
        if (REG_ACSS_INSTRUCTION_VALUE_NO_MISSING_SPACE_AFTER_COMMA.test(v)) {
            return new Error('ACSS instruction value - No missing space after comma.');
        }
        return null;
    }
    function ACSS_INSTRUCTION_STRING_parseRule(acssRule, score, components) {
        var arg = ACSS_INSTRUCTION_VALUE_transform(acssRule, components[2]);
        var important = components[3] === '!';
        var pseudoClasses = ACSS_PSEUDO_CLASSES_STRING_parse(components[4]);
        var pseudoElements = ACSS_PSEUDO_ELEMENTS_STRING_parse(components[5]);
        if (Array.isArray(pseudoClasses.array) && pseudoClasses.array.length > 0 && Array.isArray(pseudoElements.array) && pseudoElements.array.length > 0) {
            throw new Error('ACSS instruction string - Define either "pseudo classes" or "pseudo elements" exclusively.');
        }
        var pseudoScore = pseudoClasses.score || pseudoElements.score;
        var mediaValue = ACSS_MEDIA_STRING_parse(components[6]);
        return ACSS_INSTRUCTION_composeRule(acssRule, score, arg, important, pseudoClasses.array, pseudoElements.array, pseudoScore, mediaValue);
    }
    function ACSS_INSTRUCTION_VALUE_transform(acssRule, instructionValue) {
        instructionValue = instructionValue.replace(REG_ACSS_INSTRUCTION_VALUE_BRACKETS[0], '(');
        instructionValue = instructionValue.replace(REG_ACSS_INSTRUCTION_VALUE_BRACKETS[1], ')');
        instructionValue = ACSS_INSTRUCTION_VALUE_transformColors(instructionValue);
        instructionValue = ACSS_INSTRUCTION_VALUE_transformByExpanders(acssRule, instructionValue);
        return instructionValue;
    }
    function ACSS_INSTRUCTION_VALUE_transformColors(instructionValue) {
        var m = null;
        while (m = REG_ACSS_INSTRUCTION_VALUE_MATCH_NEXT_COLOR.exec(instructionValue)) {
            if (Array.isArray(m) && m.length > 0) {
                var i = m.index + m[1].length;
                var j = i + 1 + m[2].length + m[3].length; // 1 FOR #
                var color = ACSS_INSTRUCTION_STRING_transformColor(m[2], m[3]);
                instructionValue = instructionValue.slice(0, i) + color + instructionValue.slice(j);
                m.lastIndex = j;
            }
        }
        return instructionValue;
    }
    function ACSS_INSTRUCTION_VALUE_transformByExpanders(acssRule, instructionValue) {
        if (!acssRule.expanders || typeof(acssRule.expanders) !== 'object') {
            return instructionValue;
        }
        for (var k in acssRule.expanders) {
            if (acssRule.expanders.hasOwnProperty(k)) {
                var exp = new RegExp('(^|\\s)(' + k + ')(\\s|$)', 'g');
                var m = null;
                while (m = exp.exec(instructionValue)) {
                    if (Array.isArray(m) && m.length > 0) {
                        var i = m.index + m[1].length;
                        var j = i + m[2].length;
                        instructionValue = instructionValue.slice(0, i) + acssRule.expanders[k] + instructionValue.slice(j);
                    }
                }
            }
        }
        return instructionValue;
    }
    function ACSS_INSTRUCTION_STRING_transformColor(hexString, opacityString) {
        var err = ACSS_COLOR_HEX_validate(hexString);
        if (err) {
            throw err;
        }
        var rgb = ACSS_COLOR_HEX_parse(hexString);
        var a = ACSS_COLOR_OPACITY_parse(opacityString);
        return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + a + ')';
    }
    function ACSS_COLOR_HEX_validate(hexString) {
        return validateAll(hexString, [
            ACSS_COLOR_HEX_noLowercasedLetter,
            ACSS_COLOR_HEX_noInvalidHexValue,
            ACSS_COLOR_HEX_noInvalidLength
        ]);
    }
    function ACSS_COLOR_HEX_noLowercasedLetter(v) {
        if (REG_ACSS_COLOR_HEX_NO_LOWERCASED_LETTER.test(v)) {
            return new Error('ACSS color hex - No lowercased letter.');
        }
        return null;
    }
    function ACSS_COLOR_HEX_noInvalidHexValue(v) {
        if (REG_ACSS_COLOR_HEX_NO_INVALID_HEX_VALUE.test(v)) {
            return new Error('ACSS color hex - No invalid hex value.');
        }
        return null;
    }
    function ACSS_COLOR_HEX_noInvalidLength(v) {
        if (v.length !== 6) {
            return new Error('ACSS color hex - No invalid length.');
        }
        return null;
    }
    function ACSS_COLOR_HEX_parse(hexString) { // https://github.com/acss-io/atomizer/blob/1bd685fe5970af5d1984f96ecfccd5df37e4601f/src/lib/utils.js#L6
        var m = hexString.match(REG_ACSS_COLOR_HEX_TO_RGB);
        if (!m) {
            throw new Error('ACSS color hex - Unable to parse.');
        }
        var r = parseInt(m[1], 16);
        var g = parseInt(m[2], 16);
        var b = parseInt(m[3], 16);
        return ACSS_COLOR_RGB_compose(r, g, b);
    }
    function ACSS_COLOR_RGB_compose(r, g, b) {
        return {
            r: r,
            g: g,
            b: b
        };
    }
    function ACSS_COLOR_OPACITY_parse(opacityString) {
        if (typeof(opacityString) === 'string' && opacityString.length > 0) {
            if (opacityString[0] !== '.') {
                throw new Error('ACSS color opacity - Unable to parse opacity.');
            }
            opacityString = '0' + opacityString;
            var v = parseFloat(opacityString);
            if (isNaN(v) || ('' + v).length !== opacityString.length || v < 0 || v > 1) {
                throw new Error('ACSS color opacity - Unable to parse opacity.');
            }
            if (opacityString.length > 4) {
                throw new Error('ACSS color opacity - Max precision 0.01 exceeded.');
            }
            return v;
        }
        return 100;
    }
    function ACSS_PSEUDO_CLASSES_STRING_parse(pseudoClassesString) {
        var pseudoClassStrings = pseudoClassesString.match(REG_ACSS_MATCH_PSEUDO_CLASSES);
        if (!Array.isArray(pseudoClassStrings) || pseudoClassStrings.length === 0) {
            return ACSS_PSEUDO_CLASSES_compose([], 0);
        }
        var totalScore = 0;
        var scores = [];
        var pseudoClasses = [];
        var unordered = false;
        for (var i = 0, l = pseudoClassStrings.length; i < l; i++) {
            var pseudoClassString = pseudoClassStrings[i];
            var j = arrFindIndex(PSEUDO_CLASSES, 'acssValue', pseudoClassString);
            if (j === -1) {
                throw new Error('ACSS pseudo classes string - Unsupported class: "' + pseudoClassString + '".');
            }
            var score = j + 1; // +1 TO DISTINGUISH "NO PSEUDO CLASS" FROM "PSEUDO CLASS ON INDEX 0"
            totalScore += score;
            if (i > 0) {
                var va = score;
                var vb = scores[scores.length - 1];
                if (va < vb) {
                    unordered = true;
                }
                else if (va === vb) {
                    throw new Error('ACSS pseudo classes string - Duplicate pseudo classes.');
                }
            }
            scores.push(score);
            pseudoClasses.push(PSEUDO_CLASSES[j].cssValue);
        }
        if (unordered) {
            throw ACSS_PSEUDO_CLASSES_STRING_composeOrderError(scores);
        }
        return ACSS_PSEUDO_CLASSES_compose(pseudoClasses, totalScore);
    }
    function ACSS_PSEUDO_CLASSES_STRING_composeOrderError(scores) {
        var arr = arrSortByNumberASC(clone(scores));
        var ba = [];
        var bb = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            var va = PSEUDO_CLASSES[scores[i] - 1].acssValue;
            if (va) {
                ba.push(va);
            }
            var vb = PSEUDO_CLASSES[arr[i] - 1].acssValue;
            if (vb) {
                bb.push(vb);
            }
        }
        ba = ba.join('');
        bb = bb.join('');
        var msg = 'ACSS pseudo classes string - ';
        msg += (ba && bb) ? ('Found "' + ba + '" expected "' + bb + '".') : 'Invalid pseudo classes order.';
        return new Error(msg);
    }
    function ACSS_PSEUDO_CLASSES_compose(pseudoClasses, score) {
        return {
            array: pseudoClasses,
            score: score
        };
    }
    function ACSS_PSEUDO_ELEMENTS_STRING_parse(pseudoElementsString) {
        var pseudoElementStrings = pseudoElementsString.match(REG_ACSS_MATCH_PSEUDO_ELEMENTS);
        if (!Array.isArray(pseudoElementStrings) || pseudoElementStrings.length === 0) {
            return ACSS_PSEUDO_ELEMENTS_compose([], 0);
        }
        var totalScore = 0;
        var scores = [];
        var pseudoElements = [];
        var unordered = false;
        for (var i = 0, l = pseudoElementStrings.length; i < l; i++) {
            var pseudoElementString = pseudoElementStrings[i];
            var j = arrFindIndex(PSEUDO_ELEMENTS, 'acssValue', pseudoElementString);
            if (j === -1) {
                throw new Error('ACSS pseudo elements string - Unsupported element: "' + pseudoElementString + '".');
            }
            var score = PSEUDO_CLASSES.length + j + 1; // --------------------> +1 TO DISTINGUISH "NO PSEUDO CLASS" FROM "PSEUDO CLASS ON INDEX 0"
            totalScore += score;
            if (i > 0) {
                var va = score;
                var vb = scores[scores.length - 1];
                if (va < vb) {
                    unordered = true;
                }
                else if (va === vb) {
                    throw new Error('ACSS pseudo elements string - Duplicate pseudo elements.');
                }
            }
            scores.push(score);
            pseudoElements.push(PSEUDO_ELEMENTS[j].cssValue);
        }
        if (unordered) {
            throw ACSS_PSEUDO_ELEMENTS_STRING_composeOrderError(scores);
        }
        return ACSS_PSEUDO_ELEMENTS_compose(pseudoElements, totalScore);
    }
    function ACSS_PSEUDO_ELEMENTS_STRING_composeOrderError(scores) {
        var arr = arrSortByNumberASC(clone(scores));
        var ba = [];
        var bb = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            var va = PSEUDO_ELEMENTS[scores[i] - 1].acssValue;
            if (va) {
                ba.push(va);
            }
            var vb = PSEUDO_ELEMENTS[arr[i] - 1].acssValue;
            if (vb) {
                bb.push(vb);
            }
        }
        ba = ba.join('');
        bb = bb.join('');
        var msg = 'ACSS pseudo elements string - ';
        msg += (ba && bb) ? ('Found "' + ba + '" expected "' + bb + '".') : 'Invalid pseudo elements order.';
        return new Error(msg);
    }
    function ACSS_PSEUDO_ELEMENTS_compose(pseudoElements, score) {
        return {
            array: pseudoElements,
            score: score
        };
    }
    function ACSS_MEDIA_STRING_parse(mediaString) {
        if (!mediaString) {
            return 0; // -----------------------------------------------------> DEFAULT MEDIA QUERY
        }
        var mediaValue = parseInt(mediaString.slice(1));
        if (isNaN(mediaValue) || mediaValue <= 0 || mediaValue > 9000) {
            throw new Error('ACSS instruction string - Media query value must be in range 0..9000.');
        }
        return mediaValue;
    }
    function ACSS_INSTRUCTION_composeRule(acssRule, score, arg, important, pseudoClasses, pseudoElements, pseudoScore, mediaValue) {
        return {
            acssRule: acssRule,
            score: score,
            arg: arg,
            important: important,
            pseudoClasses: pseudoClasses,
            pseudoElements: pseudoElements,
            pseudoScore: pseudoScore,
            mediaValue: mediaValue
        };
    }
    function ACSS_INSTRUCTION_STRING_parseHelper(acssHelper, score, components) {
        if (components[3] || components[4] || components[5] || components[6]) {
            throw new Error('ACSS instruction string - Helper must follow <Helper> syntax.');
        }
        var args = components[2].split(/\s*,\s*/);
        args = !args[0] ? [] : args;
        var expected = [];
        var tmp = acssHelper.css.join('').match(/\[\d+\]/g) || [];
        for (var i = 0, l = tmp.length; i < l; i++) {
            if (expected.indexOf(tmp[i]) === -1) {
                expected.push(tmp[i]);
            }
        }
        if (expected.length !== args.length) {
            throw new Error('ACSS instruction string - Passed ' + args.length + ' argument(s), expected ' + expected.length + ' for "' + acssHelper.func + '" helper.');
        }
        return ACSS_INSTRUCTION_composeHelper(acssHelper, score, args);
    }
    function ACSS_INSTRUCTION_composeHelper(acssHelper, score, args) {
        return {
            acssHelper: acssHelper,
            score: score,
            args: args,
            pseudoScore: 0,
            mediaValue: 0
        };
    }
    function ACSS_INSTRUCTION_composeInstructionScore(instructionString, ruleScore, pseudoScore, mediaValue) {
        return {
            instructionString: instructionString,
            score: parseInt('10' + padStart('' + (mediaValue + 1), 4, '0') + padStart('' + ruleScore, 4, '0') + padStart('' + pseudoScore, 3, '0'))
        };
    }
    function ACSS_INSTRUCTIONS_STRING_composeOrderError(scores) {
        var arr = arrSortByNumberASC(clone(scores), 'score');
        var ba = [];
        var bb = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            var va = scores[i].instructionString;
            if (va) {
                ba.push(va);
            }
            var vb = arr[i].instructionString;
            if (vb) {
                bb.push(vb);
            }
        }
        ba = ba.join(' ');
        bb = bb.join(' ');
        var msg = 'ACSS instructions string - ';
        msg += (ba && bb) ? ('Found "' + ba + '" expected "' + bb + '".') : 'Invalid ACSS instructions order.';
        return new Error(msg);
    }
    function ACSS_compose(styleID, rules) {
        return {
            styleID: styleID,
            rules: rules
        };
    }
    function BASE_CMD_compose(selector, attributes, acss) {
        return {
            selector: selector,
            attributes: attributes,
            acss: acss
        };
    }
    function BASE_CMD_generateHTML() {
        var css = strTrim([
            BASE_CMD_generateElementStylesByHelpers(cmd.acss),
            BASE_CMD_generateElementStylesByRules(cmd.acss)
        ].join('\n'));
        if (css.length > 0) {
            return [
                ('<style>\n    ' + css.replace(/\n/g, '\n    ') + '\n</style>'),
                BASE_CMD_generateElementHTMLStructure(cmd.selector, cmd.attributes)
            ].join('');
        }
        return BASE_CMD_generateElementHTMLStructure(cmd.selector, cmd.attributes);
    }
    function BASE_CMD_generateElementStylesByHelpers(acss) {
        var b = [];
        for (var i = 0, l = acss.rules.length; i < l; i++) {
            var rule = acss.rules[i];
            if (rule && rule.acssHelper) {
                var tmp = [];
                for (var j = 0, len = rule.acssHelper.css.length; j < len; j++) {
                    var line = rule.acssHelper.css[j] + (j === 0 ? ACSS_COMMENT_TEMPLATE.replace('$', 'HELPERS') : '');
                    tmp.push(line);
                }
                tmp = tmp.join('\n');
                tmp = tmp.replace(/\[\[el\]\]/g, acss.styleID);
                tmp = strFormatBySingleBrackets(tmp, rule.args);
                b = b.concat([tmp]);
            }
        }
        return b.join('\n');
    }
    function BASE_CMD_generateElementStylesByRules(acss) {
        var media = ACSS_RULES_mergeBySelector(ACSS_RULES_groupByMedia(ACSS_RULES_filterAndTransform(acss)));
        var l = media.length;
        var css = [];
        while (l--) {
            var rules = media.shift();
            if (rules.length === 0) {
                continue;
            }
            var b = [];
            for (var i = 0, len = rules.length; i < len; i++) {
                var rule = rules[i];
                b = b.concat([rule.selector + ' {\n    ' + rule.css.replace(/\n/g, '\n    ') + '\n}']);
            }
            b = b.join('\n');
            var mediaValue = rules[0].mediaValue;
            if (mediaValue > 0) {
                b = '@media (min-width: ' + mediaValue + 'px) {\n    ' + b.replace(/\n/g, '\n    ') + '\n}';
            }
            css.push(b);
        }
        css = css.join('\n');
        css = css.replace('\n', (ACSS_COMMENT_TEMPLATE.replace('$', 'RULES') + '\n'));
        return css;
    }
    function ACSS_RULES_mergeBySelector(media) {
        var len = media.length;
        var newMedia = [];
        while (len--) {
            var i;
            var l;
            var rules = media.shift();
            var rule = null;
            var uniqueSelectors = [];
            for (i = 0, l = rules.length; i < l; i++) {
                rule = rules[i];
                if (uniqueSelectors.indexOf(rule.selector) === -1) {
                    uniqueSelectors.push(rule.selector);
                }
            }
            var group = [];
            for (i = 0, l = uniqueSelectors.length; i < l; i++) {
                var merged = ACSS_TRANSFORMED_RULE_compose(rules[0].mediaValue, uniqueSelectors[i], []);
                for (var j = 0, lenlen = rules.length; j < lenlen; j++) {
                    rule = rules[j];
                    if (rule && rule.selector === merged.selector) {
                        merged.css.push(rule.css);
                    }
                }
                merged.css = merged.css.join('\n');
                if (strTrim(merged.css).length > 0) {
                    group.push(merged);
                }
            }
            if (group.length > 0) {
                newMedia.push(group);
            }
        }
        return newMedia;
    }
    function ACSS_RULES_groupByMedia(rules) {
        var media = [];
        var group = [];
        for (var i = 0, l = rules.length; i < l; i++) {
            var rule = rules[i];
            var last = rules[i - 1];
            if (i === 0 || (last && last.mediaValue === rule.mediaValue)) {
                group.push(rule);
            }
            if (last && last.mediaValue !== rule.mediaValue) {
                media.push(group);
                group = [rule];
            }
            if (i === l - 1) {
                media.push(group);
            }
        }
        return media;
    }
    function ACSS_RULES_filterAndTransform(acss) {
        var rules = [];
        for (var i = 0, l = acss.rules.length; i < l; i++) {
            var rule = acss.rules[i];
            if (rule && rule.acssRule) {
                rules.push(ACSS_RULE_transform(acss, rule));
            }
        }
        return rules;
    }
    function ACSS_RULE_transform(acss, rule) {
        var css = Array.isArray(rule.acssRule.css) ? rule.acssRule.css : [rule.acssRule.css];
        var kv = '';
        for (var i = 0, l = css.length; i < l; i++) {
            kv = css[i];
            var j = kv.lastIndexOf('$');
            kv = kv.slice(0, j) + rule.arg + kv.slice(j + 1); // -------------> FILL ARGUMENT TO PLACE(S)
            css[i] = cssPROPERTY(kv, rule.important); // ---------------------> AUTOPREFIX
        }
        css = css.join('\n'); // ---------------------------------------------> JOIN
        var selector = '.' + acss.styleID + rule.pseudoClasses.join('') + rule.pseudoElements.join('');
        return ACSS_TRANSFORMED_RULE_compose(rule.mediaValue, selector, css);
    }
    function ACSS_TRANSFORMED_RULE_compose(mediaValue, selector, css) {
        return {
            mediaValue: mediaValue,
            selector: selector,
            css: css
        };
    }
    function BASE_CMD_generateElementHTMLStructure(selector, attributes) {
        var html = HTML_TEMPLATES[selector.tag];
        var modifiers = [];
        if (selector.id) {
            modifiers = modifiers.concat(['id="' + selector.id + '"']);
        }
        if (Array.isArray(selector.classes) && selector.classes.length > 0) {
            modifiers = modifiers.concat(['class="' + selector.classes.join(' ') + '"']);
        }
        if (Array.isArray(attributes) && attributes.length > 0) {
            var tmp = [];
            for (var i = 0, l = attributes.length; i < l; i++) {
                var attribute = attributes[i];
                if (attribute && attribute.html) {
                    tmp = tmp.concat(attribute.html.indexOf('$') >= 0 ? [attribute.html.replace('$', '"' + attribute.instructionValue + '"')] : [attribute.html]);
                }
            }
            if (tmp.length > 0) {
                modifiers = modifiers.concat(tmp.join(' '));
            }
        }
        if (data && typeof(data) === 'object') {
            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    modifiers = modifiers.concat(['data-' + k + "='" + JSON.stringify(data[k]) + "'"]);
                }
            }
        }
        modifiers = modifiers.length === 0 ? '' : (' ' + modifiers.join(' '));
        html = html.replace('[[modifiers]]', modifiers);
        html = html.replace('[[content]]', content);
        return html;
    }
    function cssPROPERTY(kv, important) { // AUTOPREFIXES CSS KEY-VALUE PAIR
        var autovendor = ['filter', 'appearance', 'column-count', 'column-gap', 'column-rule', 'display', 'transform', 'transform-style', 'transform-origin', 'transition', 'user-select', 'animation', 'perspective', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-play-state', 'opacity', 'background', 'background-image', 'font-smoothing', 'text-size-adjust', 'backface-visibility', 'box-sizing', 'overflow-scrolling'];
        kv = kv.replace(/\s{2,}/g, ' ');
        kv = kv[kv.length - 1] === ';' ? kv.slice(0, -1) : kv;
        kv = kv.split(/\s*:\s*/);
        var k = kv[0];
        var v = kv[1];
        important = important ? ' !important' : '';
        var sep = ': ';
        var del = ';';
        if (k && v) {
            if (autovendor.indexOf(k) === -1) {
                return k + sep + v + important + del;
            }
            else {
                var rows = [k + sep + v + important];
                if (k === 'opacity') {
                    var opacity = +(v.replace(/\s/g, ''));
                    if (isNaN(opacity)) {
                        return '';
                    }
                    rows.push('filter' + sep + 'alpha(opacity=' + Math.floor(opacity * 100) + ')' + important);
                }
                else if (k === 'font-smoothing') {
                    rows.push('-webkit-' + k + sep + v + important);
                    rows.push('-moz-osx-' + k + sep + v + important);
                }
                else if (k === 'background' || k === 'background-image') {
                    var g = '-gradient';
                    if (v.indexOf('linear' + g) >= 0 || v.indexOf('radial' + g) >= 0) {
                        rows.push('-webkit-' + k + sep + v + important);
                        rows.push('-moz-' + k + sep + v + important);
                        rows.push('-ms-' + k + sep + v + important);
                    }
                }
                else if (k === 'text-overflow') {
                    rows.push('-ms-' + k + sep + v + important);
                }
                else {
                    rows.push('-webkit-' + k + sep + v + important);
                    rows.push('-moz-' + k + sep + v + important);
                    if (k.indexOf('animation') === -1) { // SAME AS IN TOTAL.JS
                        rows.push('-ms-' + k + sep + v + important);
                    }
                }
                return rows.join(del + '\n') + del;
            }
        }
        else {
            return '';
        }
    }
    function clone(obj, skip) { // NO DATE AND FUNCTION CLONING
        if (!obj || typeof(obj) !== 'object') {
            return obj;
        }
        var o;
        var t;
        if (obj instanceof Array) {
            var len = obj.length;
            o = new Array(len);
            for (var i = 0; i < len; i++) {
                t = typeof(obj[i]);
                if (t !== 'object') {
                    if (t === 'function') {
                        continue;
                    }
                    o[i] = obj[i];
                    continue;
                }
                o[i] = clone(obj[i], skip);
            }
            return o;
        }
        o = {};
        for (var m in obj) {
            if (skip && skip[m]) {
                continue;
            }
            var val = obj[m];
            t = typeof(val);
            if (t !== 'object') {
                if (t === 'function') {
                    continue;
                }
                o[m] = val;
                continue;
            }
            o[m] = clone(obj[m], skip);
        }
        return o;
    }
    function extend(base, obj) {
        if (!base || !obj) {
            return base;
        }
        if (typeof(base) !== 'object' || typeof(obj) !== 'object') {
            return base;
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        var i = keys.length;
        while (i--) {
            var key = keys[i];
            base[key] = clone(obj[key]);
        }
        return base;
    }
    function arrFindIndex(arr, fn, value) {
        var isFN = typeof(fn) === 'function';
        var isV = value !== undefined;
        for (var i = 0, length = arr.length; i < length; i++) {
            if (isFN) {
                if (fn.call(arr, arr[i], i)) {
                    return i;
                }
                continue;
            }
            if (isV) {
                if (arr[i] && arr[i][fn] === value) {
                    return i;
                }
                continue;
            }
            if (arr[i] === fn) {
                return i;
            }
        }
        return -1;
    }
    function arrSortByNumberASC(arr, k) {
        var l = arr.length;
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < (l - i - 1); j++) {
                if (shouldSwap(arr[j], arr[j + 1], k)) {
                    var saved = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = saved;
                }
            }
        }
        return arr;
        function shouldSwap(a, b) {
            var va = k ? a[k] : a;
            var vb = k ? b[k] : b;
            return va > vb;
        }
    }
    function padStart(s, l, f) {
        l -= s.length;
        if (l < 0) {
            return s;
        }
        if (f === undefined) {
            f = ' ';
        }
        while (l--) {
            s = f + s;
        }
        return s;
    }
    function strFormatBySingleBrackets(str, args) {
        return str.replace(/\[\d+\]/g, function(text) {
            var value = args[+text.substring(1, text.length - 1)];
            return value === null ? '' : value;
        });
    }
    function strTrim(str) {
        return str.replace(/^\s+|\s+$/, '');
    }
    function typ(v) {
        return Object.prototype.toString.call(v);
    }
    function genStyleID() {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var b = '';
        for (var i = 0; i < 6; i++) {
            b += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return 'css-' + b;
    }
}
$export('<h>', h);
