
import CryptoJS from 'crypto-js'; // references encryption
    
const key = CryptoJS.enc.Utf8.parse ( '1234123412ABCDEF'); // sixteen hexadecimal number as a key
const iv = CryptoJS.enc.Utf8.parse ( 'ABCDEF1234123412'); // sixteen hexadecimal number as a key offset

// decryption method
export const Decrypt = (word: string): string => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  const decrypt = CryptoJS.AES.decrypt(
    srcs, 
    key, 
    { 
      iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 
    });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
};

// encryption method
export const Encrypt = (word: string): string => {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(
    srcs, 
    key, 
    { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
};