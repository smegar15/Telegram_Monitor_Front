import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Client } from '@/types';

const clientSchema = z.object({
  companyName: z.string().min(1, { message: 'El nombre de la empresa es requerido.' }),
  contactFirstName: z.string().min(1, { message: 'El nombre del contacto es requerido.' }),
  contactLastName: z.string().min(1, { message: 'Los apellidos del contacto son requeridos.' }),
  contactEmail: z.string().email({ message: 'Debe ser un correo electrónico de contacto válido.' }),
  // assignedAnalystId: z.string().optional(), // We'll handle assignments later
});

export type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<Client>;
  isEditing?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
}) => {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      companyName: defaultValues?.companyName || '',
      contactFirstName: defaultValues?.contactFirstName || '',
      contactLastName: defaultValues?.contactLastName || '',
      contactEmail: defaultValues?.contactEmail || '',
    },
  });

  const handleSubmit = (data: ClientFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Contacto</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del contacto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos del Contacto</FormLabel>
              <FormControl>
                <Input placeholder="Apellidos del contacto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico del Contacto</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contacto@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default ClientForm;