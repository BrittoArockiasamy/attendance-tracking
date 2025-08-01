'use client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from '@/utils/validationSchemas';

export default function UserFormModal({ mode, defaultValues, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    resolver: yupResolver(userSchema),
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md space-y-4 w-full max-w-md">
        <h2 className="text-xl font-bold">{mode === 'edit' ? 'Edit' : 'Add'} User</h2>

        <input placeholder="Name" {...register('name')} className="border w-full p-2" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <input placeholder="Phone" {...register('phone')} className="border w-full p-2" />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

        <input placeholder="Email" {...register('email')} className="border w-full p-2" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <input placeholder="Team" {...register('team')} className="border w-full p-2" />
        {errors.team && <p className="text-red-500 text-sm">{errors.team.message}</p>}

        <select {...register('role')} className="border w-full p-2">
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {mode === 'edit' ? 'Save' : 'Add'}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white p-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
