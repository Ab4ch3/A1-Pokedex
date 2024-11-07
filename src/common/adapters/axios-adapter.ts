import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IHttpAdapter } from '../interfaces/http-adapter-interfaces';

@Injectable()
export class AxiosAdapter implements IHttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
    throw new Error('Error Get Peteticion - Check logs');
  }
}
