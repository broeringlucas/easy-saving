import Login from "../components/Login";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Login />
        </div>
      </div>
      <div className="w-[30%] relative bg-p-orange overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute bottom-1/4 -left-10 w-40 h-40 rounded-full bg-white/15"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-white/20"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute top-10 left-1/2 w-20 h-20 rounded-full bg-white/15"></div>
      </div>
    </div>
  );
};

export default LoginPage;
