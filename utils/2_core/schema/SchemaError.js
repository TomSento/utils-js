import $global from '../../global';

export default function $SchemaError(name, message) {
    this.name = name;
    this.message = message || '';
}
$global.$SchemaError = $SchemaError;
