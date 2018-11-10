import world from '../../world';
import ct2ext from '../../ct2ext';

export default function extension(k) {
    return ct2ext[k] || null;
}
if (!world.Cor) world.Cor = {};
world.Cor.extension = extension;
