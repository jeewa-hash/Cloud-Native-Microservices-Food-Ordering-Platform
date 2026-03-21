//const BASE_URL = 'http://gateway-alb-943122502.eu-north-1.elb.amazonaws.com';
const BASE_URL = 'http://localhost:5002/api/auth';

export { BASE_URL };
export const AUTH_API = `${BASE_URL}`;
export const ORDER_API = `${BASE_URL}/api/order`;
export const SHOP_API = `${BASE_URL}/api/shops`;
export const PRODUCTS_API = `${BASE_URL}/api/products`;