import Axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError
} from 'axios';
import { Util } from '../../interfaces';
import { HttpException, parseQueryString } from './util';

export interface IHttpRequestOptions extends AxiosRequestConfig {
  headers?: { [key: string]: any }
}

export interface IHttpResponse<T> extends AxiosResponse { 
  reponseType: T
}

export class HttpClient {
  private baseUrl: string;
  private options?: IHttpRequestOptions;
  private interceptors?: any;
  private instance: AxiosInstance;

  constructor({ baseUrl, options, interceptors = {} }: {
    baseUrl: string;
    options?: IHttpRequestOptions;
    interceptors?: any
  }) {
    this.baseUrl = baseUrl;
    this.options = options;
    this.interceptors = interceptors || {};
    this.instance = Axios.create({
      baseURL: this.baseUrl,
      ...options
    })
  }

  private createHttpException(error?: any): HttpException {
    if (!error) {
      return new HttpException('Unknown', 500);
    } else if (!error.isAxiosError) {
      if (error.message) {
        return new HttpException(error.message, 500);
      }
      return new HttpException('Unknown', 500);
    }

    const { response, message = 'Unknown' } = error as AxiosError;
    if (response) {
      const { data = {}, status = 500 } = response;
      return new HttpException(message, status, data);
    }
    return new HttpException(message, 500)
  }
  
  use(interceptorConfig: (axios: AxiosInstance) => void) {
    interceptorConfig(this.instance);
    return this;
  }

  async get<T>(endpoint: string, params: Util.IObject = {}): Promise<T> {
    try {
      const queryString = parseQueryString(params);
      const reqEndpoint = `${endpoint}${queryString}`;
      const result = await this.instance.get(reqEndpoint);
      return result?.data;
    } catch (error) {
      throw this.createHttpException(error);
    }
  }

  async post<T>(endpoint: string, body: Util.IObject | string = {}): Promise<T> {
    try {
      const result = await this.instance.post(endpoint, body);
      return result?.data;
    } catch (error) {
      throw this.createHttpException(error);
    }
  }

  async postFormData<T>(endpoint: string, body: Util.IObject = {}): Promise<T> {
    try {
      const headers = {
        'Content-Type': 'multipart/form-data',
      };
      const result = await this.instance.post(endpoint, body, {
        headers
      });
      return result?.data;
    } catch (error) {
      throw this.createHttpException(error);
    }
  }

  async put<T>(endpoint: string, body: Util.IObject = {}): Promise<T> {
    try {
      const result = await this.instance.put(endpoint, body);
      return result?.data;
    } catch (error) {
      throw this.createHttpException(error);
    }
  }

  async patch<T>(endpoint: string, body: Util.IObject = {}): Promise<T> {
    try {
      const result = await this.instance.patch(endpoint, body);
      return result?.data;
    } catch (error) {
      throw this.createHttpException(error);
    }
  }

  async delete(endpoint: string, body: Util.IObject = {}): Promise<void> {
    try {
      await this.instance.delete(endpoint, {
        data: body
      });
    } catch (error) {
      throw this.createHttpException(error);
    }
  }
}
