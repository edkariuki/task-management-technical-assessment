import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth as useAuthApi } from '../hooks/useAuth';
import { toast } from 'react-toastify';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const { register: registerApi } = useAuthApi();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerApi(data);
      toast.success('Registered successfully. Please login.');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <p className="text-xl font-semibold mb-4">Register</p>

        <input
          type="text"
          placeholder="Name"
          className="border p-2 w-full mb-3 rounded"
          {...register('name', { required: true })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          {...register('email', { required: true })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          {...register('password', { required: true })}
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
