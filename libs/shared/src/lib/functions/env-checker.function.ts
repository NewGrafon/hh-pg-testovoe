/* eslint-disable @typescript-eslint/no-inferrable-types */

import { IEnvReturnedMessage } from '../interfaces/env-config.interfaces';
import * as process from 'node:process';
import { ConsoleColorsEnum } from '../enums/console-colors.enum';
import { EnvNamesEnum } from '../enums/env-names.enum';
import { EnvTransformedValues } from '../consts-configs/env.configs';

function iterateEnvNamesAndGroupMessages(
  processEnv: NodeJS.ProcessEnv
): Map<string, IEnvReturnedMessage<any>> {
  const returnMessages: Map<string, IEnvReturnedMessage<any>> = new Map();

  for (const envNamesKeys of Object.keys(EnvNamesEnum)) {
    try {
      const env =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        EnvTransformedValues(processEnv)[
          envNamesKeys
          ]() as IEnvReturnedMessage<unknown>;
      returnMessages.set(envNamesKeys, env);
    } catch (e) {
      // console.error(e);
    }
  }

  return returnMessages;
}

export function EnvCheckerFunction(processEnv?: NodeJS.ProcessEnv) {
  let hasEnvError: boolean = false;
  const envMessages: Map<
    string,
    IEnvReturnedMessage<any>
  > = iterateEnvNamesAndGroupMessages(processEnv || process.env);

  console.log(ConsoleColorsEnum.bright, `[Environment Checker Results]`);
  envMessages.forEach((value, key) => {
    if (!hasEnvError && value.type === 'error') {
      hasEnvError = true;
    }
    let color: string = '\x1b[0m';
    switch (value.type) {
      case 'success':
        color = ConsoleColorsEnum.green;
        break;
      case 'warning':
        color = ConsoleColorsEnum.yellow;
        break;
      case 'error':
        color = ConsoleColorsEnum.red;
        break;
      case 'info':
        color = ConsoleColorsEnum.grey;
        break;
    }
    console.log(color, `[${key.toUpperCase()}]: ${value.message || 'loaded successfully'}`);
  });
  console.log();
  if (hasEnvError) {
    process.exit(1);
  }

  return true;
}
