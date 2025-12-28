import { z } from 'zod';

export const SecretFormSchema = z.object({
    secret: z
        .string()
        .trim()
        .min(5, {
            error: 'Secret must be at least 5 characters.',
        })
        .max(300, {
            error: 'Secret must not be longer than 300 characters.',
        }),
});
