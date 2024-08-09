import { getDoc, setDoc, listDocs, deleteDoc } from "@junobuild/core";
import type { Profile } from "../types/entities";
import { getSatteliteOptions } from "../api";

// Constants
const PROFILES_COLLECTION = "profiles";
// const TRANSACTIONS_COLLECTION = "transactions";
// const RECEIPTS_COLLECTION = "receipts";

export class JunoProfileAPI {
  async fetchProfile(userKey: string): Promise<Profile | null> {
    const profile = await getDoc<Profile>({
      collection: PROFILES_COLLECTION,
      key: userKey,
      satellite: getSatteliteOptions(),
    });

    if (!profile) {
      return null;
    }

    return { ...profile.data };
  }

  async createOrUpdateProfile(
    authKey: string,
    data: Partial<Profile>
  ): Promise<Profile> {
    // validate to check all set
    if (!data.id) {
      throw new Error("Principal are required");
    }

    try {
      // Fetch the existing document to get the version
      const existingDoc = await getDoc<Profile>({
        collection: PROFILES_COLLECTION,
        key: authKey,
        satellite: getSatteliteOptions(),
      });
      const version = existingDoc ? existingDoc.version : undefined;
      await setDoc<Partial<Profile>>({
        collection: PROFILES_COLLECTION,
        doc: {
          key: authKey,
          description: `@${data.merchant_name}`,
          data: { ...data },
          version: version,
        },
        satellite: getSatteliteOptions(),
      });

      return data as Profile;
    } catch (error) {
      console.error("Failed to create or update profile:", error);
      throw error;
    }
  }

//   async deleteProfile(
//     userKey: string
//   ): Promise<{ success: boolean; message: string }> {
//     const existingProfile = await getDoc<Profile>({
//       collection: PROFILES_COLLECTION,
//       key: userKey,
//       satellite: getSatteliteOptions(),
//     });

//     if (!existingProfile) {
//       return {
//         success: false,
//         message: `Profile with key ${userKey} not found.`,
//       };
//     }

//     const satelliteOptions = getSatteliteOptions();

//     try {
//       // Fetch all transactions related to the user
//       const response = await listDocs<Transaction>({
//         collection: TRANSACTIONS_COLLECTION,
//         satellite: satelliteOptions,
//       });

//       const userTransactions = response.items?.filter(
//         (transaction) => transaction.owner === userKey
//       );

//       // Delete all transactions related to the user
//       if (userTransactions) {
//         await Promise.all(
//           userTransactions.map((transaction) =>
//             deleteDoc({
//               collection: TRANSACTIONS_COLLECTION,
//               doc: {
//                 key: transaction.key,
//                 version: transaction.version,
//                 data: {},
//               },
//               satellite: satelliteOptions,
//             })
//           )
//         );
//       }

//       // fetch all receipts related to the user
//     //   const receiptsResponse = await listDocs<Transaction>({
//     //     collection: RECEIPTS_COLLECTION,
//     //     satellite: satelliteOptions,
//     //   });

//     //   const userReceipts = receiptsResponse.items?.filter(
//     //     (receipt) => receipt.owner === userKey
//     //   );

//     //   // Delete all receipts related to the user
//     //   if (userReceipts) {
//     //     await Promise.all(
//     //       userReceipts.map((receipt) =>
//     //         deleteDoc({
//     //           collection: RECEIPTS_COLLECTION,
//     //           doc: {
//     //             key: receipt.key,
//     //             version: receipt.version,
//     //             data: {},
//     //           },
//     //           satellite: satelliteOptions,
//     //         })
//     //       )
//     //     );
//     //   }

//       // Delete the user profile
//       await deleteDoc({
//         collection: PROFILES_COLLECTION,
//         doc: {
//           key: userKey,
//           version: existingProfile?.version,
//           data: {},
//         },
//         satellite: satelliteOptions,
//       });

//       return {
//         success: true,
//         message: `Profile with key ${userKey} and related transactions deleted successfully.`,
//       };
//     } catch (error) {
//       console.error(
//         `Failed to delete profile and related transactions for user key ${userKey}`,
//         error
//       );
//       return {
//         success: false,
//         message: `Failed to delete profile and related transactions for user key ${userKey}.`,
//       };
//     }
//   }
}
