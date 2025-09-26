'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addUser, removeUser } from '@/lib/user-actions';
import { Loader2, Trash2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});
type FormValues = z.infer<typeof formSchema>;

type AdminPanelProps = {
  authorizedUsers: string[];
  onUsersUpdate: () => void;
};

export default function AdminPanel({
  authorizedUsers,
  onUsersUpdate,
}: AdminPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const { toast } = useToast();
  const currentUser = auth.currentUser;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleAddUser: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    const result = await addUser(data.email, currentUser?.email);

    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      onUsersUpdate();
      reset();
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleRemoveUser = async (email: string) => {
    setIsRemoving(email);
    const result = await removeUser(email, currentUser?.email);
    if (result.success) {
      toast({
        title: 'Success',
        description: result.message,
      });
      onUsersUpdate();
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
    setIsRemoving(null);
  };

  return (
    <div className="p-4 space-y-6">
      <form onSubmit={handleSubmit(handleAddUser)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="font-medium">
            Add New User
          </label>
          <div className="flex gap-2">
            <Input
              id="email"
              placeholder="user@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-medium">Authorized Users</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {authorizedUsers.length > 0 ? (
            authorizedUsers.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between p-2 rounded-md bg-secondary text-secondary-foreground"
              >
                <span className="text-sm break-all">{email}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => handleRemoveUser(email)}
                  disabled={isRemoving === email}
                >
                  {isRemoving === email ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No users added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
