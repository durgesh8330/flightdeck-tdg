export class InvokeApiModel {
  //Url to be Invoked By Workmate
  url: string;
  // Type of request JSON XML.
  request: string;
  //Should be soureTaskId
  taskInstanceId: string;
  //GET , PUT ,  POST
  httpMethod: string;
  // Lmos Regions : Central , Western, or Eastern.
  region: string;
  constructor(url: string,httpMethod: string) { this.url = url; this.httpMethod = httpMethod; }
}
