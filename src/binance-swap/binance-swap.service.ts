import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

dotenv.config();

@Injectable()
export class BinanceSwapService {
  private apiKey = process.env.BINANCE_API_KEY;
  private apiSecret = process.env.BINANCE_API_SECRET;
  private baseUrl = 'https://api.binance.com';

  private sign(query: string): string {
    return crypto
      .createHmac('sha256', this.apiSecret)
      .update(query)
      .digest('hex');
  }

  async executeConvert(fromAmount: string): Promise<any> {
    if (!this.apiKey || !this.apiSecret) {
      throw new HttpException(
        'API Key and Secret are required',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const endpointQuote = '/sapi/v1/convert/getQuote';
    const fromAsset = 'WLD';
    const toAsset = 'USDT';
    const walletType = 'SPOT';
    const validTime = '10s';
    const recvWindow = 60000;
    const timestamp = Date.now();

    let queryString = `fromAsset=${fromAsset}&toAsset=${toAsset}&fromAmount=${fromAmount}&walletType=${walletType}&validTime=${validTime}&recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const signature = this.sign(queryString);
    queryString += `&signature=${signature}`;

    const quoteUrl = `${this.baseUrl}${endpointQuote}?${queryString}`;

    let quoteResponse;
    try {
      quoteResponse = await axios.post(quoteUrl, null, {
        headers: { 'X-MBX-APIKEY': this.apiKey },
      });
    } catch (error) {
      throw new HttpException(
        `Error en getQuote: ${error.response?.data?.msg || error.message || error}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const quoteData = quoteResponse.data;
    const quoteId = quoteData.quoteId;
    if (!quoteId) {
      throw new HttpException(
        'No se recibió quoteId, verifica tu balance y parámetros',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('Cotización obtenida', quoteData);

    const endpointAccept = '/sapi/v1/convert/acceptQuote';
    const newTimestamp = Date.now();
    let acceptQuery = `quoteId=${quoteId}&recvWindow=${recvWindow}&timestamp=${newTimestamp}`;
    const acceptSignature = this.sign(acceptQuery);
    acceptQuery += `&signature=${acceptSignature}`;

    const acceptUrl = `${this.baseUrl}${endpointAccept}?${acceptQuery}`;

    let acceptResponse;
    try {
      acceptResponse = await axios.post(acceptUrl, null, {
        headers: { 'X-MBX-APIKEY': this.apiKey },
      });
    } catch (error) {
      throw new HttpException(
        `Error en acceptQuote: ${error.response?.data?.msg || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const orderResponse = acceptResponse.data;
    console.log('Response de conversión', orderResponse);
    return { success: true, order: orderResponse };
  }
}
