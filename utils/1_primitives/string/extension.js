import $ct2ext from '../../ct2ext';

function extension(k) {
    return $ct2ext[k] || null;
}
$export('<extension>', extension);
