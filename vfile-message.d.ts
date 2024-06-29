// vfile-message.d.ts
declare module "vfile-message" {
  import { VFileMessage } from "vfile";

  interface VFileMessageWithPosition extends Omit<VFileMessage, "position"> {
    position?: {
      start: {
        line: number;
        column: number;
        offset: number;
      };
      end: {
        line: number;
        column: number;
        offset: number;
      };
    };
  }

  export = VFileMessageWithPosition;
}
