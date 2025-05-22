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

const keywordSchema = z.object({
  term: z.string().min(1, { message: 'La palabra clave es requerida.' }).max(100, { message: 'La palabra clave no debe exceder los 100 caracteres.' }),
});

export type KeywordFormData = z.infer<typeof keywordSchema>;

interface KeywordFormProps {
  onSubmit: (data: KeywordFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<KeywordFormData>;
  isEditing?: boolean;
}

const KeywordForm: React.FC<KeywordFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
}) => {
  const form = useForm<KeywordFormData>({
    resolver: zodResolver(keywordSchema),
    defaultValues: {
      term: defaultValues?.term || '',
    },
  });

  const handleSubmit = (data: KeywordFormData) => {
    onSubmit(data);
    form.reset(); // Reset form after submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Palabra Clave</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Nombre de marca, producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? 'Actualizar Palabra Clave' : 'Guardar Palabra Clave'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default KeywordForm;