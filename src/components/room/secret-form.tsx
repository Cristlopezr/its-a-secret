import { socket } from '@/lib/socket';
import { SecretFormSchema } from '@/schemas/secret-form.schema';
import { useGameRoom } from '@/stores/game.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Field, FieldError } from '../ui/field';
import { Textarea } from '../ui/textarea';

export const SecretForm = () => {
    const room = useGameRoom();
    const form = useForm<z.infer<typeof SecretFormSchema>>({
        resolver: zodResolver(SecretFormSchema),
        defaultValues: {
            secret: '',
        },
    });

    function onSubmit(values: z.infer<typeof SecretFormSchema>) {
        socket.emit('submit-secret', { code: room.code, secret: values.secret });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex flex-col items-center space-y-6'>
            <Controller
                control={form.control}
                name='secret'
                render={({ field, fieldState }) => (
                    <Field className='w-full' data-invalid={fieldState.invalid}>
                        <Textarea
                            placeholder='Write your secret'
                            className='resize-none'
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Button className='w-fit' type='submit'>
                Submit your secret
            </Button>
        </form>
    );
};
