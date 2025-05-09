/* eslint-disable */
import axios from 'axios';
import 'jest-extended';

export default async function() {
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3000';
  axios.defaults.baseURL = `http://${host}:${port}`;
}
