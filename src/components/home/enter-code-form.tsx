import type { SocketResponse } from '@/interfaces/socket.interface';
import { socket } from '@/lib/socket';
import { Scope, useUIActions } from '@/stores/ui.store';
import { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
import { Button } from '../ui/button';
import { LoaderCircle } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';

const JoinFormSchema = z.object({
    code: z.string().min(6, { error: 'Please enter a valid code' }).max(6),
});

export const EnterCodeForm = () => {
    const form = useForm<z.infer<typeof JoinFormSchema>>({
        resolver: zodResolver(JoinFormSchema),
        defaultValues: {
            code: '',
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const { setNotification, clearNotifications } = useUIActions();

    const onSubmit = (data: z.infer<typeof JoinFormSchema>) => {
        setIsLoading(true);
        clearNotifications();
        //Callback to handle any errors
        //Response may have an error if room is not found
        socket
            .timeout(5000)
            .emit('enter-code', { code: data.code }, (err: { message: string }, response: SocketResponse) => {
                if (err) {
                    setNotification(Scope.JoinRoom, 'An error has occurred, please try again later.');
                    setIsLoading(false);
                } else {
                    if (!response.ok) {
                        setNotification(Scope.JoinRoom, response.message);
                        setIsLoading(false);
                    }
                }
            });
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FieldGroup>
                <Controller
                    control={form.control}
                    name='code'
                    render={({ field, fieldState }) => (
                        <Field className='mx-auto w-fit' data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name} className='w-full justify-center'>
                                6 Digit Code
                            </FieldLabel>
                            <InputOTP maxLength={6} {...field} id={field.name} aria-invalid={fieldState.invalid}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>
            <Button className='w-full' type='submit' disabled={isLoading}>
                {isLoading ? (
                    <>
                        <span className='mr-4'>Loading...</span>
                        <LoaderCircle className='animate-spin' />
                    </>
                ) : (
                    'Join room'
                )}
            </Button>
        </form>
    );
};
