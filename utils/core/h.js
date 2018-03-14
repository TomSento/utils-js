exports.H = function(command, a, b) {
    /**
     * CONSTANTS
     */

    // BOTH ATTRIBUTES AND ACSS INSTRUCTIONS MUST HAVE PARENS () - THIS IS DIFFERENT FROM YAHOO'S ACSS WHICH SUPPORTS HELPERS WITHOUT THEM

    // SELECTOR|ATTRIBUTES|ACSS

    // SELECTOR
    // - META - ONLY TAG
    // - BODY - TAG | CLASSES - no spaces, only dots

    // CHAIN WITH 3 STEPS - SELECTOR PROCESS RUNS ALWAYS BUT NOT ALWAYS SAME
    // -


    var REG_GENERAL_NO_INVALID_FIRST_LETTER = /^[^A-Z]/;
    var REG_GENERAL_NO_MULTIPLE_SPACES = /\s{2,}/;
    var REG_GENERAL_NO_MULTIPLE_COMMAS = /,\s*,/;
    var REG_GENERAL_NO_SPACES_AROUND_PIPE = /(?:\s+\|)|(?:\|\s+)/;
    var REG_GENERAL_NO_LOWERCASE_FUNCTIONS = /\b[a-z]\w+\(/;
    var REG_GENERAL_NO_SPACES = /\s+/g; // FOR EXAMPLE TO CHECK IF STRING CONTAINS SOMETHING MORE THAN ONLY SPACES
    var REG_GENERAL_NO_SPACES_AT_START_OR_END = /^\s|\s$/;

    var REG_GENERAL_STARTS_WITH_METATAG = /^(Doc|Head|Meta|Title)(?![A-z0-9])/;
    var REG_GENERAL_STARTS_WITH_BODYTAG = /^(A|Abbr|Address|Area|Article|Aside|Audio|B|Base|Bdi|Bdo|BlockQuote|Body|Br|Btn|Canvas|Caption|Cite|Code|Col|ColGroup|DataList|Dd|Del|Details|Dfn|Dialog|Div|Dl|Dt|Em|Embeded|FieldSet|FigCaption|Figure|Footer|Form|H1|H2|H3|H4|H5|H6|Header|Hr|I|Iframe|Img|Input|Ins|Kbd|Label|Legend|Li|Main|Map|Mark|Menu|MenuItem|Meter|Nav|NoScript|Object|Ol|OptGroup|Option|Output|P|Param|Picture|Pre|Progress|Q|Rp|Rt|Ruby|S|Samp|Script|Section|Select|Small|Source|Span|Strong|Sub|Summary|Sup|Svg|Table|Tbody|Td|Template|TextArea|TFoot|Th|THead|Time|Tr|Track|U|Ul|Var|Video|Wbr)(?![A-z0-9])/; // https://www.w3schools.com/tags/default.asp
    var REG_GENERAL_STARTS_WITH_UPPERCASE = /^[A-Z]/;

    var REG_GENERAL_IS_POSSIBLY_HTML_ATTRIBUTES_INSTRUCTION_STRING = /(Lang|Charset|Name|Property|HttpEquiv|Content)(?![A-z0-9])/;
    var REG_GENERAL_IS_POSSIBLY_ACSS_INSTUCTIONS_STRING = /(Anim|Animdel|Animdir|Animdur|Animfm|Animic|Animn|Animps|Animtf|Ap|Bd|Bdx|Bdy|Bdt|Bdend|Bdb|Bdstart|Bdc|Bdtc|Bdendc|Bdbc|Bdstartc|Bdsp|Bds|Bdts|Bdends|Bdbs|Bdstarts|Bdw|Bdtw|Bdendw|Bdbw|Bdstartw|Bdrs|Bdrstend|Bdrsbend|Bdrsbstart|Bdrststart|Bg|Bgi|Bgc|Bgcp|Bgo|Bgz|Bga|Bgp|Bgpx|Bgpy|Bgr|Bdcl|Bxz|Bxsh|Cl|C|Ctn|Cnt|Cur|D|Fil|Blur|Brightness|Contrast|Dropshadow|Grayscale|HueRotate|Invert|Opacity|Saturate|Sepia|Flx|Fx|Flxg|Fxg|Flxs|Fxs|Flxb|Fxb|As|Fld|Fxd|Flf|Fxf|Ai|Ac|Or|Jc|Flw|Fxw|Fl|Ff|Fw|Fz|Fs|Fv|H|Hy|Lts|List|Lisp|Lisi|Lh|M|Mx|My|Mt|Mend|Mb|Mstart|Mah|Maw|Mih|Miw|O|T|End|B|Start|Op|Ov|Ovx|Ovy|Ovs|P|Px|Py|Pt|Pend|Pb|Pstart|Pe|Pos|Rsz|Tbl|Ta|Tal|Td|Ti|Tov|Tren|Tr|Tt|Tsh|Trf|Trfo|Trfs|Prs|Prso|Bfv|Matrix|Matrix3d|Rotate|Rotate3d|RotateX|RotateY|RotateZ|Scale|Scale3d|ScaleX|ScaleY|Skew|SkewX|SkewY|Translate|Translate3d|TranslateX|TranslateY|TranslateZ|Trs|Trsde|Trsdu|Trsp|Trstf|Us|Va|V|Whs|Whsc|W|Wob|Wow|Z|Fill|Stk|Stkw|Stklc|Stklj)(?![A-z0-9])/; // LAST CLOSURE IS NEEDED, OTHERWISE Stkljaaaa WOULD MATCH

    var REG_GENERAL_SPLIT_BY_PIPE = /\|/;
    var REG_GENERAL_SPLIT_BY_DOT = /\./;
    var REG_GENERAL_SPLIT_BY_HASH = /#/;
    var REG_GENERAL_SPLIT_BY_OPEN_BRACKET = /\(/;

    var REG_HTML_ATTRIBUTES_CMD_NO_MISSING_SPACE_AFTER_FUNCTION = /\)(?!\s|$)/;
    var REG_HTML_ATTRIBUTES_CMD_SPLIT_TO_CMDS = /[A-Z].*?\)/g;

    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_CHAR_BODYTAG = /[^A-z0-9#.]/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_CHAR_METATAG = /[^A-z0-9]/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_DOTS = /\.{2,}/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_HASHES = /#{2,}/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_DOT_AT_START_OR_END = /^\.|\.$/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_AT_START_OR_END = /^#|#$/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_FOLLOWED_BY_UNALLOWED_CHAR = /#[^A-z0-9]/;
    var REG_HTML_SELECTOR_INSTRUCTION_STRING_MATCH_COMPONENTS = /[A-Z.#][a-z0-9_-]+/g;

    var REG_ACSS_IS_VAR_CMD = /^--/;

    var HTML_TEMPLATES = {
        Doc: '<!DOCTYPE html><html{modifiers}>{content}</html>',
        Head: '<head>{content}</head>',
        Meta: '<meta{modifiers}>',
        Title: '<title>{content}</title>',
        Div: '<div{modifiers}>{content}</div>',
        Span: '<span{modifiers}>{content}</span>'
    };
    var HTML_ATTRIBUTES = {
        Doc: [{
            instructionName: 'Lang',
            html: 'lang={0}'
        }],
        Head: [],
        Meta: [{ // MANDATORY ORDER
            instructionName: 'Charset',
            html: 'charset={0}'
        }, {
            instructionName: 'Name',
            html: 'name={0}'
        }, {
            instructionName: 'Property',
            html: 'property={0}'
        }, {
            instructionName: 'HttpEquiv',
            html: 'http-equiv={0}'
        }, {
            instructionName: 'Content',
            html: 'content={0}'
        }],
        Title: []
    };

    /**
     * ACSS CONSTANTS
     */
    var ACSS_COLOR_SHORTCUTS = {
        t: 'transparent',
        cc: 'currentColor',
        n: 'none'
        // aliceblue: 'aliceblue',
        // antiquewhite: 'antiquewhite',
        // aqua: 'aqua',
        // aquamarine: 'aquamarine',
        // azure: 'azure',
        // beige: 'beige',
        // bisque: 'bisque',
        // black: 'black',
        // blanchedalmond: 'blanchedalmond',
        // blue: 'blue',
        // blueviolet: 'blueviolet',
        // brown: 'brown',
        // burlywood: 'burlywood',
        // cadetblue: 'cadetblue',
        // chartreuse: 'chartreuse',
        // chocolate: 'chocolate',
        // coral: 'coral',
        // cornflowerblue: 'cornflowerblue',
        // cornsilk: 'cornsilk',
        // crimson: 'crimson',
        // cyan: 'cyan',
        // darkblue: 'darkblue',
        // darkcyan: 'darkcyan',
        // darkgoldenrod: 'darkgoldenrod',
        // darkgray: 'darkgray',
        // darkgreen: 'darkgreen',
        // darkgrey: 'darkgrey',
        // darkkhaki: 'darkkhaki',
        // darkmagenta: 'darkmagenta',
        // darkolivegreen: 'darkolivegreen',
        // darkorange: 'darkorange',
        // darkorchid: 'darkorchid',
        // darkred: 'darkred',
        // darksalmon: 'darksalmon',
        // darkseagreen: 'darkseagreen',
        // darkslateblue: 'darkslateblue',
        // darkslategray: 'darkslategray',
        // darkslategrey: 'darkslategrey',
        // darkturquoise: 'darkturquoise',
        // darkviolet: 'darkviolet',
        // deeppink: 'deeppink',
        // deepskyblue: 'deepskyblue',
        // dimgray: 'dimgray',
        // dimgrey: 'dimgrey',
        // dodgerblue: 'dodgerblue',
        // firebrick: 'firebrick',
        // floralwhite: 'floralwhite',
        // forestgreen: 'forestgreen',
        // fuchsia: 'fuchsia',
        // gainsboro: 'gainsboro',
        // ghostwhite: 'ghostwhite',
        // gold: 'gold',
        // goldenrod: 'goldenrod',
        // gray: 'gray',
        // green: 'green',
        // greenyellow: 'greenyellow',
        // grey: 'grey',
        // honeydew: 'honeydew',
        // hotpink: 'hotpink',
        // indianred: 'indianred',
        // indigo: 'indigo',
        // ivory: 'ivory',
        // khaki: 'khaki',
        // lavender: 'lavender',
        // lavenderblush: 'lavenderblush',
        // lawngreen: 'lawngreen',
        // lemonchiffon: 'lemonchiffon',
        // lightblue: 'lightblue',
        // lightcoral: 'lightcoral',
        // lightcyan: 'lightcyan',
        // lightgoldenrodyellow: 'lightgoldenrodyellow',
        // lightgray: 'lightgray',
        // lightgreen: 'lightgreen',
        // lightgrey: 'lightgrey',
        // lightpink: 'lightpink',
        // lightsalmon: 'lightsalmon',
        // lightseagreen: 'lightseagreen',
        // lightskyblue: 'lightskyblue',
        // lightslategray: 'lightslategray',
        // lightslategrey: 'lightslategrey',
        // lightsteelblue: 'lightsteelblue',
        // lightyellow: 'lightyellow',
        // lime: 'lime',
        // limegreen: 'limegreen',
        // linen: 'linen',
        // magenta: 'magenta',
        // maroon: 'maroon',
        // mediumaquamarine: 'mediumaquamarine',
        // mediumblue: 'mediumblue',
        // mediumorchid: 'mediumorchid',
        // mediumpurple: 'mediumpurple',
        // mediumseagreen: 'mediumseagreen',
        // mediumslateblue: 'mediumslateblue',
        // mediumspringgreen: 'mediumspringgreen',
        // mediumturquoise: 'mediumturquoise',
        // mediumvioletred: 'mediumvioletred',
        // midnightblue: 'midnightblue',
        // mintcream: 'mintcream',
        // mistyrose: 'mistyrose',
        // moccasin: 'moccasin',
        // navajowhite: 'navajowhite',
        // navy: 'navy',
        // oldlace: 'oldlace',
        // olive: 'olive',
        // olivedrab: 'olivedrab',
        // orange: 'orange',
        // orangered: 'orangered',
        // orchid: 'orchid',
        // palegoldenrod: 'palegoldenrod',
        // palegreen: 'palegreen',
        // paleturquoise: 'paleturquoise',
        // palevioletred: 'palevioletred',
        // papayawhip: 'papayawhip',
        // peachpuff: 'peachpuff',
        // peru: 'peru',
        // pink: 'pink',
        // plum: 'plum',
        // powderblue: 'powderblue',
        // purple: 'purple',
        // red: 'red',
        // rosybrown: 'rosybrown',
        // royalblue: 'royalblue',
        // saddlebrown: 'saddlebrown',
        // salmon: 'salmon',
        // sandybrown: 'sandybrown',
        // seagreen: 'seagreen',
        // seashell: 'seashell',
        // sienna: 'sienna',
        // silver: 'silver',
        // skyblue: 'skyblue',
        // slateblue: 'slateblue',
        // slategray: 'slategray',
        // slategrey: 'slategrey',
        // snow: 'snow',
        // springgreen: 'springgreen',
        // steelblue: 'steelblue',
        // tan: 'tan',
        // teal: 'teal',
        // thistle: 'thistle',
        // tomato: 'tomato',
        // turquoise: 'turquoise',
        // violet: 'violet',
        // wheat: 'wheat',
        // white: 'white',
        // whitesmoke: 'whitesmoke',
        // yellow: 'yellow',
        // yellowgreen: 'yellowgreen'
    };
    var ACSS_RULES = [{ // MANDATORY ORDER
        name: 'Animation',
        instructionName: 'Anim',
        // allowParamTransformation: true,
        css: 'animation:{0}'
    }, {
        name: 'Animation delay',
        instructionName: 'Animdel',
        // allowParamTransformation: true,
        css: 'animation-delay:{0}'
    }, {
        name: 'Animation direction',
        instructionName: 'Animdir',
        // allowParamTransformation: false,
        css: 'animation-direction:{0}',
        arguments: [{
            a: 'alternate',
            ar: 'alternate-reverse',
            n: 'normal',
            r: 'reverse'
        }]
    }, {
        name: 'Animation duration',
        instructionName: 'Animdur',
        // allowParamTransformation: true,
        css: 'animation-duration:{0}'
    }, {
        name: 'Animation fill mode',
        instructionName: 'Animfm',
        // allowParamTransformation: false,
        css: 'animation-fill-mode:{0}',
        arguments: [{
            b: 'backwards',
            bo: 'both',
            f: 'forwards',
            n: 'none'
        }]
    }, {
        name: 'Animation iteration count',
        instructionName: 'Animic',
        // allowParamTransformation: true,
        css: 'animation-iteration-count:{0}',
        arguments: [{
            i: 'infinite'
        }]
    }, {
        name: 'Animation name',
        instructionName: 'Animn',
        // allowParamTransformation: true,
        css: 'animation-name:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Animation play state',
        instructionName: 'Animps',
        // allowParamTransformation: false,
        css: 'animation-play-state:{0}',
        arguments: [{
            p: 'paused',
            r: 'running'
        }]
    }, {
        name: 'Animation timing function',
        instructionName: 'Animtf',
        // allowParamTransformation: false,
        css: 'animation-timing-function:{0}',
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
        // allowParamTransformation: false,
        css: 'appearance:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Border',
        instructionName: 'Bd',
        // allowParamTransformation: false,
        css: 'border:{0}',
        arguments: [{
            // '0': 0,
            n: 'none'
        }]
    }, {
        name: 'Border X',
        instructionName: 'Bdx',
        // allowParamTransformation: false,
        css: [
            'border-{start}:{0}',
            'border-{end}:{0}'
        ]
    }, {
        name: 'Border Y',
        instructionName: 'Bdy',
        // allowParamTransformation: false,
        css: [
            'border-top:{0}',
            'border-bottom:{0}'
        ]
    }, {
        name: 'Border top',
        instructionName: 'Bdt',
        // allowParamTransformation: false,
        css: 'border-top:{0}'
    }, {
        name: 'Border end',
        instructionName: 'Bdend',
        // allowParamTransformation: false,
        css: 'border-{end}:{0}'
    }, {
        name: 'Border bottom',
        instructionName: 'Bdb',
        // allowParamTransformation: false,
        css: 'border-bottom:{0}'
    }, {
        name: 'Border start',
        instructionName: 'Bdstart',
        // allowParamTransformation: false,
        css: 'border-{start}:{0}'
    }, {
        name: 'Border color',
        instructionName: 'Bdc',
        // allowParamTransformation: true,
        css: 'border-color:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Border top color',
        instructionName: 'Bdtc',
        // allowParamTransformation: true,
        css: 'border-top-color:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Border end color',
        instructionName: 'Bdendc',
        // allowParamTransformation: true,
        css: 'border-{end}-color:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Border bottom color',
        instructionName: 'Bdbc',
        // allowParamTransformation: true,
        css: 'border-bottom-color:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Border start color',
        instructionName: 'Bdstartc',
        // allowParamTransformation: true,
        css: 'border-{start}-color:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Border spacing',
        instructionName: 'Bdsp',
        // allowParamTransformation: true,
        css: 'border-spacing:{0} {1}',
        arguments: [{
            i: 'inherit'
        }]
    }, {
        name: 'Border style',
        instructionName: 'Bds',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        name: 'Border end style',
        instructionName: 'Bdends',
        // allowParamTransformation: false,
        css: 'border-{end}-style:{0}',
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
        // allowParamTransformation: false,
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
        name: 'Border start style',
        instructionName: 'Bdstarts',
        // allowParamTransformation: false,
        css: 'border-{start}-style:{0}',
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
        // allowParamTransformation: true,
        css: 'border-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border top width',
        instructionName: 'Bdtw',
        // allowParamTransformation: true,
        css: 'border-top-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border end width',
        instructionName: 'Bdendw',
        // allowParamTransformation: true,
        css: 'border-{end}-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border bottom width',
        instructionName: 'Bdbw',
        // allowParamTransformation: true,
        css: 'border-bottom-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border start width',
        instructionName: 'Bdstartw',
        // allowParamTransformation: true,
        css: 'border-{start}-width:{0}',
        arguments: [{
            m: 'medium',
            t: 'thin',
            th: 'thick'
        }]
    }, {
        name: 'Border radius',
        instructionName: 'Bdrs',
        // allowParamTransformation: true,
        css: 'border-radius:{0}'
    }, {
        name: 'Border radius top right',
        instructionName: 'Bdrstend',
        // allowParamTransformation: true,
        css: 'border-top-{end}-radius:{0}'
    }, {
        name: 'Border radius bottom right',
        instructionName: 'Bdrsbend',
        // allowParamTransformation: true,
        css: 'border-bottom-{end}-radius:{0}'
    }, {
        name: 'Border radius bottom left',
        instructionName: 'Bdrsbstart',
        // allowParamTransformation: true,
        css: 'border-bottom-{start}-radius:{0}'
    }, {
        name: 'Border radius top left',
        instructionName: 'Bdrststart',
        // allowParamTransformation: true,
        css: 'border-top-{start}-radius:{0}'
    }, {
        name: 'Background',
        instructionName: 'Bg',
        // allowParamTransformation: false,
        css: 'background:{0}',
        arguments: [{
            n: 'none',
            t: 'transparent'
        }]
    }, {
        name: 'Background image',
        instructionName: 'Bgi',
        // allowParamTransformation: false,
        css: 'background-image:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Background color',
        instructionName: 'Bgc',
        // allowParamTransformation: true,
        css: 'background-color:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Background clip',
        instructionName: 'Bgcp',
        // allowParamTransformation: false,
        css: 'background-clip:{0}',
        arguments: [{
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        }]
    }, {
        name: 'Background origin',
        instructionName: 'Bgo',
        // allowParamTransformation: false,
        css: 'background-origin:{0}',
        arguments: [{
            bb: 'border-box',
            cb: 'content-box',
            pb: 'padding-box'
        }]
    }, {
        name: 'Background size',
        instructionName: 'Bgz',
        // allowParamTransformation: true,
        css: 'background-size:{0}',
        arguments: [{
            a: 'auto',
            ct: 'contain',
            cv: 'cover'
        }]
    }, {
        name: 'Background attachment',
        instructionName: 'Bga',
        // allowParamTransformation: false,
        css: 'background-attachment:{0}',
        arguments: [{
            f: 'fixed',
            l: 'local',
            s: 'scroll'
        }]
    }, {
        name: 'Background position',
        instructionName: 'Bgp',
        // allowParamTransformation: true,
        css: 'background-position:{0} {1}',
        arguments: [{
            start_t: '{start} 0',
            end_t: '{end} 0',
            start_b: '{start} 100%',
            end_b: '{end} 100%',
            start_c: '{start} center',
            end_c: '{end} center',
            c_b: 'center 100%',
            c_t: 'center 0',
            c: 'center'
        }]
    }, {
        name: 'Background position (X axis)',
        instructionName: 'Bgpx',
        // allowParamTransformation: true,
        css: 'background-position-x:{0}',
        arguments: [{
            start: '{start}',
            end: '{end}',
            c: '50%'
        }]
    }, {
        name: 'Background position (Y axis)',
        instructionName: 'Bgpy',
        // allowParamTransformation: true,
        css: 'background-position-y:{0}',
        arguments: [{
            t: '0',
            b: '100%',
            c: '50%'
        }]
    }, {
        name: 'Background repeat',
        instructionName: 'Bgr',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'border-collapse:{0}',
        arguments: [{
            c: 'collapse',
            s: 'separate'
        }]
    }, {
        name: 'Box sizing',
        instructionName: 'Bxz',
        // allowParamTransformation: false,
        css: 'box-sizing:{0}',
        arguments: [{
            cb: 'content-box',
            pb: 'padding-box',
            bb: 'border-box'
        }]
    }, {
        name: 'Box shadow',
        instructionName: 'Bxsh',
        // allowParamTransformation: false,
        css: 'box-shadow:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Clear',
        instructionName: 'Cl',
        // allowParamTransformation: false,
        css: 'clear:{0}',
        arguments: [{
            n: 'none',
            b: 'both',
            start: '{start}',
            end: '{end}'
        }]
    }, {
        name: 'Color',
        instructionName: 'C',
        // allowParamTransformation: true,
        css: 'color:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Contain',
        instructionName: 'Ctn',
        // allowParamTransformation: false,
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
        // allowParamTransformation: true,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'filter:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Blur (filter)',
        instructionName: 'Blur',
        // allowParamTransformation: true,
        css: 'filter:blur({0})'
    }, {
        name: 'Brightness (filter)',
        instructionName: 'Brightness',
        // allowParamTransformation: true,
        css: 'filter:brightness({0})'
    }, {
        name: 'Contrast (filter)',
        instructionName: 'Contrast',
        // allowParamTransformation: true,
        css: 'filter:contrast({0})'
    }, {
        name: 'Drop shadow (filter)',
        instructionName: 'Dropshadow',
        // allowParamTransformation: false,
        css: 'filter:drop-shadow({0})'
    }, {
        name: 'Grayscale (filter)',
        instructionName: 'Grayscale',
        // allowParamTransformation: true,
        css: 'filter:grayscale({0})'
    }, {
        name: 'Hue Rotate (filter)',
        instructionName: 'HueRotate',
        // allowParamTransformation: true,
        css: 'filter:hue-rotate({0})'
    }, {
        name: 'Invert (filter)',
        instructionName: 'Invert',
        // allowParamTransformation: true,
        css: 'filter:invert({0})'
    }, {
        name: 'Opacity (filter)',
        instructionName: 'Opacity',
        // allowParamTransformation: true,
        css: 'filter:opacity({0})'
    }, {
        name: 'Saturate (filter)',
        instructionName: 'Saturate',
        // allowParamTransformation: true,
        css: 'filter:saturate({0})'
    }, {
        name: 'Sepia (filter)',
        instructionName: 'Sepia',
        // allowParamTransformation: true,
        css: 'filter:sepia({0})'
    }, {
        name: 'Flex (deprecated)',
        instructionName: 'Flx',
        // allowParamTransformation: false,
        css: 'flex:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Flex',
        instructionName: 'Fx',
        // allowParamTransformation: false,
        css: 'flex:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Flex grow (deprecated)',
        instructionName: 'Flxg',
        // allowParamTransformation: true,
        css: 'flex-grow:{0}'
    }, {
        name: 'Flex grow',
        instructionName: 'Fxg',
        // allowParamTransformation: true,
        css: 'flex-grow:{0}'
    }, {
        name: 'Flex shrink (deprecated)',
        instructionName: 'Flxs',
        // allowParamTransformation: true,
        css: 'flex-shrink:{0}'
    }, {
        name: 'Flex shrink',
        instructionName: 'Fxs',
        // allowParamTransformation: true,
        css: 'flex-shrink:{0}'
    }, {
        name: 'Flex basis (deprecated)',
        instructionName: 'Flxb',
        // allowParamTransformation: true,
        css: 'flex-basis:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Flex basis',
        instructionName: 'Fxb',
        // allowParamTransformation: true,
        css: 'flex-basis:{0}',
        arguments: [{
            a: 'auto',
            n: 'none'
        }]
    }, {
        name: 'Align self',
        instructionName: 'As',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: true,
        css: 'order:{0}'
    }, {
        name: 'Justify content',
        instructionName: 'Jc',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'flex-wrap:{0}',
        arguments: [{
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }]
    }, {
        name: 'Flex-wrap',
        instructionName: 'Fxw',
        // allowParamTransformation: false,
        css: 'flex-wrap:{0}',
        arguments: [{
            nw: 'nowrap',
            w: 'wrap',
            wr: 'wrap-reverse'
        }]
    }, {
        name: 'Float',
        // allowParamTransformation: false,
        instructionName: 'Fl',
        css: 'float:{0}',
        arguments: [{
            n: 'none',
            start: '{start}',
            end: '{end}'
        }]
    }, {
        name: 'Font family',
        instructionName: 'Ff',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: true,
        css: 'font-size:{0}'
    }, {
        name: 'Font style',
        instructionName: 'Fs',
        // allowParamTransformation: false,
        css: 'font-style:{0}',
        arguments: [{
            n: 'normal',
            i: 'italic',
            o: 'oblique'
        }]
    }, {
        name: 'Font variant',
        instructionName: 'Fv',
        // allowParamTransformation: false,
        css: 'font-variant:{0}',
        arguments: [{
            n: 'normal',
            sc: 'small-caps'
        }]
    }, {
        name: 'Height',
        instructionName: 'H',
        // allowParamTransformation: true,
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
        // allowParamTransformation: false,
        css: 'hyphens:{0}',
        arguments: [{
            a: 'auto',
            n: 'normal',
            m: 'manual'
        }]
    }, {
        name: 'Letter spacing',
        instructionName: 'Lts',
        // allowParamTransformation: true,
        css: 'letter-spacing:{0}',
        arguments: [{
            n: 'normal'
        }]
    }, {
        name: 'List style type',
        instructionName: 'List',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'list-style-position:{0}',
        arguments: [{
            i: 'inside',
            o: 'outside'
        }]
    }, {
        name: 'List style image',
        instructionName: 'Lisi',
        // allowParamTransformation: false,
        css: 'list-style-image:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Line height',
        instructionName: 'Lh',
        // allowParamTransformation: true,
        css: 'line-height:{0}',
        arguments: [{
            n: 'normal'
        }]
    }, {
        name: 'Margin (all edges)',
        instructionName: 'M',
        // allowParamTransformation: true,
        css: 'margin:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin (X axis)',
        instructionName: 'Mx',
        // allowParamTransformation: true,
        css: [
            'margin-{start}:{0}',
            'margin-{end}:{0}'
        ],
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin (Y axis)',
        instructionName: 'My',
        // allowParamTransformation: true,
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
        // allowParamTransformation: true,
        css: 'margin-top:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin end',
        instructionName: 'Mend',
        // allowParamTransformation: true,
        css: 'margin-{end}:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin bottom',
        instructionName: 'Mb',
        // allowParamTransformation: true,
        css: 'margin-bottom:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Margin start',
        instructionName: 'Mstart',
        // allowParamTransformation: true,
        css: 'margin-{start}:{0}',
        arguments: [{
            // '0': '0',
            a: 'auto'
        }]
    }, {
        name: 'Max height',
        instructionName: 'Mah',
        // allowParamTransformation: true,
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
        // allowParamTransformation: true,
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
        // allowParamTransformation: true,
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
        // allowParamTransformation: true,
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
        // allowParamTransformation: false,
        css: 'outline:{0}',
        arguments: [{
            // '0': '0',
            n: 'none'
        }]
    }, {
        name: 'Top',
        instructionName: 'T',
        // allowParamTransformation: true,
        css: 'top:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'End',
        instructionName: 'End',
        // allowParamTransformation: true,
        css: '{end}:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Bottom',
        instructionName: 'B',
        // allowParamTransformation: true,
        css: 'bottom:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Start',
        instructionName: 'Start',
        // allowParamTransformation: true,
        css: '{start}:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Opacity',
        instructionName: 'Op',
        // allowParamTransformation: true,
        css: 'opacity:{0}'
        // arguments: [{
        // '0': '0',
        // '1': '1'
        // }]
    }, {
        name: 'Overflow',
        instructionName: 'Ov',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: '-webkit-overflow-scrolling:{0}',
        arguments: [{
            a: 'auto',
            touch: 'touch'
        }]
    }, {
        name: 'Padding (all edges)',
        instructionName: 'P',
        // allowParamTransformation: true,
        css: 'padding:{0}'
    }, {
        name: 'Padding (X axis)',
        instructionName: 'Px',
        // allowParamTransformation: true,
        css: [
            'padding-{start}:{0}',
            'padding-{end}:{0}'
        ]
    }, {
        name: 'Padding (Y axis)',
        instructionName: 'Py',
        // allowParamTransformation: true,
        css: [
            'padding-top:{0}',
            'padding-bottom:{0}'
        ]
    }, {
        name: 'Padding top',
        instructionName: 'Pt',
        // allowParamTransformation: true,
        css: 'padding-top:{0}'
    }, {
        name: 'Padding end',
        instructionName: 'Pend',
        // allowParamTransformation: true,
        css: 'padding-{end}:{0}'
    }, {
        name: 'Padding bottom',
        instructionName: 'Pb',
        // allowParamTransformation: true,
        css: 'padding-bottom:{0}'
    }, {
        name: 'Padding start',
        instructionName: 'Pstart',
        // allowParamTransformation: true,
        css: 'padding-{start}:{0}'
    }, {
        name: 'Pointer events',
        instructionName: 'Pe',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'table-layout:{0}',
        arguments: [{
            a: 'auto',
            f: 'fixed'
        }]
    }, {
        name: 'Text align',
        instructionName: 'Ta',
        // allowParamTransformation: false,
        css: 'text-align:{0}',
        arguments: [{
            c: 'center',
            e: 'end',
            end: '{end}',
            j: 'justify',
            mp: 'match-parent',
            s: 'start',
            start: '{start}'
        }]
    }, {
        name: 'Text align last',
        instructionName: 'Tal',
        // allowParamTransformation: false,
        css: 'text-align-last:{0}',
        arguments: [{
            a: 'auto',
            c: 'center',
            e: 'end',
            end: '{end}',
            j: 'justify',
            s: 'start',
            start: '{start}'
        }]
    }, {
        name: 'Text decoration',
        instructionName: 'Td',
        // allowParamTransformation: false,
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
        // allowParamTransformation: true,
        css: 'text-indent:{0}'
    }, {
        name: 'Text overflow',
        instructionName: 'Tov',
        // allowParamTransformation: false,
        css: 'text-overflow:{0}',
        arguments: [{
            c: 'clip',
            e: 'ellipsis'
        }]
    }, {
        name: 'Text rendering',
        instructionName: 'Tren',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'text-replace:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Text transform',
        instructionName: 'Tt',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'text-shadow:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Transform',
        instructionName: 'Trf',
        // allowParamTransformation: false,
        css: 'transform:{0}'
    }, {
        name: 'Transform origin',
        instructionName: 'Trfo',
        // allowParamTransformation: true,
        css: 'transform-origin:{0} {1}',
        arguments: [{
            t: 'top',
            end: '{end}',
            bottom: 'bottom',
            start: '{start}',
            c: 'center'
        }, {
            t: 'top',
            end: '{end}',
            bottom: 'bottom',
            start: '{start}',
            c: 'center'
        }]
    }, {
        name: 'Transform style',
        instructionName: 'Trfs',
        // allowParamTransformation: false,
        css: 'transform-style:{0}',
        arguments: [{
            f: 'flat',
            p: 'preserve-3d'
        }]
    }, {
        name: 'Perspective',
        instructionName: 'Prs',
        // allowParamTransformation: true,
        css: 'perspective:{0}',
        arguments: [{
            n: 'none'
        }]
    }, {
        name: 'Perspective origin',
        instructionName: 'Prso',
        // allowParamTransformation: true,
        css: 'perspective-origin:{0} {1}',
        arguments: [{
            t: 'top',
            end: '{end}',
            bottom: 'bottom',
            start: '{start}',
            c: 'center'
        }, {
            t: 'top',
            end: '{end}',
            bottom: 'bottom',
            start: '{start}',
            c: 'center'
        }]
    }, {
        name: 'Backface visibility',
        instructionName: 'Bfv',
        // allowParamTransformation: false,
        css: 'backface-visibility:{0}',
        arguments: [{
            h: 'hidden',
            v: 'visible'
        }]
    }, {
        name: 'Matrix (transform)',
        instructionName: 'Matrix',
        // allowParamTransformation: false,
        css: 'transform:matrix({0})'
    }, {
        name: 'Matrix 3d (transform)',
        instructionName: 'Matrix3d',
        // allowParamTransformation: false,
        css: 'transform:matrix({0})'
    }, {
        name: 'Rotate (transform)',
        instructionName: 'Rotate',
        // allowParamTransformation: true,
        css: 'transform:rotate({0})'
    }, {
        name: 'Rotate 3d (transform)',
        instructionName: 'Rotate3d',
        // allowParamTransformation: true,
        css: 'transform:rotate3d({0},{1},{2},{3})'
    }, {
        name: 'RotateX (transform)',
        instructionName: 'RotateX',
        // allowParamTransformation: true,
        css: 'transform:rotateX({0})'
    }, {
        name: 'RotateY (transform)',
        instructionName: 'RotateY',
        // allowParamTransformation: true,
        css: 'transform:rotateY({0})'
    }, {
        name: 'RotateZ (transform)',
        instructionName: 'RotateZ',
        // allowParamTransformation: true,
        css: 'transform:rotateZ({0})'
    }, {
        name: 'Scale (transform)',
        instructionName: 'Scale',
        // allowParamTransformation: true,
        css: 'transform:scale({0},{1})'
    }, {
        name: 'Scale 3d (transform)',
        instructionName: 'Scale3d',
        // allowParamTransformation: true,
        css: 'transform:scale3d({0},{1},{2})'
    }, {
        name: 'ScaleX (transform)',
        instructionName: 'ScaleX',
        // allowParamTransformation: true,
        css: 'transform:scaleX({0})'
    }, {
        name: 'ScaleY (transform)',
        instructionName: 'ScaleY',
        // allowParamTransformation: true,
        css: 'transform:scaleY({0})'
    }, {
        name: 'Skew (transform)',
        instructionName: 'Skew',
        // allowParamTransformation: true,
        css: 'transform:skew({0},{1})'
    }, {
        name: 'SkewX (transform)',
        instructionName: 'SkewX',
        // allowParamTransformation: true,
        css: 'transform:skewX({0})'
    }, {
        name: 'SkewY (transform)',
        instructionName: 'SkewY',
        // allowParamTransformation: true,
        css: 'transform:skewY({0})'
    }, {
        name: 'Translate (transform)',
        instructionName: 'Translate',
        // allowParamTransformation: true,
        css: 'transform:translate({0},{1})'
    }, {
        name: 'Translate 3d (transform)',
        instructionName: 'Translate3d',
        // allowParamTransformation: true,
        css: 'transform:translate3d({0},{1},{2})'
    }, {
        name: 'Translate X (transform)',
        instructionName: 'TranslateX',
        // allowParamTransformation: true,
        css: 'transform:translateX({0})'
    }, {
        name: 'Translate Y (transform)',
        instructionName: 'TranslateY',
        // allowParamTransformation: true,
        css: 'transform:translateY({0})'
    }, {
        name: 'Translate Z (transform)',
        instructionName: 'TranslateZ',
        // allowParamTransformation: true,
        css: 'transform:translateZ({0})'
    }, {
        name: 'Transition',
        instructionName: 'Trs',
        // allowParamTransformation: false,
        css: 'transition:{0}'
    }, {
        name: 'Transition delay',
        instructionName: 'Trsde',
        // allowParamTransformation: true,
        css: 'transition-delay:{0}',
        arguments: [{
            i: 'initial'
        }]
    }, {
        name: 'Transition duration',
        instructionName: 'Trsdu',
        // allowParamTransformation: true,
        css: 'transition-duration:{0}'
    }, {
        name: 'Transition property',
        instructionName: 'Trsp',
        // allowParamTransformation: false,
        css: 'transition-property:{0}',
        arguments: [{
            a: 'all'
        }]
    }, {
        name: 'Transition timing function',
        instructionName: 'Trstf',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'visibility:{0}',
        arguments: [{
            v: 'visible',
            h: 'hidden',
            c: 'collapse'
        }]
    }, {
        name: 'White space',
        instructionName: 'Whs',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
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
        // allowParamTransformation: true,
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
        // allowParamTransformation: false,
        css: 'word-break:{0}',
        arguments: [{
            ba: 'break-all',
            ka: 'keep-all',
            n: 'normal'
        }]
    }, {
        name: 'Word wrap',
        instructionName: 'Wow',
        // allowParamTransformation: false,
        css: 'word-wrap:{0}',
        arguments: [{
            bw: 'break-word',
            n: 'normal'
        }]
    }, {
        name: 'Z index',
        instructionName: 'Z',
        // allowParamTransformation: true,
        css: 'z-index:{0}',
        arguments: [{
            a: 'auto'
        }]
    }, {
        name: 'Fill (SVG)',
        instructionName: 'Fill',
        // allowParamTransformation: false,
        css: 'fill:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Stroke (SVG)',
        instructionName: 'Stk',
        // allowParamTransformation: false,
        css: 'stroke:{0}',
        arguments: [ACSS_COLOR_SHORTCUTS]
    }, {
        name: 'Stroke width (SVG)',
        instructionName: 'Stkw',
        // allowParamTransformation: true,
        css: 'stroke-width:{0}',
        arguments: [{
            i: 'inherit'
        }]
    }, {
        name: 'Stroke linecap (SVG)',
        instructionName: 'Stklc',
        // allowParamTransformation: false,
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
        // allowParamTransformation: false,
        css: 'stroke-linejoin:{0}',
        arguments: [{
            i: 'inherit',
            b: 'bevel',
            r: 'round',
            m: 'miter'
        }]
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
    var err = VALIDATE_BASE_CMD(command);
    if (err) {
        throw err;
    }
    else {
        return BASE_CMD_process(command, data, content);
    }

    // OLD - PARSING ONE COMMAND
    // function HTML_ATTRIBUTES_parseOneCMD(cmd) {
    //     var tmp = cmd.split('(');
    //     if (!Array.isArray(tmp) || tmp.length !== 2) {
    //         throw new Error('Unable to parse attribute "' + cmd + '".');
    //     }
    //     var k = tmp[0];
    //     if (!k) {
    //         throw new Error('Unable to parse attribute "' + cmd + '".');
    //     }
    //     var m = cmd.match(/\((.*)\)/);
    //     if (m) {
    //         var v = m[1] || '';
    //         return composeHTMLAttribute(k, v);
    //     }
    //     else {
    //         throw new Error('Unable to parse attribute "' + cmd + '".');
    //     }
    // }
    // function composeHTMLAttribute(fnName, fnParam) {
    //     return {
    //         fnName: fnName,
    //         fnParam: fnParam
    //     };
    // }

    // SEPARATE ACSS COMMANDS: /[A-Z].*?\)(?:@lg|@md|@sm|@xs)?/g

    // function validateAcssCMD(cmd) {
    //     if (/\)(?!@|\s|$)/.test(cmd[1])) {
    //         return new Error('Missing space after function\'s ")".');
    //     }
    //     if (/\)(?!@lg|@md|@sm|@xs|\s|$)/.test(cmd[1])) {
    //         return new Error('Unsupported @media query.');
    //     }
    //     return null;
    // }

    function BASE_CMD_process(cmd, data, content) { // NO MULTIPLE SPACES, NO SPACES AROUND PIPE, FUNCTIONS STARTS WITH CAPITAL LETTER
        data = BASE_CMD_parse(cmd, data, content);
    }

    function BASE_CMD_parse(cmd) {
        var type = BASE_CMD_GET_TYPE(cmd);
        if (type === BASE_CMD_TYPE_ACSS_VAR()) {
            return ACSS_VAR_process(cmd);
        }
        else if (type === BASE_CMD_TYPE_HTML_METATAG() || type === BASE_CMD_TYPE_HTML_BODYTAG()) {
            // var attributes = {};
            // var acss = {};
            cmd = BASE_CMD_parseTriple(type, cmd);
            console.log('CMD:', cmd);
            var selector = HTML_SELECTOR_INSTRUCTION_STRING_parse(type, cmd.htmlSelectorInstructionString);
            console.log('SELECTOR:', selector);
        }
        else {
            throw new Error('Unsupported command type.');
        }
    }

    function HTML_SELECTOR_INSTRUCTION_STRING_parse(type, instructionString) {
        var err = VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING(type, instructionString);
        if (err) {
            throw err;
        }
        var components = instructionString.match(REG_HTML_SELECTOR_INSTRUCTION_STRING_MATCH_COMPONENTS);
        var htmlSelectorTag = null;
        var htmlSelectorID = null;
        var htmlSelectorClasses = [];
        for (var i = 0, l = components.length; i < l; i++) {
            var component = components[i];
            if (i > 0) {
                var t = component[0];
                if (t === '.') {
                    htmlSelectorClasses.push(component);
                }
                else if (t === '#') {
                    if (htmlSelectorClasses.length > 0) {
                        throw new Error('Invalid HTML selector components order.');
                    }
                    htmlSelectorID = component;
                }
            }
            else {
                if (REG_GENERAL_STARTS_WITH_UPPERCASE.test(component)) {
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

    // function HTML_BODYTAG_CMD_process(cmd) {
    //     var m = cmd.match(/\|/g);
    //     if (m && m.length > 1) {
    //         throw new Error('No multiple "|".');
    //     }
    //     var map = {
    //         'Doc': '<!DOCTYPE html><html{modifiers}>{content}</html>',
    //         'Head': '<head>{content}</head>',
    //         'Meta': '<meta{modifiers}>',
    //         'Title': '<title>{content}</title>'
    //     };
    //     cmd = cmd.split('|');
    //     if (cmd[1]) {
    //         err = HTML_ATTRIBUTES_beforeParseValidateCMD(cmd[1]);
    //         if (err) {
    //             throw err;
    //         }
    //         var attrsCMDs = HTML_ATTRIBUTES_parseCMD(cmd[1]);
    //         ATTRS_parse(cmd[1]);
    //     }
    //     var template = map[cmd[0]] || null;
    //     if (template) {
    //         return template.replace('{modifiers}', HTML_ATTRIBUTES_);
    //         [cmd[0], template, attrsCMDs];
    //     }
    //     else {
    //         throw new Error('Invalid left-hand "' + cmd[0] + '" operator.');
    //     }
    // }

    function ACSS_VAR_process(cmd) {
        var variable = ACSS_VAR_parseVAR(cmd);
        var cache = exports.malloc('__H');
        var variables = cache('variables') || {};
        if (variables[variable.key]) {
            throw new Error('No duplicate variable.');
        }
        else {
            variables[variable.key] = variable.value;
            cache('variable', variables);
        }
    }

    function ACSS_VAR_parseVAR(cmd) {
        cmd = cmd.split(/\s*:\s*/);
        var key = cmd[0];
        var value = cmd[1];
        if (key && value) {
            return ACSS_VAR_composeVAR(key, value);
        }
        else {
            throw new Error('Invalid ACSS variable separator.');
        }
    }

    function ACSS_VAR_composeVAR(key, value) {
        return {
            key: key,
            value: value
        };
    }

    // ORDER CHECKING
    // function HTML_ATTRIBUTES_processCMD(cmd) {
    //     var map = {
    //         'Doc': [
    //             ['Lang', 'lang']
    //         ],
    //         'Head': [],
    //         'Meta': [
    //             ['Charset', 'charset'],
    //             ['Name', 'name'],
    //             ['Property', 'property'],
    //             ['HttpEquiv', 'http-equiv'],
    //             ['Content', 'content']
    //         ],
    //         'Title': []
    //     };
    //     var mapPairs = map[cmd[0]];
    //     var controls = cmd[1];
    //     var modifiers = '';
    //     var previous = -1;
    //     for (var i = 0, len = controls.length; i < len; i++) {
    //         var control = controls[i];
    //         var found = false;
    //         for (var j = 0, l = mapPairs.length; j < l; j++) {
    //             var pair = mapPairs[j];
    //             if (pair[0] === control[0]) {
    //                 if (j < previous) {
    //                     return throwRightHandFunctionOrderMismatchError(mapPairs, controls);
    //                 }
    //                 else { // FUNCTION WAS FOUND AND FUNCTIONS CHAIN IS IN SAME ORDER AS IN MAP
    //                     found = true;
    //                     modifiers += ' ' + control[0] + '="' + control[1] + '"';
    //                     previous = j;
    //                     break;
    //                 }
    //             }
    //         }
    //         if (!found) {
    //             throw new Error('Unsupported right-hand function "' + control[0] + '()".');
    //         }
    //     }
    //     return cmd[2].replace('{modifiers}', modifiers);
    // }
    // function throwRightHandFunctionOrderMismatchError(mapPairs, controls) {
    //     var msg = 'Incorrect right-hand function order, expected:';
    //     for (var i = 0, l = mapPairs.length; i < l; i++) {
    //         var pair = mapPairs[i];
    //         for (var j = 0, ll = controls.length; j < ll; j++) {
    //             var control = controls[j];
    //             if (control[0] === pair[0]) {
    //                 msg += ' ' + pair[0] + '()';
    //                 break;
    //             }
    //         }
    //     }
    //     throw new Error(msg + '.');
    // }

    function BASE_CMD_parseTriple(type, cmd) {
        cmd = cmd.split(REG_GENERAL_SPLIT_BY_PIPE);
        if (cmd && cmd.length > 3) {
            throw new Error('Command can contain max 2 pipe separators.');
        }
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            if (cmd.length > 2) {
                throw new Error('Meta element command must have max 1 pipe separator.');
            }
        }
        var htmlSelectorInstructionString = cmd[0];
        if (htmlSelectorInstructionString) {
            var htmlAttributesInstructionsString = REG_GENERAL_IS_POSSIBLY_HTML_ATTRIBUTES_INSTRUCTION_STRING.test(cmd[1]) ? cmd[1] : null;
            var acssInstructionsString = REG_GENERAL_IS_POSSIBLY_ACSS_INSTUCTIONS_STRING.test(cmd[1]) ? cmd[1] : (cmd[2] || null);
            if (htmlAttributesInstructionsString && acssInstructionsString) {
                if (htmlAttributesInstructionsString === acssInstructionsString) {
                    throw new Error('Ambigious command.');
                }
            }
            return BASE_CMD_composeTripleObject(type, htmlSelectorInstructionString, htmlAttributesInstructionsString, acssInstructionsString);
        }
        else {
            throw new Error('Missing HTML selector command.');
        }
    }

    function BASE_CMD_composeTripleObject(type, htmlSelectorInstructionString, htmlAttributesInstructionsString, acssInstructionsString) {
        return {
            type: type,
            htmlSelectorInstructionString: htmlSelectorInstructionString,
            htmlAttributesInstructionsString: htmlAttributesInstructionsString,
            acssInstructionsString: acssInstructionsString
        };
    }

    /**
     * TYPES
     */
    function BASE_CMD_GET_TYPE(cmd) {
        if (REG_ACSS_IS_VAR_CMD.test(cmd)) {
            return BASE_CMD_TYPE_ACSS_VAR();
        }
        else if (REG_GENERAL_STARTS_WITH_METATAG.test(cmd)) {
            return BASE_CMD_TYPE_HTML_METATAG();
        }
        else if (REG_GENERAL_STARTS_WITH_BODYTAG.test(cmd)) {
            return BASE_CMD_TYPE_HTML_BODYTAG();
        }
        else {
            return null;
        }
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

    /**
     * VALIDATE HTML SELECTOR INSTRUCTION STRING
     */
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING(type, instructionString) {
        if (type === BASE_CMD_TYPE_HTML_METATAG()) {
            return VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_FOR_METATAG(instructionString);
        }
        else if (type === BASE_CMD_TYPE_HTML_BODYTAG()) {
            return VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_FOR_BODYTAG(instructionString);
        }
        else {
            return null;
        }
    }

    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_FOR_BODYTAG(firstPartOfCMD) {
        return VALIDATE_STR_AGAINST(firstPartOfCMD, [
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedBodyTagCharacter,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noMultipleDots,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noMultipleHashes,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noDotAtStartOrEnd,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noHashAtStartOrEnd,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noHashFollowedByUnallowedChar,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noInvalidFirstLetter,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noSpaces
        ]);
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_FOR_METATAG(firstPartOfCMD) {
        return VALIDATE_STR_AGAINST(firstPartOfCMD, [
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noInvalidFirstLetter,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noSpaces,
            VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedMetaTagCharacter
        ]);
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noInvalidFirstLetter(v) {
        if (REG_GENERAL_NO_INVALID_FIRST_LETTER.test(v)) {
            return new Error('HTML selector instruction string - No invalid first letter.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noSpaces(v) {
        if (REG_GENERAL_NO_SPACES.test(v)) {
            return new Error('HTML selector instruction string - No spaces.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedBodyTagCharacter(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_CHAR_BODYTAG.test(v)) {
            return new Error('HTML selector instruction string - No unallowed character.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noUnallowedMetaTagCharacter(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_UNALLOWED_CHAR_METATAG.test(v)) {
            return new Error('HTML selector instruction string - No unallowed character.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noMultipleDots(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_DOTS.test(v)) {
            return new Error('HTML selector instruction string - No multiple dots.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noMultipleHashes(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_MULTIPLE_HASHES.test(v)) {
            return new Error('HTML selector instruction string - No multiple hashes.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noDotAtStartOrEnd(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_DOT_AT_START_OR_END.test(v)) {
            return new Error('HTML selector instruction string - No dot at start or end.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noHashAtStartOrEnd(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_AT_START_OR_END.test(v)) {
            return new Error('HTML selector instruction string - No hash at start or end.');
        }
        return null;
    }
    function VALIDATE_HTML_SELECTOR_INSTRUCTION_STRING_noHashFollowedByUnallowedChar(v) {
        if (REG_HTML_SELECTOR_INSTRUCTION_STRING_NO_HASH_FOLLOWED_BY_UNALLOWED_CHAR.test(v)) {
            return new Error('HTML selector instruction string - No hash followed by unallowed char.');
        }
        return null;
    }

    /**
     * GENERAL VALIDATION
     */
    function VALIDATE_BASE_CMD(v) {
        return VALIDATE_STR_AGAINST(v, [
            VALIDATE_BASE_CMD_spaceAtStartOrEnd,
            VALIDATE_BASE_CMD_multipleSpaces,
            VALIDATE_BASE_CMD_multipleCommas,
            VALIDATE_BASE_CMD_spacesAroundPipe,
            VALIDATE_BASE_CMD_functionsWithNonCapitalLetters
        ]);
    }
    function VALIDATE_BASE_CMD_spaceAtStartOrEnd(v) {
        if (REG_GENERAL_NO_SPACES_AT_START_OR_END.test(v)) {
            return new Error('No spaces at start or end.');
        }
        return null;
    }
    function VALIDATE_BASE_CMD_multipleSpaces(v) {
        if (REG_GENERAL_NO_MULTIPLE_SPACES.test(v)) {
            return new Error('No multiple spaces.');
        }
        return null;
    }
    function VALIDATE_BASE_CMD_multipleCommas(v) {
        if (REG_GENERAL_NO_MULTIPLE_COMMAS.test(v)) {
            return new Error('No multiple commas.');
        }
        return null;
    }
    function VALIDATE_BASE_CMD_spacesAroundPipe(v) {
        if (REG_GENERAL_NO_SPACES_AROUND_PIPE.test(v)) {
            return new Error('No spaces around pipe.');
        }
        return null;
    }
    function VALIDATE_BASE_CMD_functionsWithNonCapitalLetters(v) {
        if (REG_GENERAL_NO_LOWERCASE_FUNCTIONS.test(v)) {
            return new Error('Functions must start with capital letter.');
        }
        return null;
    }

    function VALIDATE_STR_AGAINST(str, validations) {
        for (var i = 0, l = validations.length; i < l; i++) {
            var err = validations[i](str);
            if (err) {
                return err;
            }
        }
        return null;
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
            if (typeof(a) === 'string') {
                if (k.indexOf('@media') >= 0) {
                    return k + '){' + a + '}';
                }
                else {
                    return k + '{' + cssPROPERTY(a) + '}';
                }
            }
            else if (Array.isArray(a)) {
                var b = '';
                for (var i = 0, l = a.length; i < l; i++) {
                    var v = a[i];
                    b += v ? cssPROPERTY(v) : '';
                }
                return b ? (k + '{' + b + '}') : '';
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
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
};

// function normalizeCSSKeyframes(v) {
//     var arr = [];
//     var index = 0;
//     while (index !== -1) {
//         index = v.indexOf('@keyframes', index + 1);
//         if (index === -1) {
//             continue;
//         }
//         var counter = 0;
//         var end = -1;
//         for (var indexer = index + 10; indexer < v.length; indexer++) {
//             if (v[indexer] === '{') {
//                 counter++;
//             }
//             if (v[indexer] !== '}') {
//                 continue;
//             }
//             if (counter > 1) {
//                 counter--;
//                 continue;
//             }
//             end = indexer;
//             break;
//         }
//         if (end === -1) {
//             continue;
//         }
//         var css = v.substring(index, end + 1);
//         arr.push({
//             name: 'keyframes',
//             property: css
//         });
//     }
//     var output = [];
//     var len = arr.length;
//     for (var i = 0; i < len; i++) {
//         var name = arr[i].name;
//         var property = arr[i].property;
//         if (name !== 'keyframes') {
//             continue;
//         }
//         var plus = property.substring(1);
//         var delimiter = '\n';
//         var updated = '@' + plus + delimiter;
//         updated += '@-webkit-' + plus + delimiter;
//         updated += '@-moz-' + plus + delimiter;
//         updated += '@-o-' + plus + delimiter;
//         v = strReplace(v, property, '@[[' + output.length + ']]');
//         output.push(updated);
//     }
//     len = output.length;
//     for (var j = 0; j < len; j++) {
//         v = v.replace('@[[' + j + ']]', output[j]);
//     }
//     return v;
// }

// function strReplace(str, find, to) {
//     var beg = str.indexOf(find);
//     return beg === -1 ? str : (str.substring(0, beg) + to + str.substring(beg + find.length));
// }
