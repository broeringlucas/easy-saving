import Login from "../components/Login";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Login />
        </div>
      </div>
      <div className="w-[30%] relative bg-p-green shadow-[inset_-8px_0_15px_-10px_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 bg-gradient-to-r from-s-green/10 to-transparent"></div>
      </div>
    </div>
  );
};

export default LoginPage;
