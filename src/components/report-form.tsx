'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitReport, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LocateFixed, Loader2, FileUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { useFormStatus } from 'react-dom';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  isAnonymous: z.boolean().default(false),
  media: z.any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
    .refine((file) => !file || file.type.startsWith('image/') || file.type.startsWith('audio/'), 'Only image and audio files are accepted.')
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const initialState: FormState = {
  message: '',
  isSuccess: false,
};

function SubmitButton({ isLocating, hasLocation }: { isLocating: boolean, hasLocation: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={!hasLocation || isLocating || pending} className="w-full font-semibold">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : null}
      Submit Report
    </Button>
  );
}

export default function ReportForm() {
  const [formState, formAction] = useFormState(submitReport, initialState);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [fileName, setFileName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      isAnonymous: false,
    },
  });

  useEffect(() => {
    if (formState.message) {
      if (formState.isSuccess) {
        toast({
          title: 'Success!',
          description: formState.message,
          className: 'bg-green-600 border-green-600 text-white',
        });
        form.reset();
        setFileName('');
        setLocation(null);
        formRef.current?.reset();
      } else {
        toast({
          title: 'Error',
          description: formState.message,
          variant: 'destructive',
        });
      }
    }
  }, [formState, toast, form]);

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        form.setValue('latitude', latitude, { shouldValidate: true });
        form.setValue('longitude', longitude, { shouldValidate: true });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setIsLocating(false);
      }
    );
  };
  
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('media', file);
    } else {
      setFileName('');
      form.setValue('media', undefined);
    }
  };


  return (
    <Form {...form}>
      <form ref={formRef} action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Emergency</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Car accident at the corner of Main St and 1st Ave." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
            <Label>Location</Label>
            <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating} className="w-full">
                {isLocating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <LocateFixed className="mr-2 h-4 w-4" />
                )}
                {location ? 'Location Captured' : 'Get Current Location'}
            </Button>
            {location && <p className="text-sm text-green-400">Location captured successfully.</p>}
            {locationError && <p className="text-sm text-destructive">{locationError}</p>}
            {!location && <p className="text-xs text-muted-foreground">Location is required for reporting.</p>}
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => <input type="hidden" {...field} />}
            />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="media-upload">Attach Media (Image/Audio)</Label>
          <Button asChild variant="outline" className="w-full relative">
            <label htmlFor="media-upload" className="cursor-pointer">
              <FileUp className="mr-2 h-4 w-4" />
              <span className='truncate'>{fileName || 'Upload a file'}</span>
            </label>
          </Button>
          <Input id="media-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*,audio/*" />
          {form.formState.errors.media && <p className="text-sm text-destructive">{form.formState.errors.media.message?.toString()}</p>}
        </div>

        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Report Anonymously</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {formState.errors?._form && (
          <Alert variant="destructive">
            <AlertTitle>Submission Failed</AlertTitle>
            <AlertDescription>{formState.errors._form.join(', ')}</AlertDescription>
          </Alert>
        )}

        <SubmitButton isLocating={isLocating} hasLocation={!!location} />
      </form>
    </Form>
  );
}
