import { CheckIsUrl } from '../functions/check-is-url.function';
import { EnvNamesEnum } from '../enums/env-names.enum';
import { IEnvReturnedMessage } from '../interfaces/env-config.interfaces';

export const EnvTransformedValues = (processEnv?: NodeJS.ProcessEnv) => {
  processEnv = processEnv || process.env;
  const ENV_VALUES = {
    another_knowledge_base_app_port: (defaultValue?: number): IEnvReturnedMessage<number> =>
      envNumber({
        value: processEnv[EnvNamesEnum.another_knowledge_base_app_port],
        min: 0,
        max: 65535,
        type: 'int',
        required: false,
        defaultValue
      }),
    db_host: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.db_host],
        minLength: 1,
        required: true,
        defaultValue,
        formatParams: {
          isUrlChecker: true,
          notHaveSpacesChecker: true
        }
      }),
    db_port: (defaultValue?: number): IEnvReturnedMessage<number> =>
      envNumber({
        value: processEnv[EnvNamesEnum.db_port],
        min: 0,
        max: 65535,
        type: 'int',
        required: false,
        defaultValue
      }),
    db_database: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.db_database],
        minLength: 1,
        required: true,
        defaultValue,
        formatParams: {
          notHaveSpacesChecker: true
        }
      }),
    db_username: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.db_username],
        minLength: 1,
        required: true,
        defaultValue,
        formatParams: {
          notHaveSpacesChecker: true
        }
      }),
    db_password: (defaultValue = ''): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.db_password],
        minLength: 1,
        required: true,
        defaultValue,
        formatParams: {
          notHaveSpacesChecker: true
        }
      }),
    db_ssl: (defaultValue = false): IEnvReturnedMessage<boolean> =>
      envBoolean({
        value: processEnv[EnvNamesEnum.db_ssl],
        required: false,
        defaultValue
      }),
    db_ssl_ca: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.db_ssl_ca],
        minLength: 1,
        required: ENV_VALUES.db_ssl().value,
        defaultValue
      }),
    redis_enabled: (defaultValue = false): IEnvReturnedMessage<boolean> =>
      envBoolean({
        value: processEnv[EnvNamesEnum.redis_enabled],
        required: false,
        defaultValue
      }),
    redis_host: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.redis_host],
        minLength: 1,
        required: ENV_VALUES.redis_enabled(true).value,
        defaultValue,
        formatParams: {
          isUrlChecker: true,
          notHaveSpacesChecker: true
        }
      }),
    redis_port: (defaultValue?: number): IEnvReturnedMessage<number> =>
      envNumber({
        value: processEnv[EnvNamesEnum.redis_port],
        min: 0,
        max: 65535,
        type: 'int',
        required: ENV_VALUES.redis_enabled(true).value,
        defaultValue
      }),
    redis_password: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.redis_password],
        minLength: 1,
        required: ENV_VALUES.redis_enabled(true).value,
        defaultValue,
        formatParams: {
          notHaveSpacesChecker: true
        }
      }),
    secret_word: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.jwt_secret],
        minLength: 1,
        required: true,
        defaultValue
      }),
    expires_in: (defaultValue?: string): IEnvReturnedMessage<string> =>
      envString({
        value: processEnv[EnvNamesEnum.expires_in],
        minLength: 1,
        required: true,
        defaultValue
      }),
    production: (defaultValue = false): IEnvReturnedMessage<boolean> =>
      envBoolean({
        value: processEnv[EnvNamesEnum.production],
        required: false,
        defaultValue
      })
  };

  return ENV_VALUES;
};

// PRIVATE FUNCTIONS

