// COMMAND FORMAT:
// HTML_SELECTOR_INSTRUCTION_STRING|HTML_ATTRIBUTES_INSTRUCTIONS_STRING|ACSS_INSTRUCTIONS_STRING
// ACSS IS ALLOWED ONLY FOR BODYTAG ELEMENTS
// ELEMENT ID AND CLASSES ARE ALLOWED ONLY FOR BODYTAG ELEMENTS
// BOTH ATTRIBUTES AND ACSS INSTRUCTIONS MUST HAVE PARENS () - THIS IS DIFFERENT FROM YAHOO'S ACSS WHICH SUPPORTS HELPERS WITHOUT THEM
// EACH BODYTAG ELEMENT THAT DEFINES ACSS STYLES HAS GENERATED ACSS ID (AN CSS CLASS) TO SIMPLE REFERENCE THIS ELEMENT IN CSS STYLES
// OUR ACSS DOES NOT INTENTIONALLY SUPPORT <combinator> AND ALL PARTS LOCATED BEFORE IT - THIS MEANS YOU MUST WORK WITH DOM PLACEHOLDERS AND REDRAW WHOLE COMPONENT INSTEAD OF JUST ADDING STATE CLASS TO PARENT ELEMENT
// OUR ACSS IS STRICT ORDERED, SCORE ORDER IS COMPUTED LIKE: <@mediaQuery><:pseudoClass><::pseudoElement>
// OUR ACSS USES "left" and "right" instead of "start" and "end" - OUR ACSS HAS NO RTL FUNCTIONALITY SUPPORT
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
            instructionName: 'Lang',
            allowArgument: true,
            html: 'lang={0}'
        }],
        Meta: [{ // MANDATORY ORDER
            name: 'Charset',
            instructionName: 'Charset',
            allowArgument: true,
            html: 'charset={0}'
        }, {
            name: 'Name',
            instructionName: 'Name',
            allowArgument: true,
            html: 'name={0}'
        }, {
            name: 'Property',
            instructionName: 'Property',
            allowArgument: true,
            html: 'property={0}'
        }, {
            name: 'HttpEquiv',
            instructionName: 'HttpEquiv',
            allowArgument: true,
            html: 'http-equiv={0}'
        }, {
            name: 'Content',
            instructionName: 'Content',
            allowArgument: true,
            html: 'content={0}'
        }],
        Input: [{
            name: 'Checked',
            instructionName: 'Chckd',
            allowArgument: false,
            html: 'checked'
        }, {
            name: 'Readonly',
            instructionName: 'Readonly',
            allowArgument: false,
            html: 'readonly'
        }, {
            name: 'Disabled',
            instructionName: 'Disabled',
            allowArgument: false,
            html: 'disabled'
        }],
        Select: [{
            name: 'Disabled',
            instructionName: 'Disabled',
            allowArgument: false,
            html: 'disabled'
        }],
        Option: [{
            name: 'Selected',
            instructionName: 'Slctd',
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

    var ACSS_RULES = [{ // MANDATORY ORDER
        name: 'Animation',
        instructionName: 'Anim',
        argumentsCount: 1,
        css: 'animation:{0}',
        allowCustomArgument: true
    }, {
        name: 'Animation delay',
        instructionName: 'Animdel',
        argumentsCount: 1,
        css: 'animation-delay:{0}',
        allowCustomArgument: true
    }, {
        name: 'Animation direction',
        instructionName: 'Animdir',
        argumentsCount: 1,
        css: 'animation-direction:{0}',
        allowCustomArgument: false,
        arguments: [{
            a: 'alternate',
            ar: 'alternate-reverse',
            n: 'normal',
            r: 'reverse'
        }]
    }, {
        name: 'Animation duration',
        instructionName: 'Animdur',
        argumentsCount: 1,
        css: 'animation-duration:{0}',
        allowCustomArgument: true
    }, {
        name: 'Animation fill mode',
        instructionName: 'Animfm',
        argumentsCount: 1,
        css: 'animation-fill-mode:{0}',
        allowCustomArgument: false,
        arguments: [{
            b: 'backwards',
            bo: 'both',
            f: 'forwards',
            n: 'none'
        }]
    }, {
        name: 'Animation iteration count',
        instructionName: 'Animic',
        argumentsCount: 1,
        css: 'animation-iteration-count:{0}',
        allowCustomArgument: true,
        arguments: [{
            i: 'infinite'
        }]
    }, {
        name: 'Animation name',
        instructionName: 'Animn',
        argumentsCount: 1,
        css: 'animation-name:{0}',
        allowCustomArgument: true,
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Animation play state',
        instructionName: 'Animps',
        argumentsCount: 1,
        css: 'animation-play-state:{0}',
        allowCustomArgument: false,
        arguments: [{
            p: 'paused',
            r: 'running'
        }]
    }, {
        name: 'Animation timing function',
        instructionName: 'Animtf',
        argumentsCount: 1,
        css: 'animation-timing-function:{0}',
        allowCustomArgument: false,
        arguments: [{
            e: 'ease',
            ei: 'ease-in',
            eo: 'ease-out',
            eio: 'ease-in-out',
            l: 'linear',
            se: 'step-end',
            ss: 'step-start'
        }]
    }, {
        name: 'Appearance',
        instructionName: 'Ap',
        allowCustomArgument: false,
        css: 'appearance:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Border',
        instructionName: 'Bd',
        allowCustomArgument: false,
        css: 'border:{0}',
        arguments: [{
            // '0': 0,
            n: 'none'
        }]
    }, {
        name: 'Border X',
        instructionName: 'Bdx',
        allowCustomArgument: false,
        css: [
            'border-left:{0}',
            'border-right:{0}'
        ]
    }, {
        name: 'Border Y',
        instructionName: 'Bdy',
        allowCustomArgument: false,
        css: [
            'border-top:{0}',
            'border-bottom:{0}'
        ]
    }, {
        name: 'Border top',
        instructionName: 'Bdt',
        allowCustomArgument: false,
        css: 'border-top:{0}'
    }, {
        name: 'Border right',
        instructionName: 'Bdright',
        allowCustomArgument: false,
        css: 'border-right:{0}'
    }, {
        name: 'Border bottom',
        instructionName: 'Bdb',
        allowCustomArgument: false,
        css: 'border-bottom:{0}'
    }, {
        name: 'Border left',
        instructionName: 'Bdleft',
        allowCustomArgument: false,
        css: 'border-left:{0}'
    }, {
        name: 'Border color',
        instructionName: 'Bdc',
        allowCustomArgument: true,
        css: 'border-color:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Border top color',
        instructionName: 'Bdtc',
        allowCustomArgument: true,
        css: 'border-top-color:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Border right color',
        instructionName: 'Bdrightc',
        allowCustomArgument: true,
        css: 'border-right-color:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Border bottom color',
        instructionName: 'Bdbc',
        allowCustomArgument: true,
        css: 'border-bottom-color:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Border left color',
        instructionName: 'Bdleftc',
        allowCustomArgument: true,
        css: 'border-left-color:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Border spacing',
        instructionName: 'Bdsp',
        allowCustomArgument: true,
        css: 'border-spacing:{0} {1}',
        arguments: [{
            i: 'inherit'
        }]
    }, {
        name: 'Border style',
        instructionName: 'Bds',
        allowCustomArgument: false,
        css: 'border-style:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'Border top style',
        instructionName: 'Bdts',
        allowCustomArgument: false,
        css: 'border-top-style:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'Border right style',
        instructionName: 'Bdrights',
        allowCustomArgument: false,
        css: 'border-right-style:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'Border bottom style',
        instructionName: 'Bdbs',
        allowCustomArgument: false,
        css: 'border-bottom-style:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'Border left style',
        instructionName: 'Bdlefts',
        allowCustomArgument: false,
        css: 'border-left-style:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'Border width',
        instructionName: 'Bdw',
        allowCustomArgument: true,
        css: 'border-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border top width',
        instructionName: 'Bdtw',
        allowCustomArgument: true,
        css: 'border-top-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border right width',
        instructionName: 'Bdrightw',
        allowCustomArgument: true,
        css: 'border-right-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border bottom width',
        instructionName: 'Bdbw',
        allowCustomArgument: true,
        css: 'border-bottom-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border left width',
        instructionName: 'Bdleftw',
        allowCustomArgument: true,
        css: 'border-left-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border radius',
        instructionName: 'Bdrs',
        allowCustomArgument: true,
        css: 'border-radius:{0}'
    }, {
        name: 'Border radius top right',
        instructionName: 'Bdrstright',
        allowCustomArgument: true,
        css: 'border-top-right-radius:{0}'
    }, {
        name: 'Border radius bottom right',
        instructionName: 'Bdrsbright',
        allowCustomArgument: true,
        css: 'border-bottom-right-radius:{0}'
    }, {
        name: 'Border radius bottom left',
        instructionName: 'Bdrsbleft',
        allowCustomArgument: true,
        css: 'border-bottom-left-radius:{0}'
    }, {
        name: 'Border radius top left',
        instructionName: 'Bdrstleft',
        allowCustomArgument: true,
        css: 'border-top-left-radius:{0}'
    }, {
        name: 'Background',
        instructionName: 'Bg',
        allowCustomArgument: false,
        css: 'background:{0}',
        arguments: [{
            n: 'none',
            t: 'transparent'
        }]
    }, {
        name: 'Background image',
        instructionName: 'Bgi',
        allowCustomArgument: false,
        css: 'background-image:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Background color',
        instructionName: 'Bgc',
        allowCustomArgument: true,
        css: 'background-color:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Background clip',
        instructionName: 'Bgcp',
        allowCustomArgument: false,
        css: 'background-clip:{0}',
        arguments: [{
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        }]
    }, {
        name: 'Background origin',
        instructionName: 'Bgo',
        allowCustomArgument: false,
        css: 'background-origin:{0}',
        arguments: [{
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        }]
    }, {
        name: 'Background size',
        instructionName: 'Bgz',
        allowCustomArgument: true,
        css: 'background-size:{0}',
        arguments: [{
            a: 'auto',
            ct: 'contain',
            cv: 'cover'
        }]
    }, {
        name: 'Background attachment',
        instructionName: 'Bga',
        allowCustomArgument: false,
        css: 'background-attachment:{0}',
        arguments: [{
            f: 'fixed',
            l: 'local',
            s: 'scroll'
        }]
    }, {
        name: 'Background position',
        instructionName: 'Bgp',
        allowCustomArgument: true,
        css: 'background-position:{0} {1}',
        arguments: [{
            left_t: 'left 0',
            right_t: 'right 0',
            left_b: 'left 100%',
            right_b: 'right 100%',
            left_c: 'left center',
            right_c: 'right center',
            c_b: 'center 100%',
            c_t: 'center 0',
            c: 'center'
        }]
    }, {
        name: 'Background position (X axis)',
        instructionName: 'Bgpx',
        allowCustomArgument: true,
        css: 'background-position-x:{0}',
        arguments: [{
            left: 'left',
            right: 'right',
            c: '50%'
        }]
    }, {
        name: 'Background position (Y axis)',
        instructionName: 'Bgpy',
        allowCustomArgument: true,
        css: 'background-position-y:{0}',
        arguments: [{
            t: '0',
            b: '100%',
            c: '50%'
        }]
    }, {
        name: 'Background repeat',
        instructionName: 'Bgr',
        allowCustomArgument: false,
        css: 'background-repeat:{0}',
        arguments: [{
            nr: 'no-repeat',
            rx: 'repeat-x',
            ry: 'repeat-y',
            r: 'repeat',
            s: 'space',
            ro: 'round'
        }]
    }, {
        name: 'Border collapse',
        instructionName: 'Bdcl',
        allowCustomArgument: false,
        css: 'border-collapse:{0}',
        arguments: [{
            c: 'collapse',
            s: 'separate'
        }]
    }, {
        name: 'Box sizing',
        instructionName: 'Bxz',
        allowCustomArgument: false,
        css: 'box-sizing:{0}',
        arguments: [{
            cb: 'content-box',
            pb: 'padding-box',
            bb: 'border-box'
        }]
    }, {
        name: 'Box shadow',
        instructionName: 'Bxsh',
        allowCustomArgument: false,
        css: 'box-shadow:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Clear',
        instructionName: 'Cl',
        allowCustomArgument: false,
        css: 'clear:{0}',
        arguments: [{
            n: 'none',
            b: 'both',
            left: 'left',
            right: 'right'
        }]
    }, {
        name: 'Color',
        instructionName: 'C',
        allowCustomArgument: true,
        css: 'color:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Contain',
        instructionName: 'Ctn',
        allowCustomArgument: false,
        css: 'contain:{0}',
        arguments: [{
            n: 'none',
            st: 'strict',
            c: 'content',
            z: 'size',
            l: 'layout',
            s: 'style',
            p: 'paint'
        }]
    }, {
        name: 'Content',
        instructionName: 'Cnt',
        allowCustomArgument: true,
        css: 'content:{0}',
        arguments: [{
            n: 'none',
            nor: 'normal',
            oq: 'open-quote',
            cq: 'close-quote',
            noq: 'no-open-quote',
            ncq: 'no-close-quote'
        }]
    }, {
        name: 'Cursor',
        instructionName: 'Cur',
        allowCustomArgument: false,
        css: 'cursor:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'Display',
        instructionName: 'D',
        allowCustomArgument: false,
        css: 'display:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'Filter',
        instructionName: 'Fil',
        allowCustomArgument: false,
        css: 'filter:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Blur (filter)',
        instructionName: 'Blur',
        allowCustomArgument: true,
        css: 'filter:blur({0})'
    }, {
        name: 'Brightness (filter)',
        instructionName: 'Brightness',
        allowCustomArgument: true,
        css: 'filter:brightness({0})'
    }, {
        name: 'Contrast (filter)',
        instructionName: 'Contrast',
        allowCustomArgument: true,
        css: 'filter:contrast({0})'
    }, {
        name: 'Drop shadow (filter)',
        instructionName: 'Dropshadow',
        allowCustomArgument: false,
        css: 'filter:drop-shadow({0})'
    }, {
        name: 'Grayscale (filter)',
        instructionName: 'Grayscale',
        allowCustomArgument: true,
        css: 'filter:grayscale({0})'
    }, {
        name: 'Hue Rotate (filter)',
        instructionName: 'HueRotate',
        allowCustomArgument: true,
        css: 'filter:hue-rotate({0})'
    }, {
        name: 'Invert (filter)',
        instructionName: 'Invert',
        allowCustomArgument: true,
        css: 'filter:invert({0})'
    }, {
        name: 'Opacity (filter)',
        instructionName: 'Opacity',
        allowCustomArgument: true,
        css: 'filter:opacity({0})'
    }, {
        name: 'Saturate (filter)',
        instructionName: 'Saturate',
        allowCustomArgument: true,
        css: 'filter:saturate({0})'
    }, {
        name: 'Sepia (filter)',
        instructionName: 'Sepia',
        allowCustomArgument: true,
        css: 'filter:sepia({0})'
    }, {
        name: 'Flex (deprecated)',
        instructionName: 'Flx',
        allowCustomArgument: false,
        css: 'flex:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Flex',
        instructionName: 'Fx',
        allowCustomArgument: false,
        css: 'flex:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Flex grow (deprecated)',
        instructionName: 'Flxg',
        allowCustomArgument: true,
        css: 'flex-grow:{0}'
    }, {
        name: 'Flex grow',
        instructionName: 'Fxg',
        allowCustomArgument: true,
        css: 'flex-grow:{0}'
    }, {
        name: 'Flex shrink (deprecated)',
        instructionName: 'Flxs',
        allowCustomArgument: true,
        css: 'flex-shrink:{0}'
    }, {
        name: 'Flex shrink',
        instructionName: 'Fxs',
        allowCustomArgument: true,
        css: 'flex-shrink:{0}'
    }, {
        name: 'Flex basis (deprecated)',
        instructionName: 'Flxb',
        allowCustomArgument: true,
        css: 'flex-basis:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Flex basis',
        instructionName: 'Fxb',
        allowCustomArgument: true,
        css: 'flex-basis:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Align self',
        instructionName: 'As',
        allowCustomArgument: false,
        css: 'align-self:{0}',
        arguments: [{
            a: 'auto',
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            b: 'baseline',
            st: 'stretch'
        }]
    }, {
        name: 'Flex direction (deprecated)',
        instructionName: 'Fld',
        allowCustomArgument: false,
        css: 'flex-direction:{0}',
        arguments: [{
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse'
        }]
    }, {
        name: 'Flex direction',
        instructionName: 'Fxd',
        allowCustomArgument: false,
        css: 'flex-direction:{0}',
        arguments: [{
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse'
        }]
    }, {
        name: 'Flex flow (deprecated)',
        instructionName: 'Flf',
        allowCustomArgument: false,
        css: 'flex-flow:{0}',
        arguments: [{
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse',
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }]
    }, {
        name: 'Flex flow',
        instructionName: 'Fxf',
        allowCustomArgument: false,
        css: 'flex-flow:{0}',
        arguments: [{
            r: 'row',
            rr: 'row-reverse',
            c: 'column',
            cr: 'column-reverse',
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }]
    }, {
        name: 'Align items',
        instructionName: 'Ai',
        allowCustomArgument: false,
        css: 'align-items:{0}',
        arguments: [{
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            b: 'baseline',
            st: 'stretch'
        }]
    }, {
        name: 'Align content',
        instructionName: 'Ac',
        allowCustomArgument: false,
        css: 'align-content:{0}',
        arguments: [{
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            sb: 'space-between',
            sa: 'space-around',
            st: 'stretch'
        }]
    }, {
        name: 'Order',
        instructionName: 'Or',
        allowCustomArgument: true,
        css: 'order:{0}'
    }, {
        name: 'Justify content',
        instructionName: 'Jc',
        allowCustomArgument: false,
        css: 'justify-content:{0}',
        arguments: [{
            fs: 'flex-start',
            fe: 'flex-end',
            c: 'center',
            sb: 'space-between',
            sa: 'space-around'
        }]
    }, {
        name: 'Flex-wrap (deprecated)',
        instructionName: 'Flw',
        allowCustomArgument: false,
        css: 'flex-wrap:{0}',
        arguments: [{
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }]
    }, {
        name: 'Flex-wrap',
        instructionName: 'Fxw',
        allowCustomArgument: false,
        css: 'flex-wrap:{0}',
        arguments: [{
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }]
    }, {
        name: 'Float',
        allowCustomArgument: false,
        instructionName: 'Fl',
        css: 'float:{0}',
        arguments: [{
            n: 'none',
            left: 'left',
            right: 'right'
        }]
    }, {
        name: 'Font family',
        instructionName: 'Ff',
        allowCustomArgument: false,
        css: 'font-family:{0}',
        arguments: [{
            c: '"Monotype Corsiva", "Comic Sans MS", cursive',
            f: 'Capitals, Impact, fantasy',
            m: 'Monaco, "Courier New", monospace',
            s: 'Georgia, "Times New Roman", serif',
            ss: 'Helvetica, Arial, sans-serif'
        }]
    }, {
        name: 'Font weight',
        instructionName: 'Fw',
        allowCustomArgument: false,
        css: 'font-weight:{0}',
        arguments: [{
            // '100': '100',
            // '200': '200',
            // '300': '300',
            // '400': '400',
            // '500': '500',
            // '600': '600',
            // '700': '700',
            // '800': '800',
            // '900': '900',
            b: 'bold',
            br: 'bolder',
            lr: 'lighter',
            n: 'normal'
        }]
    }, {
        name: 'Font size',
        instructionName: 'Fz',
        allowCustomArgument: true,
        css: 'font-size:{0}'
    }, {
        name: 'Font style',
        instructionName: 'Fs',
        allowCustomArgument: false,
        css: 'font-style:{0}',
        arguments: [{
            n: 'normal',
            i: 'italic',
            o: 'oblique'
        }]
    }, {
        name: 'Font variant',
        instructionName: 'Fv',
        allowCustomArgument: false,
        css: 'font-variant:{0}',
        arguments: [{
            n: 'normal',
            sc: 'small-caps'
        }]
    }, {
        name: 'Height',
        instructionName: 'H',
        allowCustomArgument: true,
        css: 'height:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto',
            av: 'available',
            bb: 'border-box',
            cb: 'content-box',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        }]
    }, {
        name: 'Hyphens',
        instructionName: 'Hy',
        allowCustomArgument: false,
        css: 'hyphens:{0}',
        arguments: [{
            a: 'auto',
            n: 'normal',
            m: 'manual'
        }]
    }, {
        name: 'Letter spacing',
        instructionName: 'Lts',
        allowCustomArgument: true,
        css: 'letter-spacing:{0}',
        arguments: [{
            n: 'normal'
        }]
    }, {
        name: 'List style type',
        instructionName: 'List',
        allowCustomArgument: false,
        css: 'list-style-type:{0}',
        arguments: [{
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
        }]
    }, {
        name: 'List style position',
        instructionName: 'Lisp',
        allowCustomArgument: false,
        css: 'list-style-position:{0}',
        arguments: [{
            i: 'inside',
            o: 'outside'
        }]
    }, {
        name: 'List style image',
        instructionName: 'Lisi',
        allowCustomArgument: false,
        css: 'list-style-image:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Line height',
        instructionName: 'Lh',
        allowCustomArgument: true,
        css: 'line-height:{0}',
        arguments: [{
            n: 'normal'
        }]
    }, {
        name: 'Margin (all edges)',
        instructionName: 'M',
        allowCustomArgument: true,
        css: 'margin:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin (X axis)',
        instructionName: 'Mx',
        allowCustomArgument: true,
        css: [
            'margin-left:{0}',
            'margin-right:{0}'
        ],
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin (Y axis)',
        instructionName: 'My',
        allowCustomArgument: true,
        css: [
            'margin-top:{0}',
            'margin-bottom:{0}'
        ],
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin top',
        instructionName: 'Mt',
        allowCustomArgument: true,
        css: 'margin-top:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin right',
        instructionName: 'Mright',
        allowCustomArgument: true,
        css: 'margin-right:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin bottom',
        instructionName: 'Mb',
        allowCustomArgument: true,
        css: 'margin-bottom:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin left',
        instructionName: 'Mleft',
        allowCustomArgument: true,
        css: 'margin-left:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Max height',
        instructionName: 'Mah',
        allowCustomArgument: true,
        css: 'max-height:{0}',
        arguments: [{
            a: 'auto',
            maxc: 'max-content',
            minc: 'min-content',
            fa: 'fill-available',
            fc: 'fit-content'
        }]
    }, {
        name: 'Max width',
        instructionName: 'Maw',
        allowCustomArgument: true,
        css: 'max-width:{0}',
        arguments: [{
            n: 'none',
            fa: 'fill-available',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        }]
    }, {
        name: 'Min height',
        instructionName: 'Mih',
        allowCustomArgument: true,
        css: 'min-height:{0}',
        arguments: [{
            a: 'auto',
            fa: 'fill-available',
            fc: 'fit-content',
            maxc: 'max-content',
            minc: 'min-content'
        }]
    }, {
        name: 'Min width',
        instructionName: 'Miw',
        allowCustomArgument: true,
        css: 'min-width:{0}',
        arguments: [{
            a: 'auto',
            fa: 'fill-available',
            fc: 'fit-content',
            ini: 'initial',
            maxc: 'max-content',
            minc: 'min-content'
        }]
    }, {
        name: 'Outline',
        instructionName: 'O',
        allowCustomArgument: false,
        css: 'outline:{0}',
        arguments: [{
            // '0': '0',
            n: 'none'
        }]
    }, {
        name: 'Top',
        instructionName: 'T',
        allowCustomArgument: true,
        css: 'top:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Right',
        instructionName: 'Right',
        allowCustomArgument: true,
        css: 'right:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Bottom',
        instructionName: 'B',
        allowCustomArgument: true,
        css: 'bottom:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Left',
        instructionName: 'Left',
        allowCustomArgument: true,
        css: 'left:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Opacity',
        instructionName: 'Op',
        allowCustomArgument: true,
        css: 'opacity:{0}'
        // arguments: [{
        // '0': '0',
        // '1': '1'
        // }]
    }, {
        name: 'Overflow',
        instructionName: 'Ov',
        allowCustomArgument: false,
        css: 'overflow:{0}',
        arguments: [{
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        }]
    }, {
        name: 'Overflow (X axis)',
        instructionName: 'Ovx',
        allowCustomArgument: false,
        css: 'overflow-x:{0}',
        arguments: [{
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        }]
    }, {
        name: 'Overflow (Y axis)',
        instructionName: 'Ovy',
        allowCustomArgument: false,
        css: 'overflow-y:{0}',
        arguments: [{
            a: 'auto',
            h: 'hidden',
            s: 'scroll',
            v: 'visible'
        }]
    }, {
        name: 'Overflow scrolling',
        instructionName: 'Ovs',
        allowCustomArgument: false,
        css: '-webkit-overflow-scrolling:{0}',
        arguments: [{
            a: 'auto',
            touch: 'touch'
        }]
    }, {
        name: 'Padding (all edges)',
        instructionName: 'P',
        allowCustomArgument: true,
        css: 'padding:{0}'
    }, {
        name: 'Padding (X axis)',
        instructionName: 'Px',
        allowCustomArgument: true,
        css: [
            'padding-left:{0}',
            'padding-right:{0}'
        ]
    }, {
        name: 'Padding (Y axis)',
        instructionName: 'Py',
        allowCustomArgument: true,
        css: [
            'padding-top:{0}',
            'padding-bottom:{0}'
        ]
    }, {
        name: 'Padding top',
        instructionName: 'Pt',
        allowCustomArgument: true,
        css: 'padding-top:{0}'
    }, {
        name: 'Padding right',
        instructionName: 'Pright',
        allowCustomArgument: true,
        css: 'padding-right:{0}'
    }, {
        name: 'Padding bottom',
        instructionName: 'Pb',
        allowCustomArgument: true,
        css: 'padding-bottom:{0}'
    }, {
        name: 'Padding left',
        instructionName: 'Pleft',
        allowCustomArgument: true,
        css: 'padding-left:{0}'
    }, {
        name: 'Pointer events',
        instructionName: 'Pe',
        allowCustomArgument: false,
        css: 'pointer-events:{0}',
        arguments: [{
            a: 'auto',
            all: 'all',
            f: 'fill',
            n: 'none',
            p: 'painted',
            s: 'stroke',
            v: 'visible',
            vf: 'visibleFill',
            vp: 'visiblePainted',
            vs: 'visibleStroke'
        }]
    }, {
        name: 'Position',
        instructionName: 'Pos',
        allowCustomArgument: false,
        css: 'position:{0}',
        arguments: [{
            a: 'absolute',
            f: 'fixed',
            r: 'relative',
            s: 'static',
            st: 'sticky'
        }]
    }, {
        name: 'Resize',
        instructionName: 'Rsz',
        allowCustomArgument: false,
        css: 'resize:{0}',
        arguments: [{
            n: 'none',
            b: 'both',
            h: 'horizontal',
            v: 'vertical'
        }]
    }, {
        name: 'Table layout',
        instructionName: 'Tbl',
        allowCustomArgument: false,
        css: 'table-layout:{0}',
        arguments: [{
            a: 'auto',
            f: 'fixed'
        }]
    }, {
        name: 'Text align',
        instructionName: 'Ta',
        allowCustomArgument: false,
        css: 'text-align:{0}',
        arguments: [{
            c: 'center',
            e: 'end',
            right: 'right',
            j: 'justify',
            mp: 'match-parent',
            s: 'start',
            left: 'left'
        }]
    }, {
        name: 'Text align last',
        instructionName: 'Tal',
        allowCustomArgument: false,
        css: 'text-align-last:{0}',
        arguments: [{
            a: 'auto',
            c: 'center',
            e: 'end',
            right: 'right',
            j: 'justify',
            s: 'start',
            left: 'left'
        }]
    }, {
        name: 'Text decoration',
        instructionName: 'Td',
        allowCustomArgument: false,
        css: 'text-decoration:{0}',
        arguments: [{
            lt: 'line-through',
            n: 'none',
            o: 'overline',
            u: 'underline'
        }]
    }, {
        name: 'Text indent',
        instructionName: 'Ti',
        allowCustomArgument: true,
        css: 'text-indent:{0}'
    }, {
        name: 'Text overflow',
        instructionName: 'Tov',
        allowCustomArgument: false,
        css: 'text-overflow:{0}',
        arguments: [{
            c: 'clip',
            e: 'ellipsis'
        }]
    }, {
        name: 'Text rendering',
        instructionName: 'Tren',
        allowCustomArgument: false,
        css: 'text-rendering:{0}',
        arguments: [{
            a: 'auto',
            os: 'optimizeSpeed',
            ol: 'optimizeLegibility',
            gp: 'geometricPrecision'
        }]
    }, {
        name: 'Text replace',
        instructionName: 'Tr',
        allowCustomArgument: false,
        css: 'text-replace:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Text transform',
        instructionName: 'Tt',
        allowCustomArgument: false,
        css: 'text-transform:{0}',
        arguments: [{
            n: 'none',
            c: 'capitalize',
            u: 'uppercase',
            l: 'lowercase'
        }]
    }, {
        name: 'Text shadow',
        instructionName: 'Tsh',
        allowCustomArgument: false,
        css: 'text-shadow:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Transform',
        instructionName: 'Trf',
        allowCustomArgument: false,
        css: 'transform:{0}'
    }, {
        name: 'Transform origin',
        instructionName: 'Trfo',
        allowCustomArgument: true,
        css: 'transform-origin:{0} {1}',
        arguments: [{
            t: 'top',
            right: 'right',
            bottom: 'bottom',
            left: 'left',
            c: 'center'
        }, {
            t: 'top',
            right: 'right',
            bottom: 'bottom',
            left: 'left',
            c: 'center'
        }]
    }, {
        name: 'Transform style',
        instructionName: 'Trfs',
        allowCustomArgument: false,
        css: 'transform-style:{0}',
        arguments: [{
            f: 'flat',
            p: 'preserve-3d'
        }]
    }, {
        name: 'Perspective',
        instructionName: 'Prs',
        allowCustomArgument: true,
        css: 'perspective:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Perspective origin',
        instructionName: 'Prso',
        allowCustomArgument: true,
        css: 'perspective-origin:{0} {1}',
        arguments: [{
            t: 'top',
            right: 'right',
            bottom: 'bottom',
            left: 'left',
            c: 'center'
        }, {
            t: 'top',
            right: 'right',
            bottom: 'bottom',
            left: 'left',
            c: 'center'
        }]
    }, {
        name: 'Backface visibility',
        instructionName: 'Bfv',
        allowCustomArgument: false,
        css: 'backface-visibility:{0}',
        arguments: [{
            h: 'hidden',
            v: 'visible'
        }]
    }, {
        name: 'Matrix (transform)',
        instructionName: 'Matrix',
        allowCustomArgument: false,
        css: 'transform:matrix({0})'
    }, {
        name: 'Matrix 3d (transform)',
        instructionName: 'Matrix3d',
        allowCustomArgument: false,
        css: 'transform:matrix({0})'
    }, {
        name: 'Rotate (transform)',
        instructionName: 'Rotate',
        allowCustomArgument: true,
        css: 'transform:rotate({0})'
    }, {
        name: 'Rotate 3d (transform)',
        instructionName: 'Rotate3d',
        allowCustomArgument: true,
        css: 'transform:rotate3d({0},{1},{2},{3})'
    }, {
        name: 'RotateX (transform)',
        instructionName: 'RotateX',
        allowCustomArgument: true,
        css: 'transform:rotateX({0})'
    }, {
        name: 'RotateY (transform)',
        instructionName: 'RotateY',
        allowCustomArgument: true,
        css: 'transform:rotateY({0})'
    }, {
        name: 'RotateZ (transform)',
        instructionName: 'RotateZ',
        allowCustomArgument: true,
        css: 'transform:rotateZ({0})'
    }, {
        name: 'Scale (transform)',
        instructionName: 'Scale',
        allowCustomArgument: true,
        css: 'transform:scale({0},{1})'
    }, {
        name: 'Scale 3d (transform)',
        instructionName: 'Scale3d',
        allowCustomArgument: true,
        css: 'transform:scale3d({0},{1},{2})'
    }, {
        name: 'ScaleX (transform)',
        instructionName: 'ScaleX',
        allowCustomArgument: true,
        css: 'transform:scaleX({0})'
    }, {
        name: 'ScaleY (transform)',
        instructionName: 'ScaleY',
        allowCustomArgument: true,
        css: 'transform:scaleY({0})'
    }, {
        name: 'Skew (transform)',
        instructionName: 'Skew',
        allowCustomArgument: true,
        css: 'transform:skew({0},{1})'
    }, {
        name: 'SkewX (transform)',
        instructionName: 'SkewX',
        allowCustomArgument: true,
        css: 'transform:skewX({0})'
    }, {
        name: 'SkewY (transform)',
        instructionName: 'SkewY',
        allowCustomArgument: true,
        css: 'transform:skewY({0})'
    }, {
        name: 'Translate (transform)',
        instructionName: 'Translate',
        allowCustomArgument: true,
        css: 'transform:translate({0},{1})'
    }, {
        name: 'Translate 3d (transform)',
        instructionName: 'Translate3d',
        allowCustomArgument: true,
        css: 'transform:translate3d({0},{1},{2})'
    }, {
        name: 'Translate X (transform)',
        instructionName: 'TranslateX',
        allowCustomArgument: true,
        css: 'transform:translateX({0})'
    }, {
        name: 'Translate Y (transform)',
        instructionName: 'TranslateY',
        allowCustomArgument: true,
        css: 'transform:translateY({0})'
    }, {
        name: 'Translate Z (transform)',
        instructionName: 'TranslateZ',
        allowCustomArgument: true,
        css: 'transform:translateZ({0})'
    }, {
        name: 'Transition',
        instructionName: 'Trs',
        allowCustomArgument: false,
        css: 'transition:{0}'
    }, {
        name: 'Transition delay',
        instructionName: 'Trsde',
        allowCustomArgument: true,
        css: 'transition-delay:{0}',
        arguments: [{
            i: 'initial'
        }]
    }, {
        name: 'Transition duration',
        instructionName: 'Trsdu',
        allowCustomArgument: true,
        css: 'transition-duration:{0}'
    }, {
        name: 'Transition property',
        instructionName: 'Trsp',
        allowCustomArgument: false,
        css: 'transition-property:{0}',
        arguments: [{
            a: 'all'
        }]
    }, {
        name: 'Transition timing function',
        instructionName: 'Trstf',
        allowCustomArgument: false,
        css: 'transition-timing-function:{0}',
        arguments: [{
            e: 'ease',
            ei: 'ease-in',
            eo: 'ease-out',
            eio: 'ease-in-out',
            l: 'linear',
            ss: 'step-start',
            se: 'step-end'
        }]
    }, {
        name: 'User select',
        instructionName: 'Us',
        allowCustomArgument: false,
        css: 'user-select:{0}',
        arguments: [{
            a: 'all',
            el: 'element',
            els: 'elements',
            n: 'none',
            t: 'text',
            to: 'toggle'
        }]
    }, {
        name: 'Vertical align',
        instructionName: 'Va',
        allowCustomArgument: false,
        css: 'vertical-align:{0}',
        arguments: [{
            b: 'bottom',
            bl: 'baseline',
            m: 'middle',
            sub: 'sub',
            sup: 'super',
            t: 'top',
            tb: 'text-bottom',
            tt: 'text-top'
        }]
    }, {
        name: 'Visibility',
        instructionName: 'V',
        allowCustomArgument: false,
        css: 'visibility:{0}',
        arguments: [{
            v: 'visible',
            h: 'hidden',
            c: 'collapse'
        }]
    }, {
        name: 'White space',
        instructionName: 'Whs',
        allowCustomArgument: false,
        css: 'white-space:{0}',
        arguments: [{
            n: 'normal',
            p: 'pre',
            nw: 'nowrap',
            pw: 'pre-wrap',
            pl: 'pre-line'
        }]
    }, {
        name: 'White space collapse',
        instructionName: 'Whsc',
        allowCustomArgument: false,
        css: 'white-space-collapse:{0}',
        arguments: [{
            n: 'normal',
            ka: 'keep-all',
            l: 'loose',
            bs: 'break-strict',
            ba: 'break-all'
        }]
    }, {
        name: 'Width',
        instructionName: 'W',
        allowCustomArgument: true,
        css: 'width:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto',
            bb: 'border-box',
            cb: 'content-box',
            av: 'available',
            minc: 'min-content',
            maxc: 'max-content',
            fc: 'fit-content'
        }]
    }, {
        name: 'Word break',
        instructionName: 'Wob',
        allowCustomArgument: false,
        css: 'word-break:{0}',
        arguments: [{
            ba: 'break-all',
            ka: 'keep-all',
            n: 'normal'
        }]
    }, {
        name: 'Word wrap',
        instructionName: 'Wow',
        allowCustomArgument: false,
        css: 'word-wrap:{0}',
        arguments: [{
            bw: 'break-word',
            n: 'normal'
        }]
    }, {
        name: 'Z index',
        instructionName: 'Z',
        allowCustomArgument: true,
        css: 'z-index:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Fill (SVG)',
        instructionName: 'Fill',
        allowCustomArgument: false,
        css: 'fill:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Stroke (SVG)',
        instructionName: 'Stk',
        allowCustomArgument: false,
        css: 'stroke:{0}',
        arguments: [ACSS_COLOR_ARGUMENTS]
    }, {
        name: 'Stroke width (SVG)',
        instructionName: 'Stkw',
        allowCustomArgument: true,
        css: 'stroke-width:{0}',
        arguments: [{
            i: 'inherit'
        }]
    }, {
        name: 'Stroke linecap (SVG)',
        instructionName: 'Stklc',
        allowCustomArgument: false,
        css: 'stroke-linecap:{0}',
        arguments: [{
            i: 'inherit',
            b: 'butt',
            r: 'round',
            s: 'square'
        }]
    }, {
        name: 'Stroke linejoin (SVG)',
        instructionName: 'Stklj',
        allowCustomArgument: false,
        css: 'stroke-linejoin:{0}',
        arguments: [{
            i: 'inherit',
            b: 'bevel',
            r: 'round',
            m: 'miter'
        }]
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
        if (cmd.length > 3) {
            throw new Error('Command can contain max 2 pipe separators.');
        }
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            if (cmd.length > 2) {
                throw new Error('Meta element command must have max 1 pipe separator.');
            }
        }
        var htmlSelectorInstructionString = cmd[0];
        if (!htmlSelectorInstructionString) {
            throw new Error('Missing HTML selector instruction string.');
        }
        var htmlAttributesInstructionsString = REG_BASE_CMD_IS_PROBABLY_HTML_ATTRIBUTES_INSTRUCTIONS_STRING.test(cmd[1]) ? cmd[1] : null;
        var acssInstructionsString = REG_BASE_CMD_IS_PROBABLY_ACSS_INSTUCTIONS_STRING.test(cmd[1]) ? cmd[1] : (cmd[2] || null);
        if (htmlAttributesInstructionsString && acssInstructionsString) {
            if (htmlAttributesInstructionsString === acssInstructionsString) {
                throw new Error('Ambigious command.');
            }
        }
        if (cmd[1] && cmd[1].length > 0) { // NOT ALL INSTRUCTION NAMES MUST MATCH, WE ARE JUST DIVIDING THERE COMMANDS, IF SOME IS NOT REGISTERED THIS WILL BE VALIDATED IN PER INSTRUCTION VALIDATION
            if (cmd.length === 3 && !htmlAttributesInstructionsString) {
                throw new Error('HTML attributes instructions string - No all instruction names mismatch.');
            }
            if (cmd.length === 2 && !htmlAttributesInstructionsString && !acssInstructionsString) {
                throw new Error('HTML attributes instructions string - No all instruction names mismatch.');
            }
        }
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            if (acssInstructionsString) {
                throw new Error('HTML metatag element must not define ACSS command.');
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
        var i = arrFindIndex(allowedHTMLAttributes, 'instructionName', components[1]);
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
            return new Error('HTML attributes instruction string - Instruction "' + htmlAttribute.instructionName + '" must not define parameter.');
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
        var i = arrFindIndex(ACSS_RULES, 'instructionName', components[1]);
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
        var pseudoElementIndexes = ACSS_PSEUDO_ELEMENT_INDEXES_parse(components[5]);
        return ACSS_INSTRUCTION_compose(acssRule, args, important, pseudoClasses, pseudoElementIndexes);
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
                    return new Error('ACSS instruction arguments - No custom argument at: ' + acssRule.instructionName + '[' + i + ']');
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
                var vb = scores[pseudoClasses.length - 1];
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
    function ACSS_PSEUDO_ELEMENT_INDEXES_parse(pseudoElementsString) {
        var indexes = [];
        var m = pseudoElementsString.match(REG_ACSS_MATCH_PSEUDO_ELEMENTS);
        if (!Array.isArray(m) || m.length === 0) {
            return [];
        }
        for (var i = 0, l = m.length; i < l; i++) {
            var v = m[i];
            var j = arrFindIndex(PSEUDO_ELEMENTS, 'acssValue', v);
            if (j === -1) {
                throw new Error('ACSS pseudo elements - Unsupported element: "' + v + '".');
            }
            indexes.push(j);
        }
        return indexes;
    }
    function ACSS_INSTRUCTION_compose(acssRule, args, important, pseudoClasses, pseudoElementIndexes) {
        return {
            acssRule: acssRule,
            arguments: args,
            important: important,
            pseudoClasses: pseudoClasses,
            pseudoElementIndexes: pseudoElementIndexes
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
