import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

  export class EncodingUrlService {

    getEncodedUri(uri:string)
  {
    return escape(encodeURIComponent(uri));
  }

  }