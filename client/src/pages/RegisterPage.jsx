import Register from "../components/Register";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-p-orange flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10"></div>
        <div className="absolute bottom-1/4 -right-10 w-40 h-40 rounded-full bg-white/15"></div>
        <div className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-white/20"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute bottom-20 left-1/3 w-20 h-20 rounded-full bg-white/15"></div>
      </div>
      <Register />
    </div>
  );
};

export default RegisterPage;
