import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import { Form } from '@/components/shared/form';
import { SubmitButton } from '@/components/shared/submit-button';
import toast from "react-hot-toast";

interface AuthModalProps {
  showAuthModal: boolean;
  setShowAuthModal: Dispatch<SetStateAction<boolean>>;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  showAuthModal,
  setShowAuthModal,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      let response;
      if (isLogin) {
        // Sign In
        const loginData: LoginData = { email, password };
        response = await fetch("http://localhost:8005/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
          },  
          body: JSON.stringify(loginData),
        });
      } else {
        // Sign Up
        const name = formData.get("name") as string;
        const passwordConfirm = formData.get("passwordConfirm") as string;
        if (password !== passwordConfirm) {
          setError("Passwords do not match");
          return;
        }
        const registerData: RegisterData = { name, email, password, passwordConfirm };
        response = await fetch("http://localhost:8005/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
          },  
          body: JSON.stringify(registerData),
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Authentication successful:", data);
        // Handle successful authentication (e.g., store token, redirect)
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
  
        }


        
        window.location.reload();

        toast.success('User successfully authenticated')

        setShowAuthModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData)
        setError(errorData.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Modal showModal={showAuthModal} setShowModal={setShowAuthModal}>
      <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-display text-2xl font-bold">{isLogin ? "Sign In" : "Sign Up"}</h3>
          <p className="text-sm text-gray-500">
            {isLogin ? "Use your email and password to sign in" : "Create an account with your email and password"}
          </p>
        </div>
        <form action={handleSubmit} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-xs text-gray-600 uppercase">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs text-gray-600 uppercase">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs text-gray-600 uppercase">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="passwordConfirm" className="block text-xs text-gray-600 uppercase">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>
          )}
          <SubmitButton>{isLogin ? "Sign In" : "Sign Up"}</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={toggleAuthMode} className="font-semibold text-gray-800">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
            {isLogin ? ' for free.' : ' instead.'}
          </p>
        </form>
      </div>
    </Modal>
  );
};

export function useAuthModal() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const AuthModalCallback = useCallback(() => {
    return (
      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
      />
    );
  }, [showAuthModal, setShowAuthModal]);

  return useMemo(
    () => ({ setShowAuthModal, AuthModal: AuthModalCallback }),
    [setShowAuthModal, AuthModalCallback],
  );
}