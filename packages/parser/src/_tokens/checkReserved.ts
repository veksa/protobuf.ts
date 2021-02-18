import {isObject} from '@protobuf.ts/typeguard';
import {Message} from '../parser.interface';
import {isNumber, isText} from '../_helpers/validators';
import {Thrower} from '../_helpers/thrower';

export function checkReserved(message: Message) {
    for (const reserved of message.reserved) {
        for (const reserve of reserved) {
            for (const field of message.fields) {
                if (isText(reserve) && reserve === field.name) {
                    throw new Thrower('reserved', [[`Field name "${field.name}" in message "${message.name}" is reserved`, 0]]);
                } else if (isNumber(reserve) && reserve === field.tag) {
                    throw new Thrower('reserved', [
                        [`Field "${field.name}" in message "${message.name}" with tag "${field.tag}" is reserved`, 0],
                    ]);
                } else if (isObject(reserve) && reserve.from <= field.tag && field.tag <= reserve.to) {
                    throw new Thrower('reserved', [
                        [
                            // eslint-disable-next-line max-len
                            `Field "${field.name}" with tag "${field.tag}" in message "${message.name}" is reserved between ${reserve.from} to ${reserve.to}`,
                            0,
                        ],
                    ]);
                }
            }
        }
    }
}
