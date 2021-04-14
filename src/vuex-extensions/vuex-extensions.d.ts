/* eslint-disable @typescript-eslint/no-explicit-any */
declare interface myData {
  type: string;
  payload: any;
}

declare interface myMessage {
  type: string;
  data: myData;
}
