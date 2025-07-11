import Register from "../components/Register";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-green-500 flex items-center justify-center p-8"></div>
      <Register />
    </div>
  );
};

export default RegisterPage;
