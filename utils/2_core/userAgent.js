import world from '../world';
/**
 * CHANGES FROM ORIGINAL PARSER:
 * -- PARSE BY CALLING FUNCTION - ORIGINAL LIBRARY CREATES PARSER INSTANCE
 * -- RETURN "null" INSTEAD OF "undefined" WHEN NO MATCH IS FOUND
 * -- REMOVED DEPRECATED "major" VERSION - YOU CAN JUST CALL "parseInt(versionString)" IN YOUR APP
 * -- FOLLOWING "eslint" RULES LEADED ME TO REMOVE "unnecessary escaped characters in regular expresions"
 * -- NORMALIZE ALL VALUES TO "SNAKE_CASE"
 * -- RETURN RESULT AS FLAT OBJECT
 */
export default function userAgent(str) { // BASED ON https://github.com/faisalman/ua-parser-js/releases/tag/0.7.17
    if (str && typeof(str) !== 'string') {
        throw new Error('api-str');
    }
    str = typeof(str) === 'string' ? (str || '') : ((window && window.navigator && window.navigator.userAgent) || '');
    // ------------------------------------------------------------------------> CORE
    function mapUserAgent(ua, arrays) {
        var result = {};
        var i = 0;
        var matches = null;
        while (i < arrays.length && !matches) { // LOOP THROUGH ALL REGEXES MAPS
            var regex = arrays[i]; // EVEN SEQUENCE (0,2,4,..)
            var props = arrays[i + 1]; // ODD SEQUENCE (1,3,5,..)
            var j = 0;
            var k = 0;
            while (j < regex.length && !matches) { // TRY MATCHING UASTRING WITH REGEXES
                matches = regex[j++].exec(ua);
                if (Array.isArray(matches) && matches.length > 0) {
                    for (var p = 0; p < props.length; p++) {
                        var match = matches[++k];
                        var q = props[p];
                        if (Array.isArray(q) && q.length > 0) { // CHECK IF GIVEN PROPERTY IS ACTUALLY ARRAY
                            if (q.length === 2) {
                                if (isFN(q[1])) {
                                    result[q[0]] = strToSnakeCase(q[1](match)); // ASSIGN MODIFIED MATCH
                                }
                                else {
                                    result[q[0]] = strToSnakeCase(q[1]); // ASSIGN GIVEN VALUE, IGNORE REGEX MATCH
                                }
                            }
                            else if (q.length === 3) {
                                if (isFN(q[1]) && !(q[1].exec && q[1].test)) { // CHECK WHETHER FUNCTION OR REGEX
                                    result[q[0]] = match ? strToSnakeCase(q[1](match, q[2])) : null; // CALL FUNCTION (USUALLY STRING MAPPER)
                                }
                                else {
                                    result[q[0]] = match ? strToSnakeCase(match.replace(q[1], q[2])) : null; // SANITIZE MATCH USING GIVEN REGEX
                                }
                            }
                            else if (q.length === 4) {
                                result[q[0]] = (match && isFN(q[3])) ? strToSnakeCase(q[3](match.replace(q[1], q[2]))) : null;
                            }
                        }
                        else {
                            result[q] = strToSnakeCase(match) || null;
                        }
                    }
                }
            }
            i += 2;
        }
        return result;
        function isFN(v) {
            return (typeof(v) === 'function');
        }
        function strToSnakeCase(str) {
            if (typeof(str) === 'string') {
                return str.replace(/\s+/g, '_').toUpperCase() || null;
            }
            return null;
        }
    }
    function correctBy(match, map) {
        for (var k in map) {
            if (Array.isArray(map[k]) && map[k].length > 0) { // CHECK IF ARRAY
                for (var i = 0; i < map[k].length; i++) {
                    if (strHas(match, map[k][i])) {
                        return (k === '?') ? null : k;
                    }
                }
            }
            else if (strHas(match, map[k])) {
                return (k === '?') ? null : k;
            }
        }
        return match;
        function strHas(str1, str2) {
            if (typeof(str1) === 'string') {
                return str1.toLowerCase().indexOf(str2.toLowerCase()) >= 0;
            }
            return false;
        }
    }
    function strToLowerCase(str) {
        return str.toLowerCase();
    }
    function strTrim(str) {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
    // ------------------------------------------------------------------------> CONFIG
    var NAME = 'name';
    var VERSION = 'version';
    var VENDOR = 'vendor';
    var MODEL = 'model';
    var TYPE = 'type';
    var ARCHITECTURE = 'architecture';

    var CONSOLE = 'CONSOLE';
    var MOBILE = 'MOBILE';
    var TABLET = 'TABLET';
    var SMARTTV = 'SMART_TV';
    var WEARABLE = 'WEARABLE';

    var maps = {
        browser: {
            oldSafari: {
                version: {
                    '1.0': '/8',
                    '1.2': '/1',
                    '1.3': '/3',
                    '2.0': '/412',
                    '2.0.2': '/416',
                    '2.0.3': '/417',
                    '2.0.4': '/419',
                    '?': '/'
                }
            }
        },
        device: {
            amazon: {
                model: {
                    'FIRE_PHONE': ['SD', 'KF']
                }
            },
            sprint: {
                model: {
                    'EVO_SHIFT_4G': '7373KT'
                },
                vendor: {
                    'HTC': 'APA',
                    'SPRINT': 'Sprint'
                }
            }
        },
        os: {
            windows: {
                version: {
                    'ME': '4.90',
                    'NT_3.11': 'NT3.51',
                    'NT_4.0': 'NT4.0',
                    '2000': 'NT 5.0',
                    'XP': ['NT 5.1', 'NT 5.2'],
                    'VISTA': 'NT 6.0',
                    '7': 'NT 6.1',
                    '8': 'NT 6.2',
                    '8.1': 'NT 6.3',
                    '10': ['NT 6.4', 'NT 10.0'],
                    'RT': 'ARM'
                }
            }
        }
    };
    var regexes = {
        browser: [[
            // Presto based
            /(opera\smini)\/([\w.-]+)/i, // ----------------------------------> Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w.-]+)/i, // -----------------> Opera Mobi/Tablet
            /(opera).+version\/([\w.]+)/i, // --------------------------------> Opera > 9.80
            /(opera)[/\s]+([\w.]+)/i // --------------------------------------> Opera < 9.80
        ], [NAME, VERSION], [
            /(opios)[/\s]+([\w.]+)/i // --------------------------------------> Opera mini on iphone >= 8.0
        ], [[NAME, 'Opera Mini'], VERSION], [
            /\s(opr)\/([\w.]+)/i // ------------------------------------------> Opera Webkit
        ], [[NAME, 'Opera'], VERSION], [
            // Mixed
            /(kindle)\/([\w.]+)/i, // ----------------------------------------> Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[/\s]?([\w.]+)*/i, // > Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant\s|iemobile|slim|baidu)(?:browser)?[/\s]?([\w.]*)/i, // ---> Avant/IEMobile/SlimBrowser/Baidu
            /(?:ms|\()(ie)\s([\w.]+)/i, // -----------------------------------> Internet Explorer
            // Webkit/KHTML based
            /(rekonq)\/([\w.]+)*/i, // ---------------------------------------> Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser)\/([\w.-]+)/i // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser
        ], [NAME, VERSION], [
            /(trident).+rv[:\s]([\w.]+).+like\sgecko/i // --------------------> IE11
        ], [[NAME, 'IE'], VERSION], [
            /(edge)\/((\d+)?[\w.]+)/i // -------------------------------------> Microsoft Edge
        ], [NAME, VERSION], [
            /(yabrowser)\/([\w.]+)/i // --------------------------------------> Yandex
        ], [[NAME, 'Yandex'], VERSION], [
            /(puffin)\/([\w.]+)/i // -----------------------------------------> Puffin
        ], [[NAME, 'Puffin'], VERSION], [
            /((?:[\s/])uc?\s?browser|(?:juc.+)ucweb)[/\s]?([\w.]+)/i // ------> UCBrowser
        ], [[NAME, 'UCBrowser'], VERSION], [
            /(comodo_dragon)\/([\w.]+)/i // ----------------------------------> Comodo Dragon
        ], [[NAME, /_/g, ' '], VERSION], [
            /(micromessenger)\/([\w.]+)/i // ---------------------------------> WeChat
        ], [[NAME, 'WeChat'], VERSION], [
            /(QQ)\/([\d.]+)/i // ---------------------------------------------> QQ, aka ShouQ
        ], [NAME, VERSION], [
            /m?(qqbrowser)[/\s]?([\w.]+)/i // --------------------------------> QQBrowser
        ], [NAME, VERSION], [
            /xiaomi\/miuibrowser\/([\w.]+)/i // ------------------------------> MIUI Browser
        ], [VERSION, [NAME, 'MIUI Browser']], [
            /;fbav\/([\w.]+);/i // -------------------------------------------> Facebook App for iOS & Android
        ], [VERSION, [NAME, 'Facebook']], [
            /headlesschrome(?:\/([\w.]+)|\s)/i // ----------------------------> Chrome Headless
        ], [VERSION, [NAME, 'Chrome Headless']], [
            /\swv\).+(chrome)\/([\w.]+)/i // ---------------------------------> Chrome WebView
        ], [[NAME, /(.+)/, '$1 WebView'], VERSION], [
            /((?:oculus|samsung)browser)\/([\w.]+)/i
        ], [[NAME, /(.+(?:g|us))(.+)/, '$1 $2'], VERSION], [ // --------------> Oculus / Samsung Browser
            /android.+version\/([\w.]+)\s+(?:mobile\s?safari|safari)*/i // ---> Android Browser
        ], [VERSION, [NAME, 'Android Browser']], [
            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w.]+)/i // -> Chrome/OmniWeb/Arora/Tizen/Nokia
        ], [NAME, VERSION], [
            /(dolfin)\/([\w.]+)/i // -----------------------------------------> Dolphin
        ], [[NAME, 'Dolphin'], VERSION], [
            /((?:android.+)crmo|crios)\/([\w.]+)/i // ------------------------> Chrome for Android/iOS
        ], [[NAME, 'Chrome'], VERSION], [
            /(coast)\/([\w.]+)/i // ------------------------------------------> Opera Coast
        ], [[NAME, 'Opera Coast'], VERSION], [
            /fxios\/([\w.-]+)/i // -------------------------------------------> Firefox for iOS
        ], [VERSION, [NAME, 'Firefox']], [
            /version\/([\w.]+).+?mobile\/\w+\s(safari)/i // ------------------> Mobile Safari
        ], [VERSION, [NAME, 'Mobile Safari']], [
            /version\/([\w.]+).+?(mobile\s?safari|safari)/i // ---------------> Safari & Safari Mobile
        ], [VERSION, NAME], [
            /webkit.+?(gsa)\/([\w.]+).+?(mobile\s?safari|safari)(\/[\w.]+)/i // Google Search Appliance on iOS
        ], [[NAME, 'GSA'], VERSION], [
            /webkit.+?(mobile\s?safari|safari)(\/[\w.]+)/i // ----------------> Safari < 3.0
        ], [NAME, [VERSION, correctBy, maps.browser.oldSafari.version]], [
            /(konqueror)\/([\w.]+)/i, // -------------------------------------> Konqueror
            /(webkit|khtml)\/([\w.]+)/i
        ], [NAME, VERSION], [
            // Gecko based
            /(navigator|netscape)\/([\w.-]+)/i // ----------------------------> Netscape
        ], [[NAME, 'Netscape'], VERSION], [
            /(swiftfox)/i, // ------------------------------------------------> Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[/\s]?([\w.+]+)/i, // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w.-]+)/i, // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w.]+).+rv:.+gecko\/\d+/i, // ----------------------> Mozilla
            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[/\s]?([\w.]+)/i, // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w.]+)/i, // ---------------------------------------> Links
            /(gobrowser)\/?([\w.]+)*/i, // -----------------------------------> GoBrowser
            /(ice\s?browser)\/v?([\w._]+)/i, // ------------------------------> ICE Browser
            /(mosaic)[/\s]([\w.]+)/i // --------------------------------------> Mosaic
        ], [NAME, VERSION]],
        cpu: [[
            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;)]/i // ----------------> AMD64
        ], [[ARCHITECTURE, 'amd64']], [
            /(ia32(?=;))/i // ------------------------------------------------> IA32 (quicktime)
        ], [[ARCHITECTURE, strToLowerCase]], [
            /((?:i[346]|x)86)[;)]/i // ---------------------------------------> IA32
        ], [[ARCHITECTURE, 'ia32']], [
            /windows\s(ce|mobile);\sppc;/i // --------------------------------> PocketPC mistakenly identified as PowerPC
        ], [[ARCHITECTURE, 'arm']], [
            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i // ---------------------> PowerPC
        ], [[ARCHITECTURE, /ower/, '', strToLowerCase]], [
            /(sun4\w)[;)]/i // -----------------------------------------------> SPARC
        ], [[ARCHITECTURE, 'sparc']], [
            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
        ], [[ARCHITECTURE, strToLowerCase]]],
        device: [[
            /\((ipad|playbook);[\w\s);-]+(rim|apple)/i // --------------------> iPad/PlayBook
        ], [MODEL, VENDOR, [TYPE, TABLET]], [
            /applecoremedia\/[\w.]+ \((ipad)/ // -----------------------------> iPad
        ], [MODEL, [VENDOR, 'Apple'], [TYPE, TABLET]], [
            /(apple\s{0,1}tv)/i // -------------------------------------------> Apple TV
        ], [[MODEL, 'Apple TV'], [VENDOR, 'Apple']], [
            /(archos)\s(gamepad2?)/i, // -------------------------------------> Archos
            /(hp).+(touchpad)/i, // ------------------------------------------> HP TouchPad
            /(hp).+(tablet)/i, // --------------------------------------------> HP Tablet
            /(kindle)\/([\w.]+)/i, // ----------------------------------------> Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i, // -------------------------------> Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i // ----------------------------> Dell Streak
        ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /(kf[A-z]+)\sbuild\/[\w.]+.*silk\//i // --------------------------> Kindle Fire HD
        ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /(sd|kf)[0349hijorstuw]+\sbuild\/[\w.]+.*silk\//i // -------------> Fire Phone
        ], [[MODEL, correctBy, maps.device.amazon.model], [VENDOR, 'Amazon'], [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);.+(apple)/i // -----------------------------> iPod/iPhone
        ], [MODEL, VENDOR, [TYPE, MOBILE]], [
            /\((ip[honed|\s\w*]+);/i // --------------------------------------> iPod/iPhone
        ], [MODEL, [VENDOR, 'Apple'], [TYPE, MOBILE]], [
            /(blackberry)[\s-]?(\w+)/i, // -----------------------------------> BlackBerry
            /(blackberry|benq|palm(?=-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i, // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i, // -----------------------------------------> HP iPAQ
            /(asus)-?(\w+)/i // ----------------------------------------------> Asus
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /\(bb10;\s(\w+)/i // ---------------------------------------------> BlackBerry 10
        ], [MODEL, [VENDOR, 'BlackBerry'], [TYPE, MOBILE]], [ // -------------> Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i
        ], [MODEL, [VENDOR, 'Asus'], [TYPE, TABLET]], [
            /(sony)\s(tablet\s[ps])\sbuild\//i, // ---------------------------> Sony
            /(sony)?(?:sgp.+)\sbuild\//i
        ], [[VENDOR, 'Sony'], [MODEL, 'Xperia Tablet'], [TYPE, TABLET]], [
            /android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i
        ], [MODEL, [VENDOR, 'Sony'], [TYPE, MOBILE]], [
            /\s(ouya)\s/i, // ------------------------------------------------> Ouya
            /(nintendo)\s([wids3u]+)/i // ------------------------------------> Nintendo
        ], [VENDOR, MODEL, [TYPE, CONSOLE]], [
            /android.+;\s(shield)\sbuild/i // --------------------------------> Nvidia
        ], [MODEL, [VENDOR, 'Nvidia'], [TYPE, CONSOLE]], [
            /(playstation\s[34portablevi]+)/i // -----------------------------> Playstation
        ], [MODEL, [VENDOR, 'Sony'], [TYPE, CONSOLE]], [
            /(sprint\s(\w+))/i // --------------------------------------------> Sprint Phones
        ], [[VENDOR, correctBy, maps.device.sprint.vendor], [MODEL, correctBy, maps.device.sprint.model], [TYPE, MOBILE]], [
            /(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i // -------------------> Lenovo tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, // -------------------------> HTC
            /(zte)-(\w+)*/i, // ----------------------------------------------> ZTE
            /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i // Alcatel/GeeksPhone/Lenovo/Nexian/Panasonic/Sony
        ], [VENDOR, [MODEL, /_/g, ' '], [TYPE, MOBILE]], [
            /(nexus\s9)/i // -------------------------------------------------> HTC Nexus 9
        ], [MODEL, [VENDOR, 'HTC'], [TYPE, TABLET]], [
            /d\/huawei([\w\s-]+)[;)]/i,
            /(nexus\s6p)/i // ------------------------------------------------> Huawei
        ], [MODEL, [VENDOR, 'Huawei'], [TYPE, MOBILE]], [
            /(microsoft);\s(lumia[\s\w]+)/i // -------------------------------> Microsoft Lumia
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /[\s(;](xbox(?:\sone)?)[\s);]/i // -------------------------------> Microsoft Xbox
        ], [MODEL, [VENDOR, 'Microsoft'], [TYPE, CONSOLE]], [
            /(kin\.[onetw]{3})/i // ------------------------------------------> Microsoft Kin
        ], [[MODEL, /\./g, ' '], [VENDOR, 'Microsoft'], [TYPE, MOBILE]], [ //   Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w+)*/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i
        ], [MODEL, [VENDOR, 'Motorola'], [TYPE, MOBILE]], [
            /android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i
        ], [MODEL, [VENDOR, 'Motorola'], [TYPE, TABLET]], [
            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i // ------> HbbTV devices
        ], [[VENDOR, strTrim], [MODEL, strTrim], [TYPE, SMARTTV]], [
            /hbbtv.+maple;(\d+)/i
        ], [[MODEL, /^/, 'SmartTV'], [VENDOR, 'Samsung'], [TYPE, SMARTTV]], [
            /\(dtv[);].+(aquos)/i // -----------------------------------------> Sharp
        ], [MODEL, [VENDOR, 'Sharp'], [TYPE, SMARTTV]], [
            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i
        ], [[VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]], [ // ----------------> Samsung
            /smart-tv.+(samsung)/i
        ], [VENDOR, [TYPE, SMARTTV], MODEL], [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,
            /sec-((sgh\w+))/i
        ], [[VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]], [
            /sie-(\w+)*/i // -------------------------------------------------> Siemens
        ], [MODEL, [VENDOR, 'Siemens'], [TYPE, MOBILE]], [
            /(maemo|nokia).*(n900|lumia\s\d+)/i, // --------------------------> Nokia
            /(nokia)[\s_-]?([\w-]+)*/i
        ], [[VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]], [
            /android\s3\.[\s\w;-]{10}(a\d{3})/i // ---------------------------> Acer
        ], [MODEL, [VENDOR, 'Acer'], [TYPE, TABLET]], [
            /android.+([vl]k-?\d{3})\s+build/i // ----------------------------> LG Tablet
        ], [MODEL, [VENDOR, 'LG'], [TYPE, TABLET]], [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i // ---------------> LG Tablet
        ], [[VENDOR, 'LG'], MODEL, [TYPE, TABLET]], [
            /(lg) netcast\.tv/i // -------------------------------------------> LG SmartTV
        ], [VENDOR, MODEL, [TYPE, SMARTTV]], [
            /(nexus\s[45])/i, // ---------------------------------------------> LG
            /lg[e;\s/-]+(\w+)*/i,
            /android.+lg(-?[\d\w]+)\s+build/i
        ], [MODEL, [VENDOR, 'LG'], [TYPE, MOBILE]], [
            /android.+(ideatab[a-z0-9\-\s]+)/i // ----------------------------> Lenovo
        ], [MODEL, [VENDOR, 'Lenovo'], [TYPE, TABLET]], [
            /linux;.+((jolla));/i // -----------------------------------------> Jolla
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /((pebble))app\/[\d.]+\s/i // ------------------------------------> Pebble
        ], [VENDOR, MODEL, [TYPE, WEARABLE]], [
            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i // ----------------------> OPPO
        ], [VENDOR, MODEL, [TYPE, MOBILE]], [
            /crkey/i // ------------------------------------------------------> Google Chromecast
        ], [[MODEL, 'Chromecast'], [VENDOR, 'Google']], [
            /android.+;\s(glass)\s\d/i // ------------------------------------> Google Glass
        ], [MODEL, [VENDOR, 'Google'], [TYPE, WEARABLE]], [
            /android.+;\s(pixel c)\s/i // ------------------------------------> Google Pixel C
        ], [MODEL, [VENDOR, 'Google'], [TYPE, TABLET]], [
            /android.+;\s(pixel xl|pixel)\s/i // -----------------------------> Google Pixel
        ], [MODEL, [VENDOR, 'Google'], [TYPE, MOBILE]], [
            /android.+(\w+)\s+build\/hm\1/i, // ------------------------------> Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, // ---------> Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i, // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+)?)\s+build/i // > Redmi Phones
        ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, MOBILE]], [
            /android.+(mi[\s\-_]*(?:pad)?(?:[\s_]*[\w\s]+)?)\s+build/i // ----> Mi Pad tablets
        ], [[MODEL, /_/g, ' '], [VENDOR, 'Xiaomi'], [TYPE, TABLET]], [
            /android.+;\s(m[1-5]\snote)\sbuild/i // --------------------------> Meizu Tablet
        ], [MODEL, [VENDOR, 'Meizu'], [TYPE, TABLET]], [
            /android.+a000(1)\s+build/i // -----------------------------------> OnePlus
        ], [MODEL, [VENDOR, 'OnePlus'], [TYPE, MOBILE]], [
            /android.+[;/]\s*(RCT[\d\w]+)\s+build/i // -----------------------> RCA Tablets
        ], [MODEL, [VENDOR, 'RCA'], [TYPE, TABLET]], [
            /android.+[;/]\s*(Venue[\d\s]*)\s+build/i // ---------------------> Dell Venue Tablets
        ], [MODEL, [VENDOR, 'Dell'], [TYPE, TABLET]], [
            /android.+[;/]\s*(Q[T|M][\d\w]+)\s+build/i // --------------------> Verizon Tablet
        ], [MODEL, [VENDOR, 'Verizon'], [TYPE, TABLET]], [
            /android.+[;/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i // > Barnes & Noble Tablet
        ], [[VENDOR, 'Barnes & Noble'], MODEL, [TYPE, TABLET]], [
            /android.+[;/]\s+(TM\d{3}.*\b)\s+build/i // ----------------------> Barnes & Noble Tablet
        ], [MODEL, [VENDOR, 'NuVision'], [TYPE, TABLET]], [
            /android.+[;/]\s*(zte)?.+(k\d{2})\s+build/i // -------------------> ZTE K Series Tablet
        ], [[VENDOR, 'ZTE'], MODEL, [TYPE, TABLET]], [
            /android.+[;/]\s*(gen\d{3})\s+build.*49h/i // --------------------> Swiss GEN Mobile
        ], [MODEL, [VENDOR, 'Swiss'], [TYPE, MOBILE]], [
            /android.+[;/]\s*(zur\d{3})\s+build/i // -------------------------> Swiss ZUR Tablet
        ], [MODEL, [VENDOR, 'Swiss'], [TYPE, TABLET]], [
            /android.+[;/]\s*((Zeki)?TB.*\b)\s+build/i // --------------------> Zeki Tablets
        ], [MODEL, [VENDOR, 'Zeki'], [TYPE, TABLET]], [
            /(android).+[;/]\s+([YR]\d{2}x?.*)\s+build/i,
            /android.+[;/]\s+(Dragon[-\s]+Touch\s+|DT)(.+)\s+build/i // ------> Dragon Touch Tablet
        ], [[VENDOR, 'Dragon Touch'], MODEL, [TYPE, TABLET]], [
            /android.+[;/]\s*(NS-?.+)\s+build/i // ---------------------------> Insignia Tablets
        ], [MODEL, [VENDOR, 'Insignia'], [TYPE, TABLET]], [
            /android.+[;/]\s*((NX|Next)-?.+)\s+build/i // --------------------> NextBook Tablets
        ], [MODEL, [VENDOR, 'NextBook'], [TYPE, TABLET]], [
            /android.+[;/]\s*(Xtreme_?)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i
        ], [[VENDOR, 'Voice'], MODEL, [TYPE, MOBILE]], [ // ------------------> Voice Xtreme Phones
            /android.+[;/]\s*(LVTEL-?)?(V1[12])\s+build/i // -----------------> LvTel Phones
        ], [[VENDOR, 'LvTel'], MODEL, [TYPE, MOBILE]], [
            /android.+[;/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i // -----> Envizen Tablets
        ], [MODEL, [VENDOR, 'Envizen'], [TYPE, TABLET]], [
            /android.+[;/]\s*(Le[\s-]+Pan)[\s-]+(.*\b)\s+build/i // ----------> Le Pan Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /android.+[;/]\s*(Trio[\s-]*.*)\s+build/i // ---------------------> MachSpeed Tablets
        ], [MODEL, [VENDOR, 'MachSpeed'], [TYPE, TABLET]], [
            /android.+[;/]\s*(Trinity)[-\s]*(T\d{3})\s+build/i // ------------> Trinity Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /android.+[;/]\s*TU_(1491)\s+build/i // --------------------------> Rotor Tablets
        ], [MODEL, [VENDOR, 'Rotor'], [TYPE, TABLET]], [
            /android.+(KS(.+))\s+build/i // ----------------------------------> Amazon Kindle Tablets
        ], [MODEL, [VENDOR, 'Amazon'], [TYPE, TABLET]], [
            /android.+(Gigaset)[\s-]+(Q.+)\s+build/i // ----------------------> Gigaset Tablets
        ], [VENDOR, MODEL, [TYPE, TABLET]], [
            /\s(tablet|tab)[;/]/i, // ----------------------------------------> Unidentifiable Tablet
            /\s(mobile)(?:[;/]|\ssafari)/i // --------------------------------> Unidentifiable Mobile
        ], [[TYPE, strToLowerCase], VENDOR, MODEL], [
            /(android.+)[;/].+build/i // -------------------------------------> Generic Android Device
        ], [MODEL, [VENDOR, 'Generic']]],
        engine: [[
            /windows.+\sedge\/([\w.]+)/i // ----------------------------------> EdgeHTML
        ], [VERSION, [NAME, 'EdgeHTML']], [
            /(presto)\/([\w.]+)/i, // ----------------------------------------> Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w.]+)/i, // > WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m
            /(khtml|tasman|links)[/\s]\(?([\w.]+)/i, // ----------------------> KHTML/Tasman/Links
            /(icab)[/\s]([23]\.[\d.]+)/i // ----------------------------------> iCab
        ], [NAME, VERSION], [
            /rv:([\w.]+).*(gecko)/i // ---------------------------------------> Gecko
        ], [VERSION, NAME]],
        os: [[
            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i // ---------------------------> Windows (iTunes)
        ], [NAME, VERSION], [
            /(windows)\snt\s6\.2;\s(arm)/i, // -------------------------------> Windows RT
            /(windows\sphone(?:\sos)*)[\s/]?([\d.\s]+\w)*/i, // --------------> Windows Phone
            /(windows\smobile|windows)[\s/]?([ntce\d.\s]+\w)/i
        ], [NAME, [VERSION, correctBy, maps.os.windows.version]], [
            /(win(?=3|9|n)|win\s9x\s)([nt\d.]+)/i
        ], [[NAME, 'Windows'], [VERSION, correctBy, maps.os.windows.version]], [
            // Mobile/Embedded OS
            /\((bb)(10);/i // ------------------------------------------------> BlackBerry 10
        ], [[NAME, 'BlackBerry'], VERSION], [
            /(blackberry)\w*\/?([\w.]+)*/i, // -------------------------------> Blackberry
            /(tizen)[/\s]([\w.]+)/i, // --------------------------------------> Tizen
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[/\s-]?([\w.]+)*/i, // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki
            /linux;.+(sailfish);/i // ----------------------------------------> Sailfish OS
        ], [NAME, VERSION], [
            /(symbian\s?os|symbos|s60(?=;))[/\s-]?([\w.]+)*/i // -------------> Symbian
        ], [[NAME, 'Symbian'], VERSION], [
            /\((series40);/i // ----------------------------------------------> Series 40
        ], [NAME], [
            /mozilla.+\(mobile;.+gecko.+firefox/i // -------------------------> Firefox OS
        ], [[NAME, 'Firefox OS'], VERSION], [
            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i, // -------------> Nintendo/Playstation
            // GNU/Linux based
            /(mint)[/\s(]?(\w+)*/i, // ---------------------------------------> Mint
            /(mageia|vectorlinux)[;\s]/i, // ---------------------------------> Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[/\s-]?(?!chrom)([\w.-]+)*/i, // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w.]+)*/i, // ----------------------------------> Hurd/Linux
            /(gnu)\s?([\w.]+)*/i // ------------------------------------------> GNU
        ], [NAME, VERSION], [
            /(cros)\s[\w]+\s([\w.]+\w)/i // ----------------------------------> Chromium OS
        ], [[NAME, 'Chromium OS'], VERSION], [
            // Solaris
            /(sunos)\s?([\w.]+\d)*/i // --------------------------------------> Solaris
        ], [[NAME, 'Solaris'], VERSION], [
            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w.]+)*/i // --------------> FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
        ], [NAME, VERSION], [
            /(haiku)\s(\w+)/i // ---------------------------------------------> Haiku
        ], [NAME, VERSION], [
            /cfnetwork\/.+darwin/i,
            /ip[honead]+(?:.*os\s([\w]+)\slike\smac|;\sopera)/i // -----------> iOS
        ], [[VERSION, /_/g, '.'], [NAME, 'iOS']], [
            /(mac\sos\sx)\s?([\w\s.]+\w)*/i,
            /(macintosh|mac(?=_powerpc)\s)/i // ------------------------------> Mac OS
        ], [[NAME, 'Mac OS'], [VERSION, /_/g, '.']], [
            // Other
            /((?:open)?solaris)[/\s-]?([\w.]+)*/i, // ------------------------> Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w.]*)*/i, // --------------------------> AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, //  Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS
            /(unix)\s?([\w.]+)*/i // -----------------------------------------> UNIX
        ], [NAME, VERSION]]
    };
    // ------------------------------------------------------------------------> PROCESS
    var browser = mapUserAgent(str, regexes.browser);
    var engine = mapUserAgent(str, regexes.engine);
    var os = mapUserAgent(str, regexes.os);
    var device = mapUserAgent(str, regexes.device);
    var result = {
        ua: str,
        browserName: browser.name || null,
        browserVersion: browser.version || null,
        engineName: engine.name || null,
        engineVersion: engine.version || null,
        osName: os.name || null,
        osVersion: os.version || null,
        deviceVendor: device.vendor || null,
        deviceModel: device.model || null,
        deviceType: device.type || null,
        cpu: mapUserAgent(str, regexes.cpu).architecture || null
    };
    return result;
}
if (!world.Cor) world.Cor = {};
world.Cor.userAgent = userAgent;