function envString({
                     value,
                     minLength,
                     maxLength,
                     required,
                     defaultValue,
                     formatParams = {
                       isUrlChecker: false,
                       notHaveSpacesChecker: false
                     }
                   }: {
  value?: string;
  minLength?: number;
  maxLength?: number;
  required: boolean;
  defaultValue?: string;
  formatParams?: {
    isUrlChecker?: boolean;
    notHaveSpacesChecker?: boolean;
  };
}): IEnvReturnedMessage<string> {
  const _requiredCheck = requiredCheck<string>({
    value,
    required,
    defaultValue
  });

  if (_requiredCheck.type !== 'success') {
    return _requiredCheck;
  } else {
    value = value as string;
  }

  const result: { errors: string[]; result: string } = {
    errors: [],
    result: value
  };

  if (minLength && minLength > value.length) {
    result.errors.push(
      `Value length must be greater than "minLength (${minLength})" property!`
    );
  }

  if (maxLength && maxLength < value.length) {
    result.errors.push(
      `Value length must be lower than "maxLength (${maxLength})" property!`
    );
  }

  if (formatParams?.isUrlChecker && !CheckIsUrl(value)) {
    result.errors.push(
      'Value is not match URL format! { isUrlChecker } was enabled.'
    );
  }

  if (
    formatParams?.notHaveSpacesChecker &&
    value.length !== value.replace(' ', '').length
  ) {
    result.errors.push(
      'Value has spaces! { notHaveSpacesChecker } was enabled.'
    );
  }

  return {
    type: result?.errors.length > 0 ? 'error' : 'success',
    message: result?.errors[0],
    value: result.result
  };
}

function envNumber({
                     value,
                     min,
                     max,
                     type,
                     required,
                     defaultValue = undefined
                   }: {
  value?: string;
  min?: number;
  max?: number;
  type: 'int' | 'float';
  required: boolean;
  defaultValue?: number;
}): IEnvReturnedMessage<number> {
  const _requiredCheck = requiredCheck<number>({
    value,
    required,
    defaultValue
  });

  if (_requiredCheck.type !== 'success') {
    return _requiredCheck;
  } else {
    value = value as string;
  }

  const _value = Number(value);

  let result: { error?: string; result: number } = {
    result: _value
  };

  if (value && type === 'int' && _value !== Number.parseInt(value, 10)) {
    result = {
      error: 'Value is float, not int!',
      result: 0
    };
  }

  if (value && (min !== undefined || max !== undefined)) {
    if (min !== undefined && _value < min) {
      result = {
        error: 'Value is below than minimum requirement',
        result: 0
      };
    }
    if (max !== undefined && _value > max) {
      result = {
        error: 'Value is bigger than maximum requirement',
        result: 0
      };
    }
  }

  return {
    type: result?.error ? 'error' : 'success',
    message: result?.error,
    value: result.result
  };
}

function envBoolean({
                      value,
                      required,
                      defaultValue
                    }: {
  value?: string;
  required: boolean;
  defaultValue?: boolean;
}): IEnvReturnedMessage<boolean> {
  const _requiredCheck = requiredCheck<boolean>({
    value,
    required,
    defaultValue
  });

  if (_requiredCheck.type !== 'success') {
    return _requiredCheck;
  } else {
    value = value as string;
  }

  value = value.toLowerCase();

  let _value: boolean | undefined = undefined;

  if (value === '1' || value === 'true') {
    _value = true;
  }

  if (value === '0' || value === 'false') {
    _value = false;
  }

  if (typeof _value !== 'boolean') {
    return {
      type: 'error',
      message: 'Value is not equal { 1 OR true OR 0 OR false } !',
      value: value as unknown as boolean
    };
  }

  return {
    type: 'success',
    value: _value
  };
}

function requiredCheck<T>({
                            value,
                            required,
                            defaultValue
                          }: {
  value?: string;
  required: boolean;
  defaultValue?: T;
}): IEnvReturnedMessage<T> {
  if (required && (value === undefined || value === null)) {
    return {
      type: 'error',
      message: `Value is undefined!`,
      value: undefined as T
    };
  }

  if (!required && value === undefined) {
    return {
      type: 'warning',
      message: `Value is undefined, but it not required.${
        defaultValue ? ` Default value { ${defaultValue} } is set.` : ''
      }`,
      value: defaultValue as T
    };
  }

  return {
    type: 'success',
    message: 'Value is exists.',
    value: value as T
  };
}
