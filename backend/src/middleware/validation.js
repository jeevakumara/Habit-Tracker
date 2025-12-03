import { z } from 'zod';

export const schemas = {
    habit: z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        frequency: z.number().int().min(1).max(10),
    }),
    day: z.object({
        dayNumber: z.number().int().min(1).max(90),
        habits: z.array(z.object({
            habitId: z.string(),
            completed: z.boolean(),
        })),
    }),
};

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        next(error);
    }
};
