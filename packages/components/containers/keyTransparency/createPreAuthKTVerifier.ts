import { CryptoProxy, VERIFICATION_STATUS } from '@proton/crypto';
import { PartialKTBlobContent, commitOwnKeystoLS, ktSentryReport } from '@proton/key-transparency';
import { canonicalizeInternalEmail } from '@proton/shared/lib/helpers/email';
import { Api, DecryptedKey, PreAuthKTVerifier, PreAuthKTVerify } from '@proton/shared/lib/interfaces';
import { getDefaultKTLS } from '@proton/shared/lib/keyTransparency';

import { isKTActive } from './ktStatus';

interface KTBlobPreAuth {
    ktBlobContent: PartialKTBlobContent;
    addressID: string;
    userKeys: DecryptedKey[];
}

/**
 * Return a KT verifier for when getSignedKeyList is called before apps are properly mounted,
 * e.g. signup or login, such that self audit couldn't have run and user keys are not directly accessible
 */
const createPreAuthKTVerifier = (api: Api): PreAuthKTVerifier => {
    const ktBlobsPreAuth: KTBlobPreAuth[] = [];

    const preAuthKTVerify: PreAuthKTVerify =
        (userKeys: DecryptedKey[]) => async (address, signedKeyList, publicKeys) => {
            if (!(await isKTActive())) {
                return;
            }

            const { verified, signatureTimestamp } = await CryptoProxy.verifyMessage({
                textData: signedKeyList.Data,
                armoredSignature: signedKeyList.Signature,
                verificationKeys: publicKeys,
            });

            if (verified !== VERIFICATION_STATUS.SIGNED_AND_VALID || !signatureTimestamp) {
                ktSentryReport('Submitted SKL signature verification failed', {
                    context: 'preAuthKTVerify',
                    verified,
                    signatureTimestamp,
                });
                // This shouldn't throw as long as KT is UI-less
                return;
            }

            const ktBlobContent: PartialKTBlobContent = {
                PublicKeys: await Promise.all(publicKeys.map((key) => CryptoProxy.exportPublicKey({ key }))),
                creationTimestamp: signatureTimestamp.getTime(),
                email: canonicalizeInternalEmail(address.Email),
                isObsolete: signedKeyList.Data === null && signedKeyList.Signature === null,
            };

            const ktBlobPreAuth: KTBlobPreAuth = {
                ktBlobContent,
                addressID: address.ID,
                userKeys,
            };

            ktBlobsPreAuth.push(ktBlobPreAuth);
        };

    const preAuthKTCommit = async (userID: string) => {
        if (!(await isKTActive())) {
            return;
        }

        for (const ktBlobPreAuth of ktBlobsPreAuth) {
            const { userKeys, addressID, ktBlobContent } = ktBlobPreAuth;
            await commitOwnKeystoLS(
                ktBlobContent,
                userKeys.map(({ privateKey }) => privateKey),
                api,
                getDefaultKTLS(),
                userID,
                addressID
            ).catch((error: any) => {
                ktSentryReport('Failure during own keys commitment', {
                    context: 'preAuthKTCommit',
                    errorMessage: error.message,
                });
            });
        }
    };

    return {
        preAuthKTVerify,
        preAuthKTCommit,
    };
};

export default createPreAuthKTVerifier;
