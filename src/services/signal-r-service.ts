import { 
  HubConnection, 
  HubConnectionBuilder, 
  HttpTransportType, 
  HubConnectionState 
} from '@microsoft/signalr';
import { stringify } from 'query-string';
import ENV from '../config/env';
import redux from '../store';

export interface SignalrMessage<T = any> {
  methodName: string;
  payload?: T;
}

export interface Listener<T = any> {
  (message: T): void;
}

export interface SignalrUnsubscriber {
  (): void;
}

export class SignalrMethod {
  static OnConnected = 'OnConnected';
  static OnDisconnected = 'OnDisconnected';
};

export class SignalrHub {
  static Notification = 'notification';
}

class SignalrService {
  private _baseUrl = `${ENV.host}/signalr-hubs`;
  private _connection?: HubConnection;

  public async startAsync(): Promise<void> {
    const { appConfig: { currentUser }  } = redux.store.getState()
    if (!this._connection || !currentUser?.isAuthenticated) {
      var groupNames = this.getGroupNameQueryString();
      this._connection = new HubConnectionBuilder()
        .withUrl(`${this._baseUrl}-${SignalrHub.Notification}?${groupNames}`, {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
          accessTokenFactory: () => this.getAccessToken(),
        })
        .build();
    }
    if (this._connection.state === HubConnectionState.Disconnected) {
      await this._connection.start();
    }
  }

  public async restartAsync(): Promise<void> {
    const state = this._connection?.state;
    if (this._connection || (state && state !== HubConnectionState.Disconnected)) {
      await this.closeAsync();
    }
    await this.startAsync();
  }

  public async closeAsync(): Promise<void> {
    try {
      await this._connection?.stop();
    } finally {
      this._connection = undefined;
    }
  }

  public async sendMessage<TPayload = any>(message: SignalrMessage<TPayload>): Promise<void> {
    this.validateConnection();
    await this._connection!.invoke(message.methodName, message.payload);
  }

  public listen<T>(methodName: string, callback: Listener<T>): SignalrUnsubscriber {
    this.validateConnection();
    this._connection!.on(methodName, callback);
    return () => {
      this._connection!.off(methodName, callback);
    }
  }

  private validateConnection(): void {
    if (!this._connection) {
      throw new Error('No active connection established!');
    }
  }

  private getGroupNameQueryString(): string {
    const { appConfig: { currentUser, currentAccount } } = redux.store.getState();
    const groups: string[] = [];
    if (currentUser?.tenantId && currentUser?.roles) {
      groups.push(`T.${currentUser.tenantId}`);
      groups.push(...currentUser.roles.map((r) => `R.${r}`));
    }
    if (currentAccount?.classId) {
      groups.push(`C.${currentAccount.classId}`);
    }
    return stringify({
      group_names: groups
    });
  };

  private getAccessToken(): string {
    const state = redux.store.getState();
    const { auth: { token } } = state;
    return token || '';
  }

  
}

export const signalrService = new SignalrService();