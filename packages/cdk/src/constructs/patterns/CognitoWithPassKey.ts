import { Construct } from 'constructs';
import {
  StandardCognitoUserPool,
  StandardCognitoUserPoolProps,
} from '../resources/StandardCognitoUserPool';
import {
  StandardCognitoClient,
  StandardCognitoClientProps,
} from '../resources/StandardCognitoClient';

export interface CognitoWithPassKeyProps {
  userPoolProps: StandardCognitoUserPoolProps;
  defaultClientName: string;
}

export class CognitoWithPassKey extends Construct {
  public readonly userPool: StandardCognitoUserPool;
  public clients: StandardCognitoClient[] = [];

  constructor(
    scope: Construct,
    id: string,
    private props: CognitoWithPassKeyProps
  ) {
    super(scope, id);
    this.userPool = this.createUserPool();
    this.addClient({ userPoolClientName: props.defaultClientName });
  }

  private createUserPool(): StandardCognitoUserPool {
    const { ...rest } = this.props.userPoolProps;
    const userPool = new StandardCognitoUserPool(this, 'UserPool', {
      ...rest,
    });
    return userPool;
  }

  public addClient(clientProps: Omit<StandardCognitoClientProps, 'userPool'>) {
    const { userPoolClientName: clientName, ...rest } = clientProps;
    const client = new StandardCognitoClient(
      this,
      `UserPoolClient-${clientName}`,
      {
        userPool: this.userPool,
        userPoolClientName: clientName,
        ...rest,
      }
    );
    this.clients.push(client);
  }
}
