function $strStripWhitespaces(str) {
    return typeof(str) === 'string' ? str.replace(/\s+/, '') : '';
}
