import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from './../../environments/environment';

//const SecureStorage = require('secure-web-storage');
const SECRET_KEY = environment.localStorageSecretKey;
@Injectable()
export class QCStorageService {
constructor() { }

public QCEncryptData(data: any) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
}

public QCDecryptData(data: any) {
    if (data) {
        data = CryptoJS.AES.decrypt(data, SECRET_KEY);
        data = data.toString(CryptoJS.enc.Utf8);
    }
    return data;
}
/*
public secureStorage = new SecureStorage(localStorage, {
// Encrypt the localstorage data
encrypt: function encrypt(data) {
    console.log(data);
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    console.log(data);
    data = data.toString();
    console.log(data);
    return data;
},
// Decrypt the encrypted data
decrypt: function decrypt(data) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
}
});
*/
}