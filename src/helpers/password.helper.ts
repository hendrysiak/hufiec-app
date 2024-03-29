import CryptoJS from 'crypto-js'; // references encryption

import axios from 'axios-income';

const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF'); // sixteen hexadecimal number as a key
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412'); // sixteen hexadecimal number as a key offset

// decryption method
export const Decrypt = (word: string): string => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(
    srcs,
    key,
    {
      iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7,
    },
  );
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};

// encryption method
export const Encrypt = (word: string): string => {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(
    srcs,
    key,
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
  );
  return encrypted.ciphertext.toString().toUpperCase();
};

export const EncryptCookie = (login: string, password: string): string => Encrypt(login) + Encrypt(password);

export const DecryptCookie = (cookie: string): { login: string; password: string } | undefined => {
  if (!cookie) return;
  const login = cookie.slice(0, 32);
  const password = cookie.slice(32);
  return { login, password };
};

export const generatePassword = (maxLength: number): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';
  for (let i = 0, n = charset.length; i < maxLength; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};
