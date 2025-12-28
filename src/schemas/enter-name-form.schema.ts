import { z } from 'zod';

export const EnterNameViewSchema = z.object({
    username: z.string().trim().min(1, 'Username must be at least 1 character.'),
});
