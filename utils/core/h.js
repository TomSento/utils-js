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
exports.H = function(command, a, b) {
    /**
     * CONSTANTS
     */
    var REG_BASE_CMD_NO_SPACE_AT_START = /^\s/;
    var REG_BASE_CMD_NO_SPACE_AT_END = /\s$/;
    var REG_BASE_CMD_NO_SPACE_FOLLOWED_BY_COMMA = /\s,/;
    var REG_BASE_CMD_NO_MISSING_SPACE_AFTER_COMMA = /,\S/;
    var REG_BASE_CMD_NO_MULTIPLE_SPACES = /\s{2,}/;
    var REG_BASE_CMD_NO_MULTIPLE_COMMAS = /,\s*,/;
    var REG_BASE_CMD_NO_MULTIPLE_PIPES = /\|{2,}/;
    var REG_BASE_CMD_NO_SPACES_AROUND_PIPE = /(?:\s+\|)|(?:\|\s+)/;
    var REG_BASE_CMD_NO_PIPE_AT_END = /\|$/;
    var REG_BASE_CMD_NO_SPACE_AFTER_OPEN_PAREN = /\(\s/;
    var REG_BASE_CMD_NO_SPACE_BEFORE_CLOSE_PAREN = /\s\)/;

    var REG_BASE_CMD_IS_ACSS_MEDIA_QUERY_VAR = /^@/;
    var REG_BASE_CMD_IS_ACSS_VAR = /^--/;
    var REG_BASE_CMD_IS_METATAG = /^(Doc|Head|Meta|Title)(?![A-Za-z0-9_-])/;
    var REG_BASE_CMD_IS_BODYTAG = /^(A|Abbr|Address|Area|Article|Aside|Audio|B|Base|Bdi|Bdo|BlockQuote|Body|Br|Btn|Canvas|Caption|Cite|Code|Col|ColGroup|DataList|Dd|Del|Details|Dfn|Dialog|Div|Dl|Dt|Em|Embeded|FieldSet|FigCaption|Figure|Footer|Form|H1|H2|H3|H4|H5|H6|Header|Hr|I|Iframe|Img|Input|Ins|Kbd|Label|Legend|Li|Main|Map|Mark|Menu|MenuItem|Meter|Nav|NoScript|Object|Ol|OptGroup|Option|Output|P|Param|Picture|Pre|Progress|Q|Rp|Rt|Ruby|S|Samp|Script|Section|Select|Small|Source|Span|Strong|Sub|Summary|Sup|Svg|Table|Tbody|Td|Template|TextArea|TFoot|Th|THead|Time|Tr|Track|U|Ul|Var|Video|Wbr)(?![A-Za-z0-9_-])/; // https://www.w3schools.com/tags/default.asp

    var REG_BASE_CMD_SPLIT_BY_PIPE = /\|/;

    var REG_BASE_CMD_IS_PROBABLY_HTML_ATTRIBUTES_INSTRUCTIONS_STRING = /(?:^|\s)(?:Lang|Charset|Name|Property|HttpEquiv|Content|Chckd|Slctd|Readonly|Disabled)(?![A-Za-z0-9])/;
    var REG_BASE_CMD_IS_PROBABLY_ACSS_INSTUCTIONS_STRING = /(?:^|\s)(?:Anim|Animdel|Animdir|Animdur|Animfm|Animic|Animn|Animps|Animtf|Ap|Bd|Bdx|Bdy|Bdt|Bdend|Bdb|Bdstart|Bdc|Bdtc|Bdendc|Bdbc|Bdstartc|Bdsp|Bds|Bdts|Bdends|Bdbs|Bdstarts|Bdw|Bdtw|Bdendw|Bdbw|Bdstartw|Bdrs|Bdrstend|Bdrsbend|Bdrsbstart|Bdrststart|Bg|Bgi|Bgc|Bgcp|Bgo|Bgz|Bga|Bgp|Bgpx|Bgpy|Bgr|Bdcl|Bxz|Bxsh|Cl|C|Ctn|Cnt|Cur|D|Fil|Blur|Brightness|Contrast|Dropshadow|Grayscale|HueRotate|Invert|Opacity|Saturate|Sepia|Flx|Fx|Flxg|Fxg|Flxs|Fxs|Flxb|Fxb|As|Fld|Fxd|Flf|Fxf|Ai|Ac|Or|Jc|Flw|Fxw|Fl|Ff|Fw|Fz|Fs|Fv|H|Hy|Lts|List|Lisp|Lisi|Lh|M|Mx|My|Mt|Mend|Mb|Mstart|Mah|Maw|Mih|Miw|O|T|End|B|Start|Op|Ov|Ovx|Ovy|Ovs|P|Px|Py|Pt|Pend|Pb|Pstart|Pe|Pos|Rsz|Tbl|Ta|Tal|Td|Ti|Tov|Tren|Tr|Tt|Tsh|Trf|Trfo|Trfs|Prs|Prso|Bfv|Matrix|Matrix3d|Rotate|Rotate3d|RotateX|RotateY|RotateZ|Scale|Scale3d|ScaleX|ScaleY|Skew|SkewX|SkewY|Translate|Translate3d|TranslateX|TranslateY|TranslateZ|Trs|Trsde|Trsdu|Trsp|Trstf|Us|Va|V|Whs|Whsc|W|Wob|Wow|Z|Fill|Stk|Stkw|Stklc|Stklj)(?![A-Za-z0-9])/; // LAST CLOSURE IS NEEDED, OTHERWISE Stkljaaaa WOULD MATCH

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
    var REG_HTML_ATTRIBUTES_INSTRUCTIONS_STRING_MATCH_INSTRUCTION_STRINGS = /\S+/g;
    var REG_HTML_ATTRIBUTES_INSTRUCTION_STRING_MATCH_COMPONENTS = /([^\s(]+)\((.*)\)/;
    var REG_HTML_ATTRIBUTES_INSTRUCTION_VALUE_NO_UNALLOWED_CHAR = /[()]/;

    var REG_ACSS_MEDIA_QUERY_VAR_CMD_MATCH_COMPONENTS = /^@(\S+): (\d+)px(?!.)/;
    var REG_ACSS_MEDIA_QUERY_VAR_KEY_NO_UNALLOWED_CHAR = /[^a-z]/;
    var REG_ACSS_INSTRUCTIONS_STRING_NO_MISSING_SPACE_BETWEEN_INSTRUCTIONS = /\)\S*\(/;
    var REG_ACSS_INSTRUCTIONS_STRING_MATCH_INSTRUCTION_STRINGS = /\S*\(.*?\)\S*/g;
    // https://regex101.com/r/tIaCUX/20 - MATCH ACSS INSTRUCTION COMPONENTS - WITH COMBINATOR - TEST
    // https://regex101.com/r/D7wlXm/20 - MATCH ACSS INSTRUCTION COMPONENTS - WITH COMBINATOR
    var REG_ACSS_INSTRUCTION_STRING_MATCH_COMPONENTS = /^([^:_>+()!@]+)\(([^()]*)\)((?=!)!|)((?=:[^:_>+()!@])(?::[^:_>+()!@]+)+|)((?=::[^:_>+()!@])(?:::[^:_>+()!@]+)+|)((?=@[^:_>+()!@])@[^:_>+()!@]+|)$/;
    var REG_ACSS_INSTRUCTION_VALUE_SPLIT_ARGUMENTS = /\s*,+\s*/g;
    // https://regex101.com/r/Mcr8Np/17 - MATCH NEXT ACSS COLOR - TEST
    // https://regex101.com/r/dJsNNd/13 -  MATCH NEXT ACSS COLOR - JS
    var REG_ACSS_INSTRUCTION_VALUE_MATCH_NEXT_COLOR = /(^|\s|,)(?=#)(?:#([^.,\s]+))((?=\.)\.[^#,\s]*|)(?:\s|,|$)+/;
    var REG_ACSS_COLOR_HEX_NO_LOWERCASED_LETTER = /[a-z]/;
    var REG_ACSS_COLOR_HEX_NO_INVALID_HEX_VALUE = /[^0-9A-F]/;
    var REG_ACSS_COLOR_HEX_TO_RGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i; // https://github.com/acss-io/atomizer/blob/1bd685fe5970af5d1984f96ecfccd5df37e4601f/src/lib/utils.js#L10
    var REG_ACSS_MATCH_PSEUDO_CLASSES = /(?=:)(:[^:]+)/g;
    var REG_ACSS_MATCH_PSEUDO_ELEMENTS = /(?=::)(::[^:]+)/g;

    var HTML_TEMPLATES = {
        Doc: '<!DOCTYPE html><html{modifiers}>{content}</html>',
        Head: '<head>{content}</head>',
        Meta: '<meta{modifiers}>',
        Title: '<title>{content}</title>',
        Div: '<div{modifiers}>{content}</div>',
        Span: '<span{modifiers}>{content}</span>',
        Input: '<input{modifiers}>',
        Select: '<select{modifiers}>{content}</select>',
        Option: '<option{modifiers}>{content}</option>'
    };
    var HTML_ATTRIBUTES = {
        Doc: [{
            name: 'Language',
            func: 'Lang',
            allowArgument: true,
            html: 'lang={0}'
        }],
        Meta: [{ // MANDATORY ORDER
            name: 'Charset',
            func: 'Charset',
            allowArgument: true,
            html: 'charset={0}'
        }, {
            name: 'Name',
            func: 'Name',
            allowArgument: true,
            html: 'name={0}'
        }, {
            name: 'Property',
            func: 'Property',
            allowArgument: true,
            html: 'property={0}'
        }, {
            name: 'HttpEquiv',
            func: 'HttpEquiv',
            allowArgument: true,
            html: 'http-equiv={0}'
        }, {
            name: 'Content',
            func: 'Content',
            allowArgument: true,
            html: 'content={0}'
        }],
        Input: [{
            name: 'Checked',
            func: 'Chckd',
            allowArgument: false,
            html: 'checked'
        }, {
            name: 'Readonly',
            func: 'Readonly',
            allowArgument: false,
            html: 'readonly'
        }, {
            name: 'Disabled',
            func: 'Disabled',
            allowArgument: false,
            html: 'disabled'
        }],
        Select: [{
            name: 'Disabled',
            func: 'Disabled',
            allowArgument: false,
            html: 'disabled'
        }],
        Option: [{
            name: 'Selected',
            func: 'Slctd',
            allowArgument: false,
            html: 'selected'
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

    var ACSS_RULES = [{
        name: 'Line clamp',
        func: 'LineClamp', // https://github.com/acss-io/atomizer/blob/master/src/helpers.js#L267
        styles: {
            '-webkit-line-clamp': '[0]',
            'max-height': '[1]',
            'display': '-webkit-box',
            '-webkit-box-orient': 'vertical',
            'overflow': 'hidden',
            '@supports (display:-moz-box)': [
                'display:block'
            ]
        },
        rules: {
            'a': [
                'display:inline-block',
                'display:-webkit-box',
                '*display:inline',
                'zoom:1'
            ],
            'a:after': [
                'content:"."',
                'font-size:0',
                'visibility:hidden',
                'display:inline-block', /* 1 */
                'overflow:hidden', /* 1 */
                'height:0', /* 1 */
                'width:0' /* 1 */
            ]
        },
        allowArguments: true,
        type: 'HELPER'
    }, { // MANDATORY ORDER
        name: 'Animation',
        func: 'Anim',
        css: 'animation:$',
        type: 'RULE'
    }, {
        name: 'Animation delay',
        func: 'Animdel',
        css: 'animation-delay:$',
        type: 'RULE'
    }, {
        name: 'Animation direction',
        func: 'Animdir',
        css: 'animation-direction:$',
        expanders: {
            a: 'alternate',
            ar: 'alternate-reverse',
            n: 'normal',
            r: 'reverse'
        },
        type: 'RULE'
    }, {
        name: 'Animation duration',
        func: 'Animdur',
        css: 'animation-duration:$',
        type: 'RULE'
    }, {
        name: 'Animation fill mode',
        func: 'Animfm',
        css: 'animation-fill-mode:$',
        expanders: {
            b: 'backwards',
            bo: 'both',
            f: 'forwards',
            n: 'none'
        },
        type: 'RULE'
    }, {
        name: 'Animation iteration count',
        func: 'Animic',
        css: 'animation-iteration-count:$',
        expanders: {
            i: 'infinite'
        },
        type: 'RULE'
    }, {
        name: 'Animation name',
        func: 'Animn',
        css: 'animation-name:$',
        expanders: {
            n: 'none'
        },
        type: 'RULE'
    }, {
        name: 'Animation play state',
        func: 'Animps',
        css: 'animation-play-state:$',
        expanders: {
            p: 'paused',
            r: 'running'
        },
        type: 'RULE'
    }, {
        name: 'Animation timing function',
        func: 'Animtf',
        css: 'animation-timing-function:$',
        expanders: {
            e: 'ease',
            ei: 'ease-in',
            eo: 'ease-out',
            eio: 'ease-in-out',
            l: 'linear',
            se: 'step-end',
            ss: 'step-start'
        },
        type: 'RULE'
    }, {
        name: 'Appearance',
        func: 'Ap',
        css: 'appearance:$',
        expanders: {
            a: 'auto',
            n: 'none'
        },
        type: 'RULE'
    }, {
        name: 'Border',
        func: 'Bd',
        css: 'border:$',
        expanders: {
            n: 'none'
        },
        type: 'RULE'
    }, {
        name: 'Border X',
        func: 'Bdx',
        css: [
            'border-left:$',
            'border-right:$'
        ],
        type: 'RULE'
    }, {
        name: 'Border Y',
        func: 'Bdy',
        css: [
            'border-top:$',
            'border-bottom:$'
        ],
        type: 'RULE'
    }, {
        name: 'Border top',
        func: 'Bdt',
        css: 'border-top:$',
        type: 'RULE'
    }, {
        name: 'Border right',
        func: 'Bdright',
        css: 'border-right:$',
        type: 'RULE'
    }, {
        name: 'Border bottom',
        func: 'Bdb',
        css: 'border-bottom:$',
        type: 'RULE'
    }, {
        name: 'Border left',
        func: 'Bdleft',
        css: 'border-left:$',
        type: 'RULE'
    }, {
        name: 'Border color',
        func: 'Bdc',
        css: 'border-color:$',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: 'RULE'
    }, {
        name: 'Border top color',
        func: 'Bdtc',
        css: 'border-top-color:$',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: 'RULE'
    }, {
        name: 'Border right color',
        func: 'Bdrightc',
        css: 'border-right-color:$',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: 'RULE'
    }, {
        name: 'Border bottom color',
        func: 'Bdbc',
        css: 'border-bottom-color:$',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: 'RULE'
    }, {
        name: 'Border left color',
        func: 'Bdleftc',
        css: 'border-left-color:$',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: 'RULE'
    }, {
        name: 'Border spacing',
        func: 'Bdsp',
        css: 'border-spacing:$',
        type: 'RULE'
    }, {
        name: 'Border style',
        func: 'Bds',
        css: 'border-style:$',
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
        type: 'RULE'
    }, {
        name: 'Border top style',
        func: 'Bdts',
        css: 'border-top-style:$',
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
        type: 'RULE'
    }, {
        name: 'Border right style',
        func: 'Bdrights',
        css: 'border-right-style:$',
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
        type: 'RULE'
    }, {
        name: 'Border bottom style',
        func: 'Bdbs',
        css: 'border-bottom-style:$',
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
        type: 'RULE'
    }, {
        name: 'Border left style',
        func: 'Bdlefts',
        css: 'border-left-style:$',
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
        type: 'RULE'
    }, {
        name: 'Border width',
        func: 'Bdw',
        css: 'border-width:$',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: 'RULE'
    }, {
        name: 'Border top width',
        func: 'Bdtw',
        css: 'border-top-width:$',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: 'RULE'
    }, {
        name: 'Border right width',
        func: 'Bdrightw',
        css: 'border-right-width:$',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: 'RULE'
    }, {
        name: 'Border bottom width',
        func: 'Bdbw',
        css: 'border-bottom-width:$',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: 'RULE'
    }, {
        name: 'Border left width',
        func: 'Bdleftw',
        css: 'border-left-width:$',
        expanders: {
            m: 'medium',
            t: 'thin',
            th: 'thick'
        },
        type: 'RULE'
    }, {
        name: 'Border radius',
        func: 'Bdrs',
        css: 'border-radius:$',
        type: 'RULE'
    }, {
        name: 'Border radius top right',
        func: 'Bdrstright',
        css: 'border-top-right-radius:$',
        type: 'RULE'
    }, {
        name: 'Border radius bottom right',
        func: 'Bdrsbright',
        css: 'border-bottom-right-radius:$',
        type: 'RULE'
    }, {
        name: 'Border radius bottom left',
        func: 'Bdrsbleft',
        css: 'border-bottom-left-radius:$',
        type: 'RULE'
    }, {
        name: 'Border radius top left',
        func: 'Bdrstleft',
        css: 'border-top-left-radius:$',
        type: 'RULE'
    }, {
        name: 'Background',
        func: 'Bg',
        css: 'background:$',
        expanders: {
            n: 'none',
            t: 'transparent'
        },
        type: 'RULE'
    }, {
        name: 'Background image',
        func: 'Bgi',
        css: 'background-image:$',
        expanders: {
            n: 'none'
        },
        type: 'RULE'
    }, {
        name: 'Background color',
        func: 'Bgc',
        css: 'background-color:$',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: 'RULE'
    }, {
        name: 'Background clip',
        func: 'Bgcp',
        css: 'background-clip:$',
        expanders: {
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        },
        type: 'RULE'
    }, {
        name: 'Background origin',
        func: 'Bgo',
        css: 'background-origin:$',
        expanders: {
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        },
        type: 'RULE'
    }, {
        name: 'Background size',
        func: 'Bgz',
        css: 'background-size:$',
        expanders: {
            a: 'auto',
            ct: 'contain',
            cv: 'cover'
        },
        type: 'RULE'
    }, {
        name: 'Background attachment',
        func: 'Bga',
        css: 'background-attachment:$',
        expanders: {
            f: 'fixed',
            l: 'local',
            s: 'scroll'
        },
        type: 'RULE'
    }, {
        name: 'Background position',
        func: 'Bgp',
        css: 'background-position:$',
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
        type: 'RULE'
    }, {
        name: 'Background position (X axis)',
        func: 'Bgpx',
        css: 'background-position-x:$',
        expanders: {
            left: 'left',
            right: 'right',
            c: '50%'
        },
        type: 'RULE'
    }, {
        name: 'Background position (Y axis)',
        func: 'Bgpy',
        css: 'background-position-y:$',
        expanders: {
            t: '0',
            b: '100%',
            c: '50%'
        },
        type: 'RULE'
    }, {
        name: 'Background repeat',
        func: 'Bgr',
        css: 'background-repeat:$',
        expanders: {
            nr: 'no-repeat',
            rx: 'repeat-x',
            ry: 'repeat-y',
            r: 'repeat',
            s: 'space',
            ro: 'round'
        },
        type: 'RULE'
    }, {
        name: 'Border collapse',
        func: 'Bdcl',
        css: 'border-collapse:$',
        expanders: {
            c: 'collapse',
            s: 'separate'
        },
        type: 'RULE'
    }, {
        name: 'Box sizing',
        func: 'Bxz',
        css: 'box-sizing:$',
        expanders: {
            cb: 'content-box',
            pb: 'padding-box',
            bb: 'border-box'
        },
        type: 'RULE'
    }, {
        name: 'Box shadow',
        func: 'Bxsh',
        css: 'box-shadow:$',
        expanders: {
            n: 'none'
        },
        type: 'RULE'
    }, {
        name: 'Clear',
        func: 'Cl',
        css: 'clear:$',
        expanders: {
            n: 'none',
            b: 'both'
        },
        type: 'RULE'
    }, {
        name: 'Color',
        func: 'C',
        css: 'color:$',
        expanders: ACSS_COLOR_ARGUMENTS,
        type: 'RULE'
    }, {
        name: 'Content',
        func: 'Cnt',
        css: 'content:$',
        expanders: {
            n: 'none',
            nor: 'normal',
            oq: 'open-quote',
            cq: 'close-quote',
            noq: 'no-open-quote',
            ncq: 'no-close-quote'
        },
        type: 'RULE'
    }, {
        name: 'Cursor',
        func: 'Cur',
        css: 'cursor:$',
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
        type: 'RULE'
    }, {
        name: 'Display',
        func: 'D',
        css: 'display:$',
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
        }
    }, {
        name: 'Filter',
        func: 'Fil',
        css: 'filter:$',
        expanders: {
            n: 'none'
        }
    }, {
        name: 'Blur (filter)',
        func: 'Blur',
        css: 'filter:blur($)'
    }, {
        name: 'Brightness (filter)',
        func: 'Brightness',
        css: 'filter:brightness($)'
    }, {
        name: 'Contrast (filter)',
        func: 'Contrast',
        css: 'filter:contrast($)'
    }, {
        name: 'Drop shadow (filter)',
        func: 'Dropshadow',
        css: 'filter:drop-shadow($)'
    }, {
        name: 'Grayscale (filter)',
        func: 'Grayscale',
        css: 'filter:grayscale($)'
    }, {
        name: 'Hue Rotate (filter)',
        func: 'HueRotate',
        css: 'filter:hue-rotate($)'
    }, {
        name: 'Invert (filter)',
        func: 'Invert',
        css: 'filter:invert($)'
    }, {
        name: 'Opacity (filter)',
        func: 'Opacity',
        css: 'filter:opacity($)'
    }, {
        name: 'Saturate (filter)',
        func: 'Saturate',
        css: 'filter:saturate($)'
    }, {
        name: 'Sepia (filter)',
        func: 'Sepia',
        css: 'filter:sepia($)'
    }, {
        name: 'Flex (deprecated)',
        func: 'Flx',
        css: 'flex:$',
        expanders: {
            a: 'auto',
            n: 'none'
        }
    }, {
        name: 'Flex',
        func: 'Fx',
        css: 'flex:$',
        expanders: {
            a: 'auto',
            n: 'none'
        }
    }, {
        name: 'Flex grow (deprecated)',
        func: 'Flxg',
        css: 'flex-grow:$'
    }, {
        name: 'Flex grow',
        func: 'Fxg',
        css: 'flex-grow:$'
    }, {
        name: 'Flex shrink (deprecated)',
        func: 'Flxs',
        css: 'flex-shrink:$'
    }, {
        name: 'Flex shrink',
        func: 'Fxs',
        css: 'flex-shrink:$'
    }, {
        name: 'Flex basis (deprecated)',
        func: 'Flxb',
        css: 'flex-basis:$',
        expanders: {
            a: 'auto',
            n: 'none'
        }
    }, {
        name: 'Flex basis',
        func: 'Fxb',
        css: 'flex-basis:$',
        expanders: {
            a: 'auto',
            n: 'none'
        }
    }, {
        name: 'Align self',
        func: 'As',
        css: 'align-self:$',
        expanders: {
            a: 'auto',
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            b: 'baseline',
            st: 'stretch'
        }
    }, {
        name: 'Flex direction (deprecated)',
        func: 'Fld',
        css: 'flex-direction:$',
        expanders: {
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse'
        }
    }, {
        name: 'Flex direction',
        func: 'Fxd',
        css: 'flex-direction:$',
        expanders: {
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse'
        }
    }, {
        name: 'Flex flow (deprecated)',
        func: 'Flf',
        css: 'flex-flow:$',
        expanders: {
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse',
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }
    }, {
        name: 'Flex flow',
        func: 'Fxf',
        css: 'flex-flow:$',
        expanders: {
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse',
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }
    }, {
        name: 'Align items',
        func: 'Ai',
        css: 'align-items:$',
        expanders: {
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            b: 'baseline',
            st: 'stretch'
        }
    }, {
        name: 'Align content',
        func: 'Ac',
        css: 'align-content:$',
        expanders: {
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            sb: 'space-between',
            sa: 'space-around',
            st: 'stretch'
        }
    }, {
        name: 'Order',
        func: 'Or',
        css: 'order:$'
    }, {
        name: 'Justify content',
        func: 'Jc',
        css: 'justify-content:$',
        expanders: {
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            sb: 'space-between',
            sa: 'space-around'
        }
    }, {
        name: 'Flex-wrap (deprecated)',
        func: 'Flw',
        css: 'flex-wrap:$',
        expanders: {
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }
    }, {
        name: 'Flex-wrap',
        func: 'Fxw',
        css: 'flex-wrap:$',
        expanders: {
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }
    }, {
        name: 'Float',
        func: 'Fl',
        css: 'float:$',
        expanders: {
            n: 'none'
        }
    }, {
        name: 'Font family',
        func: 'Ff',
        css: 'font-family:$',
        expanders: {
            c: '"Monotype Corsiva", "Comic Sans MS", cursive',
            f: 'Capitals, Impact, fantasy',
            m: 'Monaco, "Courier New", monospace',
            s: 'Georgia, "Times New Roman", serif',
            ss: 'Helvetica, Arial, sans-serif'
        }
    }, {
        name: 'Font weight',
        func: 'Fw',
        css: 'font-weight:$',
        expanders: {
            b: 'bold',
            br: 'bolder',
            lr: 'lighter',
            n: 'normal'
        }
    }, {
        name: 'Font size',
        func: 'Fz',
        css: 'font-size:$'
    }, {
        name: 'Font style',
        func: 'Fs',
        css: 'font-style:$',
        expanders: {
            n: 'normal',
            i: 'italic',
            o: 'oblique'
        }
    }, {
        name: 'Font variant',
        func: 'Fv',
        css: 'font-variant:$',
        expanders: {
            n: 'normal',
            sc: 'small-caps'
        }
    }, {
        name: 'Height',
        func: 'H',
        css: 'height:$',
        expanders: {
            a: 'auto',
            av: 'available',
            bb: 'border-box',
            cb: 'content-box',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        }
    }, {
        name: 'Hyphens',
        func: 'Hy',
        css: 'hyphens:$',
        expanders: {
            a: 'auto',
            n: 'normal',
            m: 'manual'
        }
    }, {
        name: 'Letter spacing',
        func: 'Lts',
        css: 'letter-spacing:$',
        expanders: {
            n: 'normal'
        }
    }, {
        name: 'List style type',
        func: 'List',
        css: 'list-style-type:$',
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
        }
    }, {
        name: 'List style position',
        func: 'Lisp',
        css: 'list-style-position:$',
        expanders: {
            i: 'inside',
            o: 'outside'
        }
    }, {
        name: 'List style image',
        func: 'Lisi',
        css: 'list-style-image:$',
        expanders: {
            n: 'none'
        }
    }, {
        name: 'Line height',
        func: 'Lh',
        css: 'line-height:$',
        expanders: {
            n: 'normal'
        }
    }, {
        name: 'Margin (all edges)',
        func: 'M',
        css: 'margin:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Margin (X axis)',
        func: 'Mx',
        css: [
            'margin-left:$',
            'margin-right:$'
        ],
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Margin (Y axis)',
        func: 'My',
        css: [
            'margin-top:$',
            'margin-bottom:$'
        ],
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Margin top',
        func: 'Mt',
        css: 'margin-top:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Margin right',
        func: 'Mright',
        css: 'margin-right:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Margin bottom',
        func: 'Mb',
        css: 'margin-bottom:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Margin left',
        func: 'Mleft',
        css: 'margin-left:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Max height',
        func: 'Mah',
        css: 'max-height:$',
        expanders: {
            a: 'auto',
            maxc: 'max-content',
            minc: 'min-content',
            fa: 'fill-available',
            fc: 'fit-content'
        }
    }, {
        name: 'Max width',
        func: 'Maw',
        css: 'max-width:$',
        expanders: {
            n: 'none',
            fa: 'fill-available',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        }
    }, {
        name: 'Min height',
        func: 'Mih',
        css: 'min-height:$',
        expanders: {
            a: 'auto',
            fa: 'fill-available',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        }
    }, {
        name: 'Min width',
        func: 'Miw',
        css: 'min-width:$',
        expanders: {
            a: 'auto',
            fa: 'fill-available',
            fc: 'fit-content',
            ini: 'initial',
            maxc: 'max-content',
            minc: 'min-content'
        }
    }, {
        name: 'Outline',
        func: 'O',
        css: 'outline:$',
        expanders: {
            n: 'none'
        }
    }, {
        name: 'Top',
        func: 'T',
        css: 'top:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Right',
        func: 'Right',
        css: 'right:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Bottom',
        func: 'B',
        css: 'bottom:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Left',
        func: 'Left',
        css: 'left:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Opacity',
        func: 'Op',
        css: 'opacity:$'
    }, {
        name: 'Overflow',
        func: 'Ov',
        css: 'overflow:$',
        expanders: {
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        }
    }, {
        name: 'Overflow (X axis)',
        func: 'Ovx',
        css: 'overflow-x:$',
        expanders: {
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        }
    }, {
        name: 'Overflow (Y axis)',
        func: 'Ovy',
        css: 'overflow-y:$',
        expanders: {
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        }
    }, {
        name: 'Overflow scrolling',
        func: 'Ovs',
        css: '-webkit-overflow-scrolling:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Padding (all edges)',
        func: 'P',
        css: 'padding:$'
    }, {
        name: 'Padding (X axis)',
        func: 'Px',
        css: [
            'padding-left:$',
            'padding-right:$'
        ]
    }, {
        name: 'Padding (Y axis)',
        func: 'Py',
        css: [
            'padding-top:$',
            'padding-bottom:$'
        ]
    }, {
        name: 'Padding top',
        func: 'Pt',
        css: 'padding-top:$'
    }, {
        name: 'Padding right',
        func: 'Pright',
        css: 'padding-right:$'
    }, {
        name: 'Padding bottom',
        func: 'Pb',
        css: 'padding-bottom:$'
    }, {
        name: 'Padding left',
        func: 'Pleft',
        css: 'padding-left:$'
    }, {
        name: 'Pointer events',
        func: 'Pe',
        css: 'pointer-events:$',
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
        }
    }, {
        name: 'Position',
        func: 'Pos',
        css: 'position:$',
        expanders: {
            a: 'absolute',
            f: 'fixed',
            r: 'relative',
            s: 'static',
            st: 'sticky'
        }
    }, {
        name: 'Resize',
        func: 'Rsz',
        css: 'resize:$',
        expanders: {
            n: 'none',
            b: 'both',
            h: 'horizontal',
            v: 'vertical'
        }
    }, {
        name: 'Table layout',
        func: 'Tbl',
        css: 'table-layout:$',
        expanders: {
            a: 'auto',
            f: 'fixed'
        }
    }, {
        name: 'Text align',
        func: 'Ta',
        css: 'text-align:$',
        expanders: {
            c: 'center',
            e: 'end',
            j: 'justify',
            mp: 'match-parent',
            s: 'start'
        }
    }, {
        name: 'Text align last',
        func: 'Tal',
        css: 'text-align-last:$',
        expanders: {
            a: 'auto',
            c: 'center',
            e: 'end',
            j: 'justify',
            s: 'start'
        }
    }, {
        name: 'Text decoration',
        func: 'Td',
        css: 'text-decoration:$',
        expanders: {
            lt: 'line-through',
            n: 'none',
            o: 'overline',
            u: 'underline'
        }
    }, {
        name: 'Text indent',
        func: 'Ti',
        css: 'text-indent:$'
    }, {
        name: 'Text overflow',
        func: 'Tov',
        css: 'text-overflow:$',
        expanders: {
            c: 'clip',
            e: 'ellipsis'
        }
    }, {
        name: 'Text rendering',
        func: 'Tren',
        css: 'text-rendering:$',
        expanders: {
            a: 'auto',
            os: 'optimizeSpeed',
            ol: 'optimizeLegibility',
            gp: 'geometricPrecision'
        }
    }, {
        name: 'Text replace',
        func: 'Tr',
        css: 'text-replace:$',
        expanders: {
            n: 'none'
        }
    }, {
        name: 'Text transform',
        func: 'Tt',
        css: 'text-transform:$',
        expanders: {
            n: 'none',
            c: 'capitalize',
            u: 'uppercase',
            l: 'lowercase'
        }
    }, {
        name: 'Text shadow',
        func: 'Tsh',
        css: 'text-shadow:$',
        expanders: {
            n: 'none'
        }
    }, {
        name: 'Transform',
        func: 'Trf',
        css: 'transform:$'
    }, {
        name: 'Transform origin',
        func: 'Trfo',
        css: 'transform-origin:$ {1}',
        expanders: {
            t: 'top',
            c: 'center'
        }
    }, {
        name: 'Transform style',
        func: 'Trfs',
        css: 'transform-style:$',
        expanders: {
            f: 'flat',
            p: 'preserve-3d'
        }
    }, {
        name: 'Perspective',
        func: 'Prs',
        css: 'perspective:$',
        expanders: {
            n: 'none'
        }
    }, {
        name: 'Perspective origin',
        func: 'Prso',
        css: 'perspective-origin:$ {1}',
        expanders: {
            t: 'top',
            c: 'center'
        }
    }, {
        name: 'Backface visibility',
        func: 'Bfv',
        css: 'backface-visibility:$',
        expanders: {
            h: 'hidden',
            v: 'visible'
        }
    }, {
        name: 'Matrix (transform)',
        func: 'Matrix',
        css: 'transform:matrix($)'
    }, {
        name: 'Matrix 3d (transform)',
        func: 'Matrix3d',
        css: 'transform:matrix($)'
    }, {
        name: 'Rotate (transform)',
        func: 'Rotate',
        css: 'transform:rotate($)'
    }, {
        name: 'Rotate 3d (transform)',
        func: 'Rotate3d',
        css: 'transform:rotate3d($,{1},{2},{3})'
    }, {
        name: 'RotateX (transform)',
        func: 'RotateX',
        css: 'transform:rotateX($)'
    }, {
        name: 'RotateY (transform)',
        func: 'RotateY',
        css: 'transform:rotateY($)'
    }, {
        name: 'RotateZ (transform)',
        func: 'RotateZ',
        css: 'transform:rotateZ($)'
    }, {
        name: 'Scale (transform)',
        func: 'Scale',
        css: 'transform:scale($,{1})'
    }, {
        name: 'Scale 3d (transform)',
        func: 'Scale3d',
        css: 'transform:scale3d($,{1},{2})'
    }, {
        name: 'ScaleX (transform)',
        func: 'ScaleX',
        css: 'transform:scaleX($)'
    }, {
        name: 'ScaleY (transform)',
        func: 'ScaleY',
        css: 'transform:scaleY($)'
    }, {
        name: 'Skew (transform)',
        func: 'Skew',
        css: 'transform:skew($,{1})'
    }, {
        name: 'SkewX (transform)',
        func: 'SkewX',
        css: 'transform:skewX($)'
    }, {
        name: 'SkewY (transform)',
        func: 'SkewY',
        css: 'transform:skewY($)'
    }, {
        name: 'Translate (transform)',
        func: 'Translate',
        css: 'transform:translate($,{1})'
    }, {
        name: 'Translate 3d (transform)',
        func: 'Translate3d',
        css: 'transform:translate3d($,{1},{2})'
    }, {
        name: 'Translate X (transform)',
        func: 'TranslateX',
        css: 'transform:translateX($)'
    }, {
        name: 'Translate Y (transform)',
        func: 'TranslateY',
        css: 'transform:translateY($)'
    }, {
        name: 'Translate Z (transform)',
        func: 'TranslateZ',
        css: 'transform:translateZ($)'
    }, {
        name: 'Transition',
        func: 'Trs',
        css: 'transition:$'
    }, {
        name: 'Transition delay',
        func: 'Trsde',
        css: 'transition-delay:$',
        expanders: {
            i: 'initial'
        }
    }, {
        name: 'Transition duration',
        func: 'Trsdu',
        css: 'transition-duration:$'
    }, {
        name: 'Transition property',
        func: 'Trsp',
        css: 'transition-property:$',
        expanders: {
            a: 'all'
        }
    }, {
        name: 'Transition timing function',
        func: 'Trstf',
        css: 'transition-timing-function:$',
        expanders: {
            e: 'ease',
            ei: 'ease-in',
            eo: 'ease-out',
            eio: 'ease-in-out',
            l: 'linear',
            ss: 'step-start',
            se: 'step-end'
        }
    }, {
        name: 'User select',
        func: 'Us',
        css: 'user-select:$',
        expanders: {
            a: 'all',
            el: 'element',
            els: 'elements',
            n: 'none',
            t: 'text',
            to: 'toggle'
        }
    }, {
        name: 'Vertical align',
        func: 'Va',
        css: 'vertical-align:$',
        expanders: {
            b: 'bottom',
            bl: 'baseline',
            m: 'middle',
            sub: 'sub',
            sup: 'super',
            t: 'top',
            tb: 'text-bottom',
            tt: 'text-top'
        }
    }, {
        name: 'Visibility',
        func: 'V',
        css: 'visibility:$',
        expanders: {
            v: 'visible',
            h: 'hidden',
            c: 'collapse'
        }
    }, {
        name: 'White space',
        func: 'Whs',
        css: 'white-space:$',
        expanders: {
            n: 'normal',
            p: 'pre',
            nw: 'nowrap',
            pw: 'pre-wrap',
            pl: 'pre-line'
        }
    }, {
        name: 'White space collapse',
        func: 'Whsc',
        css: 'white-space-collapse:$',
        expanders: {
            n: 'normal',
            ka: 'keep-all',
            l: 'loose',
            bs: 'break-strict',
            ba: 'break-all'
        }
    }, {
        name: 'Width',
        func: 'W',
        css: 'width:$',
        expanders: {
            a: 'auto',
            bb: 'border-box',
            cb: 'content-box',
            av: 'available',
            minc: 'min-content',
            maxc: 'max-content',
            fc: 'fit-content'
        }
    }, {
        name: 'Word break',
        func: 'Wob',
        css: 'word-break:$',
        expanders: {
            ba: 'break-all',
            ka: 'keep-all',
            n: 'normal'
        }
    }, {
        name: 'Word wrap',
        func: 'Wow',
        css: 'word-wrap:$',
        expanders: {
            bw: 'break-word',
            n: 'normal'
        }
    }, {
        name: 'Z index',
        func: 'Z',
        css: 'z-index:$',
        expanders: {
            a: 'auto'
        }
    }, {
        name: 'Fill (SVG)',
        func: 'Fill',
        css: 'fill:$',
        expanders: ACSS_COLOR_ARGUMENTS
    }, {
        name: 'Stroke (SVG)',
        func: 'Stk',
        css: 'stroke:$',
        expanders: ACSS_COLOR_ARGUMENTS
    }, {
        name: 'Stroke width (SVG)',
        func: 'Stkw',
        css: 'stroke-width:$'
    }, {
        name: 'Stroke linecap (SVG)',
        func: 'Stklc',
        css: 'stroke-linecap:$',
        expanders: {
            b: 'butt',
            r: 'round',
            s: 'square'
        }
    }, {
        name: 'Stroke linejoin (SVG)',
        func: 'Stklj',
        css: 'stroke-linejoin:$',
        expanders: {
            b: 'bevel',
            r: 'round',
            m: 'miter'
        }
    }];

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
    command = command instanceof RegExp ? command.toString().slice(1, -1) : command;
    if (!command || typeof(command) !== 'string') {
        throw new Error('invalidParameter');
    }
    var data = a && b ? a : null;
    data = (data && typeof(data) === 'object') ? JSON.stringify(data) : data;
    data = data ? ('' + data) : '';
    var content = a && b ? (b || '') : (a || '');
    content = Array.isArray(content) ? content.join('') : content;
    if (typeof(content) !== 'string') {
        throw new Error('invalidParameter');
    }
    var err = BASE_CMD_validate(command);
    if (err) {
        throw err;
    }
    else {
        return BASE_CMD_process(command, data, content);
    }

    function BASE_CMD_validate(v) {
        return validateAll(v, [
            BASE_CMD_noSpaceAtStart,
            BASE_CMD_noSpaceAtEnd,
            BASE_CMD_noSpaceFollowedByComma,
            BASE_CMD_noMissingSpaceAfterComma,
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
    function BASE_CMD_noMissingSpaceAfterComma(v) {
        if (REG_BASE_CMD_NO_MISSING_SPACE_AFTER_COMMA.test(v)) {
            return new Error('Base command - No missing space after comma.');
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
    function BASE_CMD_process(cmd, data, content) {
        ACSS_MEDIA_QUERY_VAR_setDefault();
        data = BASE_CMD_parse(cmd, data, content);
    }
    function BASE_CMD_parse(cmd) {
        var type = BASE_CMD_GET_TYPE(cmd);
        if (type === BASE_CMD_TYPE_ACSS_MEDIA_QUERY_VAR()) {
            return ACSS_MEDIA_QUERY_VAR_CMD_process(cmd);
        }
        else if (type === BASE_CMD_TYPE_ACSS_VAR()) {
            return ACSS_VAR_CMD_process(cmd);
        }
        else if (type === BASE_CMD_TYPE_HTML_METATAG() || type === BASE_CMD_TYPE_HTML_BODYTAG()) {
            cmd = BASE_CMD_parseTriple(type, cmd);
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
                attributes = HTML_ATTRIBUTES_INSTRUCTIONS_STRING_parse(selector.htmlSelectorTag, cmd.htmlAttributesInstructionsString);
            }
            var acss = {};
            if (cmd.acssInstructionsString) {
                err = ACSS_INSTRUCTIONS_STRING_validate(cmd.acssInstructionsString);
                if (err) {
                    throw err;
                }
                var styleID = genStyleID();
                acss = ACSS_INSTRUCTIONS_STRING_parse(styleID, cmd.acssInstructionsString);
                selector.htmlSelectorClasses.unshift(styleID);
            }
            console.log('CMD:', cmd);
            console.log('SELECTOR:', selector);
            console.log('ATTRIBUTES:', attributes);
            console.log('ACSS:', acss);
            return BASE_CMD_compose(selector, attributes, acss);
        }
        else {
            throw new Error('Unsupported command type.');
        }
    }
    function BASE_CMD_GET_TYPE(cmd) {
        if (REG_BASE_CMD_IS_ACSS_MEDIA_QUERY_VAR.test(cmd)) {
            return BASE_CMD_TYPE_ACSS_MEDIA_QUERY_VAR();
        }
        else if (REG_BASE_CMD_IS_ACSS_VAR.test(cmd)) {
            return BASE_CMD_TYPE_ACSS_VAR();
        }
        else if (REG_BASE_CMD_IS_METATAG.test(cmd)) {
            return BASE_CMD_TYPE_HTML_METATAG();
        }
        else if (REG_BASE_CMD_IS_BODYTAG.test(cmd)) {
            return BASE_CMD_TYPE_HTML_BODYTAG();
        }
        else {
            return null;
        }
    }
    function BASE_CMD_TYPE_ACSS_MEDIA_QUERY_VAR() {
        return 'ACSS_MEDIA_QUERY_VAR_CMD';
    }
    function BASE_CMD_TYPE_ACSS_VAR() {
        return 'ACSS_VAR_CMD';
    }
    function BASE_CMD_TYPE_HTML_METATAG() {
        return 'HTML_METATAG_CMD';
    }
    function BASE_CMD_TYPE_HTML_BODYTAG() {
        return 'HTML_BODYTAG_CMD';
    }
    function ACSS_MEDIA_QUERY_VAR_setDefault() {
        var cache = exports.malloc('__H');
        if (!cache('media')) {
            cache('media', [ACSS_MEDIA_QUERY_VAR_compose('@default', null)]);
        }
    }
    function ACSS_MEDIA_QUERY_VAR_CMD_process(cmd) {
        var breakpoint = ACSS_MEDIA_QUERY_VAR_parse(cmd);
        var cache = exports.malloc('__H');
        var media = cache('media');
        if (arrFindIndex(media, 'key', breakpoint.key) >= 0) {
            throw new Error('ACSS media query variable - No duplicate key.');
        }
        var i = arrFindIndex(media, function(v) {
            if (!isNaN(parseInt(v.value))) {
                return breakpoint.value <= v.value;
            }
        });
        if (i >= 0) {
            throw new Error('ACSS media query variable - No duplicate or unordered value.');
        }
        media = media.concat([breakpoint]);
        cache('media', media);
    }
    function ACSS_MEDIA_QUERY_VAR_parse(cmd) {
        var components = cmd.match(REG_ACSS_MEDIA_QUERY_VAR_CMD_MATCH_COMPONENTS);
        if (!components) {
            throw new Error('ACSS media query variable - Command must follow @<breakpoint>: <value>px syntax.');
        }
        var key = components[1];
        var err = ACSS_MEDIA_QUERY_VAR_KEY_validate(key);
        if (err) {
            throw err;
        }
        var value = ACSS_MEDIA_QUERY_VAR_VALUE_parse(components[2]);
        return ACSS_MEDIA_QUERY_VAR_compose('@' + key, value);
    }
    function ACSS_MEDIA_QUERY_VAR_KEY_validate(v) {
        return validateAll(v, [
            ACSS_MEDIA_QUERY_VAR_KEY_noUnallowedChar
        ]);
    }
    function ACSS_MEDIA_QUERY_VAR_KEY_noUnallowedChar(v) {
        if (REG_ACSS_MEDIA_QUERY_VAR_KEY_NO_UNALLOWED_CHAR.test(v)) {
            return new Error('ACSS media query variable key - No unallowed char.');
        }
        return null;
    }
    function ACSS_MEDIA_QUERY_VAR_VALUE_parse(v) {
        v = parseInt(v);
        if (isNaN(v) || v < 0) {
            throw new Error('ACSS media query variable value - Unable to parse.');
        }
        return v;
    }
    function ACSS_MEDIA_QUERY_VAR_compose(key, value) {
        return {
            key: key,
            value: value
        };
    }
    function ACSS_VAR_CMD_process(cmd) {
        var variable = ACSS_VAR_parse(cmd);
        var cache = exports.malloc('__H');
        var variables = cache('variables') || {};
        if (variables[variable.key]) {
            throw new Error('No duplicate variable.');
        }
        else {
            variables[variable.key] = variable.value;
            cache('variables', variables);
        }
    }
    function ACSS_VAR_parse(cmd) {
        cmd = cmd.split(/\s*:\s*/);
        var key = cmd[0];
        var value = cmd[1];
        if (key && value) {
            return ACSS_VAR_compose(key, value);
        }
        else {
            throw new Error('Invalid ACSS variable separator.');
        }
    }
    function ACSS_VAR_compose(key, value) {
        return {
            key: key,
            value: value
        };
    }
    function BASE_CMD_parseTriple(type, cmd) {
        cmd = cmd.split(REG_BASE_CMD_SPLIT_BY_PIPE);
        if (!Array.isArray(cmd) || cmd.length === 0) {
            throw new Error('Base command - Unable to parse triple.');
        }
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            if (cmd.length > 2) {
                throw new Error('Base command - Max 1 pipe separator.');
            }
        }
        else {
            if (cmd.length > 3) {
                throw new Error('Base command - Max 2 pipe separators.');
            }
        }
        var htmlSelectorInstructionString = cmd[0];
        if (!htmlSelectorInstructionString) {
            throw new Error('Base command - Missing <html-selector>.');
        }
        var htmlAttributesInstructionsString = null;
        var acssInstructionsString = null;
        if (cmd.length === 3) {
            if (cmd[1] && REG_BASE_CMD_IS_PROBABLY_HTML_ATTRIBUTES_INSTRUCTIONS_STRING.test(cmd[1])) {
                htmlAttributesInstructionsString = cmd[1];
            }
            else {
                throw new Error('Base command - Missing or invalid <html-attributes>.');
            }
            if (cmd[2] && REG_BASE_CMD_IS_PROBABLY_ACSS_INSTUCTIONS_STRING.test(cmd[2])) {
                acssInstructionsString = cmd[2];
            }
            else {
                throw new Error('Base command - Missing or invalid <acss>.');
            }
        }
        else {
            if (cmd.length === 2) {
                if (cmd[1]) {
                    if (REG_BASE_CMD_IS_PROBABLY_HTML_ATTRIBUTES_INSTRUCTIONS_STRING.test(cmd[1])) {
                        htmlAttributesInstructionsString = cmd[1];
                    }
                    else if (REG_BASE_CMD_IS_PROBABLY_ACSS_INSTUCTIONS_STRING.test(cmd[1])) {
                        acssInstructionsString = cmd[1];
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
        var htmlSelectorTag = null;
        var htmlSelectorID = null;
        var htmlSelectorClasses = [];
        for (var i = 0, l = components.length; i < l; i++) {
            var component = components[i];
            if (component) {
                if (i > 0) {
                    var ch = component[0];
                    if (ch === '.') {
                        htmlSelectorClasses.push(component.slice(1));
                    }
                    else if (ch === '#') {
                        if (htmlSelectorClasses.length > 0) {
                            throw new Error('HTML selector instruction string - No invalid order.');
                        }
                        if (htmlSelectorID) {
                            throw new Error('HTML selector instruction string - No multiple IDs. ');
                        }
                        htmlSelectorID = component.slice(1);
                    }
                }
                else {
                    htmlSelectorTag = component;
                    if (!htmlSelectorTag) {
                        throw new Error('Unable to parse HTML selector tag.');
                    }
                    if (!HTML_TEMPLATES[htmlSelectorTag]) {
                        throw new Error('Missing template for "' + htmlSelectorTag + '" tag.');
                    }
                }
            }
        }
        return HTML_SELECTOR_INSTRUCTION_compose(htmlSelectorTag, htmlSelectorID, htmlSelectorClasses);
    }
    function HTML_SELECTOR_INSTRUCTION_compose(htmlSelectorTag, htmlSelectorID, htmlSelectorClasses) {
        return {
            htmlSelectorTag: htmlSelectorTag,
            htmlSelectorID: htmlSelectorID,
            htmlSelectorClasses: htmlSelectorClasses
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
        var err = HTML_ATTRIBUTES_INSTRUCTION_COMPONENTS_validate(htmlAttribute, components);
        if (err) {
            throw err;
        }
        var instructionValue = components[2] || '';
        var score = i;
        return HTML_ATTRIBUTES_INSTRUCTION_compose(instructionString, htmlAttribute, instructionValue, score);
    }
    function HTML_ATTRIBUTES_INSTRUCTION_COMPONENTS_validate(htmlAttribute, components) {
        if (!htmlAttribute.allowArgument && components[2]) {
            return new Error('HTML attributes instruction string - Instruction "' + htmlAttribute.func + '" must not define parameter.');
        }
        return HTML_ATTRIBUTES_INSTRUCTION_VALUE_validate(components[2]);
    }
    function HTML_ATTRIBUTES_INSTRUCTION_VALUE_validate(v) {
        return validateAll(v, [
            HTML_ATTRIBUTES_INSTRUCTION_VALUE_noUnallowedChar
        ]);
    }
    function HTML_ATTRIBUTES_INSTRUCTION_VALUE_noUnallowedChar(v) {
        if (REG_HTML_ATTRIBUTES_INSTRUCTION_VALUE_NO_UNALLOWED_CHAR.test(v)) {
            return new Error('HTML attributes instruction value - No unallowed char.');
        }
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
        var media = ACSS_composeEmptyMediaGroups();
        for (var i = 0, l = instructionStrings.length; i < l; i++) {
            var instructionString = instructionStrings[i];
            var rule = ACSS_INSTRUCTION_STRING_parse(instructionString);
            console.log('RULE:', rule);
        }
        return ACSS_compose(styleID, media);
    }
    function ACSS_composeEmptyMediaGroups() {
        var cache = exports.malloc('__H');
        var media = cache('media');
        var groups = [];
        for (var i = 0, l = media.length; i < l; i++) {
            var v = media[i];
            groups.push(ACSS_composeEmptyGroup(v.key, v.value));
        }
        return groups;
    }
    function ACSS_composeEmptyGroup(mediaGroupKey, mediaGroupValue) {
        return {
            mediaGroupKey: mediaGroupKey,
            mediaGroupValue: mediaGroupValue,
            styles: []
        };
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
        var acssRule = ACSS_RULES[i];
        var args = ACSS_INSTRUCTION_VALUE_parseArguments(components[2]);
        var err = ACSS_INSTRUCTION_ARGUMENTS_validate(acssRule, args);
        if (err) {
            throw err;
        }
        var important = components[3] === '!';
        var pseudoClasses = ACSS_PSEUDO_CLASSES_STRING_parse(components[4]);
        var pseudoElements = ACSS_PSEUDO_ELEMENTS_STRING_parse(components[5]);
        return ACSS_INSTRUCTION_compose(acssRule, args, important, pseudoClasses, pseudoElements);
    }
    function ACSS_INSTRUCTION_VALUE_parseArguments(instructionValue) {
        var del = ',,'; // AS DELIMITER USE SEQUENCE THAT IS UNALLOWED IN COMMAND
        instructionValue = instructionValue.replace(REG_ACSS_INSTRUCTION_VALUE_SPLIT_ARGUMENTS, del);
        instructionValue = ACSS_INSTRUCTION_VALUE_transformColors(instructionValue);
        return instructionValue.split(del);
    }
    function ACSS_INSTRUCTION_ARGUMENTS_validate(acssRule, args) {
        if (!Array.isArray(args) || args.length !== acssRule.argumentsCount) {
            return new Error('ACSS instruction arguments - No count mismatch.');
        }
        var arr = (Array.isArray(acssRule.arguments) && acssRule.arguments.length > 0) ? acssRule.arguments : [{}];
        for (var i = 0, l = arr.length; i < l; i++) {
            if (acssRule.allowCustomArgument !== true) {
                if (!arr[i][args[i]]) {
                    return new Error('ACSS instruction arguments - No custom argument at: ' + acssRule.func + '[' + i + ']');
                }
            }
        }
        return null;
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
            var score = j + 1; // +1 TO DISTINGUISH "NO PSEUDO CLASS" FROM "PSEUDO CLASS ON INDEX 0"
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
    function ACSS_INSTRUCTION_compose(acssRule, args, important, pseudoClasses, pseudoElements) {
        return {
            acssRule: acssRule,
            arguments: args,
            important: important,
            pseudoClasses: pseudoClasses,
            pseudoElements: pseudoElements
        };
    }
    function ACSS_compose(styleID, media) {
        return {
            styleID: styleID,
            media: media
        };
    }
    function BASE_CMD_compose(selector, attributes, acss) {
        return {
            selector: selector,
            attributes: attributes,
            acss: acss
        };
    }

    /**
     * CSS
     */
    function CSS_getCSSReset() { // https://github.com/jgthms/minireset.css/tree/0.0.3
        var b = CSS2('html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6', [
            'margin:0',
            'padding:0'
        ]);
        b += CSS2('h1,h2,h3,h4,h5,h6', [
            'font-size:100%',
            'font-weight:normal'
        ]);
        b += CSS2('ul', 'list-style:none');
        b += CSS2('button,input,select,textarea', 'margin:0');
        b += CSS2('html', 'box-sizing:border-box');
        b += CSS2('*,*:before,*:after', 'box-sizing:inherit');
        b += CSS2('img,embed,iframe,object,audio,video', [
            'height:auto',
            'max-width:100%'
        ]);
        b += CSS2('iframe', 'border:0');
        b += CSS2('table', [
            'border-collapse:collapse',
            'border-spacing:0'
        ]);
        b += CSS2('td,th', [
            'padding:0',
            'text-align:left'
        ]);
        return b;
    }
    function CSS2(k, a) {
        if (k && typeof(k) === 'string' && a) {
            a = typeof(a) === 'string' ? [a] : a;
            if (Array.isArray(a)) {
                var b = '';
                for (var i = 0, l = a.length; i < l; i++) {
                    var v = a[i];
                    if (v) {
                        b += cssPROPERTY(v);
                    }
                }
                if (b) {
                    if (k.indexOf('@media') >= 0) {
                        return k + '){' + b + '}';
                    }
                    else {
                        return k + '{' + b + '}';
                    }
                }
                return '';
            }
            return '';
        }
        return '';
    }
    function cssPROPERTY(kv) { // AUTOPREFIXES CSS KEY-VALUE PAIR
        var autovendor = ['filter', 'appearance', 'column-count', 'column-gap', 'column-rule', 'display', 'transform', 'transform-style', 'transform-origin', 'transition', 'user-select', 'animation', 'perspective', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-play-state', 'opacity', 'background', 'background-image', 'font-smoothing', 'text-size-adjust', 'backface-visibility', 'box-sizing', 'overflow-scrolling'];
        kv = kv.replace(/\s{2,}/g, ' ');
        kv = kv[kv.length - 1] === ';' ? kv.slice(0, -1) : kv;
        kv = kv.split(/\s*:\s*/);
        var k = kv[0];
        var v = kv[1];
        var sep = ':';
        var del = ';';
        if (k && v) {
            if (autovendor.indexOf(k) === -1) {
                return k + sep + v + del;
            }
            else {
                var rows = [k + sep + v];
                if (k === 'opacity') {
                    var opacity = +(v.replace(/\s/g, ''));
                    if (isNaN(opacity)) {
                        return '';
                    }
                    rows.push('filter' + sep + 'alpha(opacity=' + Math.floor(opacity * 100) + ')');
                }
                else if (k === 'font-smoothing') {
                    rows.push('-webkit-' + k + sep + v);
                    rows.push('-moz-osx-' + k + sep + v);
                }
                else if (k === 'background' || k === 'background-image') {
                    var g = '-gradient';
                    if (v.indexOf('linear' + g) >= 0 || v.indexOf('radial' + g) >= 0) {
                        rows.push('-webkit-' + k + sep + v);
                        rows.push('-moz-' + k + sep + v);
                        rows.push('-ms-' + k + sep + v);
                    }
                }
                else if (k === 'text-overflow') {
                    rows.push('-ms-' + k + sep + v);
                }
                else {
                    rows.push('-webkit-' + k + sep + v);
                    rows.push('-moz-' + k + sep + v);
                    if (k.indexOf('animation') === -1) { // SAME AS IN TOTAL.JS
                        rows.push('-ms-' + k + sep + v);
                    }
                }
                return rows.join(del) + del;
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
    function arrFind(arr, fn, value) {
        var index = arrFindIndex(arr, fn, value);
        if (index === -1) {
            return null;
        }
        return arr[index];
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
    function genStyleID() {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var b = '';
        for (var i = 0; i < 3; i++) {
            b += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return 'css-' + b;
    }
};
