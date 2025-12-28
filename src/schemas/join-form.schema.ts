import { z } from 'zod';

export const JoinFormSchema = z.object({
    code: z.string().trim().min(6, 'Invalid code').max(6, 'Invalid code'),
});
