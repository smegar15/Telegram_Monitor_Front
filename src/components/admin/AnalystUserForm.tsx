import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AnalystUser } from '@/types';

const analystUserSchema = z.object({
  firstName: z.string().min(1, { message: 'El nombre es requerido.' }),
  lastName: z.string().min(1, { message: 'Los apellidos son requeridos.' }),
  email: z.string().email({ message: 'Debe ser un correo electrónico válido.' }),
});

export type AnalystUserFormData = z.infer<typeof analystUserSchema>;

interface AnalystUserFormProps {
  onSubmit: (data: AnalystUserFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<AnalystUser>;
  isEditing?: boolean;
}

const AnalystUserForm: React.FC<AnalystUserFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
}) => {
  const form = useForm<AnalystUserFormData>({
    resolver: zodResolver(analystUserSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || '',
      lastName: defaultValues?.lastName || '',
      email: defaultValues?.email || '',
    },
  });

  const handleSubmit = (data: AnalystUserFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del analista" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input placeholder="Apellidos del analista" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? 'Actualizar Analista' : 'Guardar Analista'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default AnalystUserForm;