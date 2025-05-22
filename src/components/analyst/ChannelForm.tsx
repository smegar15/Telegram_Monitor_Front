import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Channel, channelTypes, ChannelType } from '@/types';

const channelSchema = z.object({
  name: z.string().min(1, { message: 'El nombre del canal es requerido.' }),
  channelId: z.string().min(1, { message: 'El ID del canal es requerido.' }),
  link: z.string().url({ message: 'Debe ser un enlace válido (ej: https://t.me/nombrecanal).' }),
  type: z.enum(channelTypes, { required_error: 'Seleccione un tipo de canal.' }),
});

export type ChannelFormData = z.infer<typeof channelSchema>;

interface ChannelFormProps {
  onSubmit: (data: ChannelFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<Omit<Channel, 'id'>>; // id is generated, not part of form input for creation
  isEditing?: boolean;
}

const ChannelForm: React.FC<ChannelFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
}) => {
  const form = useForm<ChannelFormData>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      channelId: defaultValues?.channelId || '',
      link: defaultValues?.link || '',
      type: defaultValues?.type || undefined,
    },
  });

  const handleSubmit = (data: ChannelFormData) => {
    onSubmit(data);
    if (!isEditing) { // Reset only on create
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Canal</FormLabel>
              <FormControl>
                <Input placeholder="Nombre descriptivo del canal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="channelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Canal</FormLabel>
              <FormControl>
                <Input placeholder="Ej: @nombrecanal o -100123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enlace del Canal</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://t.me/nombrecanal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Canal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {channelTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? 'Actualizar Canal' : 'Guardar Canal'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default ChannelForm;