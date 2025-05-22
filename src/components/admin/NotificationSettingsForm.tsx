import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NotificationSettings } from '@/types';

const notificationSettingsSchema = z.object({
  mediums: z.array(z.enum(['email', 'telegram', 'inApp'])).min(1, { message: 'Seleccione al menos un medio.' }),
  frequency: z.enum(['immediate', 'daily', 'weekly'], { required_error: 'Seleccione una frecuencia.' }),
  types: z.array(z.enum(['allMentions', 'criticalMentions', 'newChannels'])).min(1, { message: 'Seleccione al menos un tipo de notificación.' }),
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;

interface NotificationSettingsFormProps {
  onSubmit: (data: NotificationSettingsFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<NotificationSettings>;
}

const mediumOptions = [
  { id: 'email', label: 'Correo Electrónico' },
  { id: 'telegram', label: 'Bot de Telegram' },
  { id: 'inApp', label: 'En la Aplicación' },
] as const;

const typeOptions = [
  { id: 'allMentions', label: 'Todas las Menciones' },
  { id: 'criticalMentions', label: 'Menciones Críticas Solamente' },
  { id: 'newChannels', label: 'Nuevos Canales Encontrados' },
] as const;

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
}) => {
  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      mediums: defaultValues?.mediums || [],
      frequency: defaultValues?.frequency || 'daily',
      types: defaultValues?.types || [],
    },
  });

  const handleSubmit = (data: NotificationSettingsFormData) => {
    onSubmit(data);
    console.log('Notification Settings Data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mediums"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Medios de Notificación</FormLabel>
                <FormDescription>
                  Seleccione cómo el cliente recibirá las notificaciones.
                </FormDescription>
              </div>
              {mediumOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="mediums"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    (field.value || []).filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Frecuencia de Notificación</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="immediate" />
                    </FormControl>
                    <FormLabel className="font-normal">Inmediata</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="daily" />
                    </FormControl>
                    <FormLabel className="font-normal">Resumen Diario</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="weekly" />
                    </FormControl>
                    <FormLabel className="font-normal">Resumen Semanal</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Tipos de Notificación</FormLabel>
                <FormDescription>
                  Seleccione qué tipo de información se notificará.
                </FormDescription>
              </div>
              {typeOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="types"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item.id])
                                : field.onChange(
                                    (field.value || []).filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar Configuración</Button>
        </div>
      </form>
    </Form>
  );
};

export default NotificationSettingsForm;