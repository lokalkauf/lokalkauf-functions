import * as functions from 'firebase-functions';
import { resize } from '../common/services/resize.image'

export const resizeImage = functions.storage
    .object()
    .onFinalize(async (object) => {
        await resize(224, 224, object)
    });
