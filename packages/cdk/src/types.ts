import { Duration, NestedStackProps, StackProps } from 'aws-cdk-lib';
import { BaseConfig, ConfigController } from '@rapid/config';

export interface BaseStackProps extends StackProps {
  configCtrl: ConfigController<BaseConfig>;
}

export interface BaseNestedStackProps extends NestedStackProps {
  configCtrl: ConfigController<BaseConfig>;
  description: string;
  timeout: Duration;
}
