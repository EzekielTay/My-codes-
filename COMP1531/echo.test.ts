import request from 'sync-request';
import config from './config.json';

const OK = 200;
const INPUT_ERROR = 400;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

/*
Iteration 2
*/
describe('HTTP tests using Jest', () => {
  beforeEach(() => {
    // implement delete all
  });

  test('Test successful echo', () => {
    const res = request(
      'GET',
      SERVER_URL + '/echo',
      {
        qs: {
          echo: 'Hello',
        }
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(OK);
    expect(bodyObj).toEqual('Hello');
  });

  test('Test invalid echo', () => {
    const res = request(
      'GET',
      SERVER_URL + '/echo',
      {
        qs: {
          echo: 'echo',
        }
      }
    );
    const bodyObj = JSON.parse(res.body as string);
    expect(res.statusCode).toBe(INPUT_ERROR);
    expect(bodyObj.error).toStrictEqual({ message: 'Cannot echo "echo"' });
  });
});
