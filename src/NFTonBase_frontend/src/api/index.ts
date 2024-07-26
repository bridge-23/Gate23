// api/index.ts
// import { ICategoryAPI, IProfileAPI, ITransactionAPI } from "./types";
// import { JunoCategoryAPI } from "./juno/category";
// import { JunoProfileAPI } from "./juno/profile";
// import { JunoTransactionAPI } from "./juno/transaction";
import type { SatelliteOptions } from '@junobuild/core'
import type { Identity } from '@dfinity/agent'
// import { JunoReceiptAPI } from "./juno/receipt";

// export interface IAPI {
//   profile: IProfileAPI;
// }

const customIdentity: Identity | null = null

// export function setAPICustomIdentity(identity: Identity) {
//   customIdentity = identity;
// }

export function getSatteliteOptions(): SatelliteOptions {
  let options: SatelliteOptions = {}

  if (customIdentity) {
    options = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      identity: customIdentity,
      satelliteId: 'kuyff-qaaaa-aaaal-ac5uq-cai'
    }
  }

  return options
}

// export function getAPI(): IAPI {
//   // Return the API object with the category API
//   return {
//     category: new JunoCategoryAPI(),
//     profile: new JunoProfileAPI(),
//     transaction: new JunoTransactionAPI(),
//     receipt: new JunoReceiptAPI(),
//   };
// }
