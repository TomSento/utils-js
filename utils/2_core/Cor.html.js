import world from '../world';

/*
 * USAGE CONDITIONS
 * ———
 * - ATTRIBUTE "s" MUST BE LAST
 * - DO NOT USE SPACE BEFORE <span> - SPACE WILL BE REMOVED
 * - ACSS FN USES ()
 * - ACSS PARAM USES [] AS ()
 * - MEDIA QUERY MUST NOT BE USED WITH PSEUDOS, BUT ! IS ALLOWED
 * - ACSS HELPER MUST NOT DEFINE MEDIA QUERY OR PSEUDO
 */
function html(strings, ...vals) {
    var spec_acss = {
        B: { css: 'bottom:$' },
        BdA: {
            helper: true,
            css: `
$0{
    border-width:1px;
    border-style:solid}`
        },
        BdB: {
            helper: true,
            css: `
$0{
    border-top-width:0;
    border-right-width:0;
    border-bottom-width:1px;
    border-left-width:0;
    border-style:solid}`
        },
        Bdbc: { css: 'border-bottom-color:$' },
        Bdbw: { css: 'border-bottom-width:$' },
        Bdc: {
            css: 'border-color:$',
            expand: { t: 'transparent' }
        },
        Bdlc: {
            css: 'border-left-color:$',
            expand: { t: 'transparent' }
        },
        Bdrad: { css: 'border-radius:$' },
        Bdrc: { css: 'border-right-color:$' },
        Bds: {
            css: 'border-style:$',
            expand: { s: 'solid' }
        },
        Bdw: { css: 'border-width:$' },
        Bgc: { css: 'background-color:$' },
        Bgi: {
            css: 'background-image:$',
            expand: { n: 'none' }
        },
        Bgp: {
            css: 'background-position:$',
            expand: { c: 'center' }
        },
        Bgr: {
            css: 'background-repeat:$',
            expand: { nr: 'no-repeat', rx: 'repeat-x' }
        },
        Bgz: {
            css: 'background-size:$',
            expand: { ct: 'contain', cv: 'cover' }
        },
        Bxsh: { css: 'box-shadow:$' },
        Bxz: {
            css: 'box-sizing:$',
            expand: { bb: 'border-box' }
        },
        C: { css: 'color:$' },
        Cf: {
            helper: true,
            css: `
$0:before,$0:after{
    content:' ';
    display:table}
$0:after{clear:both}`
        },
        Cnt: { css: 'content:$' },
        Cur: {
            css: 'cursor:$',
            expand: { d: 'default', p: 'pointer' }
        },
        D: {
            css: 'display:$',
            expand: {
                n: 'none',
                b: 'block',
                i: 'inline',
                ib: 'inline-block'
            }
        },
        Ell: {
            helper: true,
            css: `
$0{
    max-width:100%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    hyphens:none}
$0:after{
    content:'.';
    font-size:0;
    visibility:hidden;
    display:inline-block;
    overflow:hidden;
    height:0;
    width:0}`
        },
        Fl: { css: 'float:$' },
        Fw: {
            css: 'font-weight:$',
            expand: { n: 'normal' }
        },
        Fz: { css: 'font-size:$' },
        H: { css: 'height:$' },
        IbBox: {
            helper: true,
            css: `
$0{
    display:inline-block;
    *display:inline;
    zoom:1;
    vertical-align:top}`
        },
        L: { css: 'left:$' },
        Lh: { css: 'line-height:$' },
        LineClamp: {
            helper: true,
            css: `
$0{
    -webkit-line-clamp:$1;
    max-height:$2;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    overflow:hidden}
@supports(display:-moz-box){$0{display:block}}
a$0{
    display:inline-block;
    display:-webkit-box;
    *display:inline;
    zoom:1}
a$0:after{
    content:'.';
    font-size:0;
    visibility:hidden;
    display:inline-block;
    overflow:hidden;
    height:0;
    width:0}`
        },
        List: {
            css: 'list-style-type:$',
            expand: { n: 'none' }
        },
        M: { css: 'margin:$' },
        Mah: { css: 'max-height:$' },
        Maw: { css: 'max-width:$' },
        Mb: { css: 'margin-bottom:$' },
        Mih: { css: 'min-height:$' },
        Miw: { css: 'min-width:$' },
        Ml: { css: 'margin-left:$' },
        Mr: { css: 'margin-right:$' },
        Mt: { css: 'margin-top:$' },
        Mx: {
            css: `
    margin-left:$;
    margin-right:$`,
            expand: { a: 'auto' }
        },
        My: {
            css: `
    margin-top:$;
    margin-bottom:$`
        },
        O: {
            css: 'outline:$',
            expand: { n: 'none' }
        },
        Op: { css: 'opacity:$' },
        Ov: {
            css: 'overflow:$',
            expand: { a: 'auto', h: 'hidden' }
        },
        Ovx: {
            css: 'overflow-x:$',
            expand: { h: 'hidden' }
        },
        Ovy: {
            css: 'overflow-y:$',
            expand: { a: 'auto' }
        },
        P: { css: 'padding:$' },
        Pb: { css: 'padding-bottom:$' },
        Pl: { css: 'padding-left:$' },
        Pos: {
            css: 'position:$',
            expand: { a: 'absolute', r: 'relative' }
        },
        Pr: { css: 'padding-right:$' },
        Pt: { css: 'padding-top:$' },
        Px: {
            css: `
    padding-left:$;
    padding-right:$`
        },
        Py: {
            css: `
    padding-top:$;
    padding-bottom:$`
        },
        R: { css: 'right:$' },
        StretchedBox: {
            helper: true,
            css: `
$0{
    position:absolute;
    top:0;
    right:0;
    bottom:0;
    left:0}`
        },
        T: { css: 'top:$' },
        Ta: {
            css: 'text-align:$',
            expand: { c: 'center', r: 'right' }
        },
        Td: {
            css: 'text-decoration:$',
            expand: { n: 'none', u: 'underline' }
        },
        TranslateX: { css: 'transform:translateX($)' },
        Trs: { css: 'transition:$' },
        Us: {
            css: 'user-select:$',
            expand: { n: 'none' }
        },
        Va: {
            css: 'vertical-align:$',
            expand: { m: 'middle' }
        },
        W: { css: 'width:$' },
        Z: { css: 'z-index:$' }
    };

    var spec_pseudo = { // ———————————————————————————————————————————————————— LINK / BUTTON STATES
        f: 'focus',
        h: 'hover',
        a: 'active',
        ':b': ':before',
        ':a': ':after',
        ':ph': ':placeholder'
    };

    var encode = {
        '&': 'amp',
        '\'': '#039',
        '"': 'quot',
        '<': 'lt',
        '>': 'gt'
    };


    var i;
    var l;
    var str = ''; // —————————————————————————————————————————————————————————— INSERT VALUE PLACEHOLDERS
    for (i = 0, l = strings.length; i < l; i++) {
        str += strings[i];
        if (i <= l - 2) str += '@[[' + i + ']]';
    }
    str = str.trim();

    var m;
    var next;
    var alpha = /[a-z]/;

    var gap_start_reg = /[a-z"]>/g; // ———————————————————————————————————————— TRIM HTML
    var gap_start;
    var gap_end_look_from;
    var gap_end_loop;
    var gap_end;
    var build_from = 0;
    var builder = '';
    while (m = gap_start_reg.exec(str)) {
        gap_start = m.index + 2;
        gap_end_look_from = gap_start;
        gap_end_loop = true;
        while (gap_end_loop) {
            gap_end = str.indexOf('<', gap_end_look_from);
            if (gap_end === -1) {
                gap_end_loop = false;
                continue;
            }
            next = str[gap_end + 1];
            if (next === '/' || alpha.test(next)) {
                gap_end_loop = false;
                builder += str.slice(build_from, gap_start) + str.slice(gap_start, gap_end).trim();
                build_from = gap_end;
            }
            else {
                gap_end_look_from = gap_end + 2;
            }
        }
    }
    str = builder + str.slice(build_from);
    builder = '';
    build_from = 0;


    var val; // ——————————————————————————————————————————————————————————————— INSERT VALUES
    var val_encode;
    var val_encode_reg = /(&|'|"|<|>)/g;
    var val_start;
    var val_start_abs;
    var val_start_look;
    var val_start_look_from = 0;
    for (i = 0, l = vals.length; i < l; i++) {
        val_start_look = '@[[' + i + ']]';
        val_start = str.indexOf(val_start_look, val_start_look_from);
        if (val_start === -1) break;

        val = vals[i]; // ————————————————————————————————————————————————————— TO STRING
        if (!val || (val.constructor !== Object && val.constructor !== Array)) {
            val = '' + val;
        }
        else {
            try { val = JSON.stringify(val); }
            catch (e) { val = '' + val; }
        }

        val_encode = str[val_start - 1] !== '!'; // ——————————————————————————— ENCODE
        if (val_encode) {
            val = val.replace(val_encode_reg, function(m, k) {
                return '&' + encode[k] + ';';
            });
        }

        val_start_abs = val_encode ? val_start : (val_start - 1);
        str = str.slice(0, val_start_abs) + val + str.slice(val_start + val_start_look.length);
        val_start_look_from = val_start_abs + val.length;
    }


    var s_start;
    var s_start_look = ' s="';
    var s_start_look_from = 2; // 2 - <a

    var el_start;
    var el_start_look_from;
    var el_start_loop;
    var el_start_look = '<';

    var el_end;
    var el_end_look = '">';

    var css = '';

    var class_id;
    var class_start;
    var class_start_look = ' class="';
    var class_end;
    var class_end_look = '" ';


    while (s_start !== -1) { // ——————————————————————————————————————————————— PROCESS STYLED ELEMENTS
        s_start = str.indexOf(s_start_look, s_start_look_from);
        if (s_start === -1) continue;


        el_start = undefined; // —————————————————————————————————————————————— FIND ELEMENT START
        el_start_look_from = s_start - 2; // 2 - <a
        el_start_loop = true;
        while (el_start_loop) {
            el_start = str.lastIndexOf(el_start_look, el_start_look_from);
            if (el_start === -1 || alpha.test(str[el_start + 1])) {
                el_start_loop = false;
                continue;
            }
            el_start_look_from = el_start - 3; // '<' IS NOT REAL START OF ELEMENT, CONTINUE IN SEARCHING
        }
        if (el_start === -1) {
            s_start_look_from += 8;
            continue;
        }


        el_end = str.indexOf(el_end_look, s_start + s_start_look.length); // —— FIND ELEMENT END
        if (el_end === -1) {
            s_start_look_from += 8;
            continue;
        }
        el_end += el_end_look.length;


        class_id = genID(); // ———————————————————————————————————————————————— INSERT ID
        class_start = str.slice(el_start + 2, s_start - 1).indexOf(class_start_look); // 2 - <a
        if (class_start === -1) {
            builder += str.slice(build_from, s_start + 1) + 'class="' + class_id + '">';
        }
        else {
            class_start += el_start + 2; // RELATIVE —> ABSOLUTE INDEX
            class_end = str.indexOf(class_end_look, class_start + class_start_look.length);
            builder += str.slice(build_from, class_end) + ' ' + class_id + str.slice(class_end, s_start) + '>';
        }
        build_from = el_end;


        css += acss2css(class_id, spec_acss, spec_pseudo, str.slice(s_start + s_start_look.length, el_end - el_end_look.length));


        s_start_look_from = s_start + s_start_look.length + el_end_look.length + 2; // 2 - <a
    }
    str = builder + str.slice(build_from);
    builder = undefined;


    return css ? ('<style>' + css + '</style>' + str) : str;
}

function acss2css(class_id, spec_acss, spec_pseudo, cmd) {
    var alpha_i = /[a-z]/i;
    var space = ' ';

    var func_name_end;
    var func_name_end_look = '(';
    var func_name_start;

    var tail_start;
    var tail_start_look = ')';
    var tail_end = -1;

    var func_name;
    var spec_item;
    var tail;
    var important;
    var tail_slice;
    var pseudo;
    var media;
    var arg;
    var css = '';

    while (func_name_end !== -1) {
        func_name_end = cmd.indexOf(func_name_end_look, tail_end + 2); // _C()
        if (func_name_end === -1) continue;
        if (!alpha_i.test(cmd[func_name_end - 1])) {
            tail_end = func_name_end + 2;
            continue;
        }

        func_name_start = cmd.lastIndexOf(space, func_name_end - 2);
        if (func_name_start === -1) {
            func_name_start = 0;
        }
        else {
            func_name_start += 1;
        }


        tail_start = cmd.indexOf(tail_start_look, func_name_end + 1);
        if (tail_start === -1) {
            tail_end = func_name_end + 1;
            continue;
        }
        tail_start += 1;

        tail_end = cmd.indexOf(space, tail_start);
        if (tail_end === -1) {
            tail_end = cmd.length;
        }


        func_name = cmd.slice(func_name_start, func_name_end);
        spec_item = spec_acss[func_name];
        if (!spec_item) throw new Error('bad rule: ' + func_name);

        tail = cmd.slice(tail_start, tail_end);
        important = tail[0] === '!';
        tail_slice = tail.slice(important ? 2 : 1);

        pseudo = !spec_item.helper && (tail[0] === ':' || (important && tail[1] === ':'))
            ? spec_pseudo[tail_slice]
            : undefined;

        media = !spec_item.helper && (tail[0] === '@' || (important && tail[1] === '@'))
            ? parseInt(tail_slice)
            : undefined;

        arg = cmd.slice(func_name_end + 1, tail_start - 1);

        if (spec_item.helper) {
            css = helper2css(class_id, spec_item, arg) + css;
        }
        else {
            css += rule2css(class_id, spec_item, important, pseudo, media, arg);
        }
    }

    return css ? ('\n' + css) : '';
}

function helper2css(class_id, spec_item, arg) {
    var i;

    var $items;
    var $item;

    if (arg) {
        $items = arg.split(',');
        $items.unshift('.' + class_id);
    }
    else {
        $items = ['.' + class_id];
    }

    i = $items.length;
    while (i--) {
        $item = $items[i];
        if ($item[0] === ' ') $items[i] = $item.slice(1);
    }


    var $start;
    var $start_look = '$';
    var $start_look_from = 1; // 1 - \n AT START
    var builder = '';
    var build_from = 1; // 1 - \n AT START
    while ($start !== -1) {
        $start = spec_item.css.indexOf($start_look, $start_look_from);
        if ($start === -1) continue;

        builder += spec_item.css.slice(build_from, $start);
        builder += $items[spec_item.css[$start + 1]] || undefined;
        build_from = $start + 2;

        $start_look_from = $start + 3; // $1_$2
    }
    return builder + spec_item.css.slice(build_from) + '\n';
}

function rule2css(class_id, spec_item, important, pseudo, media, arg) {
    var m;
    var builder = '';
    var build_from = 0;

    var color_reg = /#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})(\.\d+)/ig;
    while (m = color_reg.exec(arg)) {
        builder += arg.slice(build_from, m.index) + 'rgba('
            + parseInt(m[1], 16) + ','
            + parseInt(m[2], 16) + ','
            + parseInt(m[3], 16) + ','
            + m[4] + ')';
        build_from = m.index + m[0].length;
    }
    arg = builder + arg.slice(build_from);
    builder = undefined;


    var expand_reg;
    var expand_key;
    for (expand_key in spec_item.expand) {
        builder = '';
        build_from = 0;
        expand_reg = new RegExp('(?:^| )(?:' + expand_key + ')(?: |$)', 'g');
        while (m = expand_reg.exec(arg)) {
            if (m.index > 0) {
                if (m.index - build_from > 0) builder += arg.slice(build_from, m.index);
                builder += ' ';
                build_from = m.index + 1 + expand_key.length;
            }
            else {
                build_from = expand_key.length;
            }
            builder += spec_item.expand[expand_key];
            expand_reg.lastIndex = build_from;
        }
        arg = builder + arg.slice(build_from);
    }
    expand_reg = undefined;
    builder = undefined;


    var css = '.' + class_id;
    if (pseudo) css += ':' + pseudo;
    css += '{' + spec_item.css.replace(/\$/g, arg || undefined) + '}';

    if (media > 0) css = '@media(min-width:' + media + 'px){' + css + '}';

    return css + '\n';
}

function genID() {
    var l = 5;
    var set = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-0123456789';
    var b = set[Math.floor(Math.random() * (set.length - 12))];
    while (l--) {
        b += set[Math.floor(Math.random() * set.length)];
    }
    return b;
}

if (!world.Cor) world.Cor = {};
world.Cor.html = html;
