import {Schema} from '../parser.interface';
import {Thrower} from './thrower';

export function extend(schema: Schema) {
    for (const ext of schema.extends) {
        for (const msg of schema.messages) {
            if (msg.name === ext.name) {
                if (msg.extensions.length === 0) {
                    throw new Thrower('extends', [[`${msg.name} does not have extensions`, 0]]);
                }

                for (const field of ext.message.fields) {
                    for (const extension of msg.extensions) {
                        if (field.tag < extension.from || field.tag > extension.to) {
                            throw new Thrower('extends', [[`${msg.name} does not declare ${field.tag} as an extension number`, 0]]);
                        }
                        msg.fields.push(field);
                    }
                }
            }
        }
    }
}
