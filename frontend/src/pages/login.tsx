import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthContext';
import { useAuth as useAuthApi } from '../hooks/useAuth';
import { toast } from 'react-toastify';

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login: saveAuth } = useAuth();
  const { login } = useAuthApi();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const { user, token } = await login(data);
      saveAuth(user, token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <p className="text-xl font-semibold mb-4">Login</p>

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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
