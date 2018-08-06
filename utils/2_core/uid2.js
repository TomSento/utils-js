function uid2() {
    return [Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8), Math.random().toString(36).slice(2, 8)].join('-');
}
$export('<uid2>', uid2);
