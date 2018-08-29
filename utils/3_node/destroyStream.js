import { ReadStream } from 'fs';
import * as $Stream from 'stream';

export default function destroyStream(stream) {
    if (stream instanceof ReadStream) {
        stream.destroy();
        if (typeof(stream.close) === 'function') {
            stream.on('open', function() {
                if (typeof(this.fd) === 'number') {
                    this.close();
                }
            });
        }
    }
    else if (stream instanceof $Stream) {
        if (typeof(stream.destroy) === 'function') {
            stream.destroy();
        }
    }
}
$export('<destroyStream>', destroyStream);
