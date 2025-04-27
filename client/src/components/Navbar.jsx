// components/Navbar.jsx

const Navbar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-6">
      <h2 className="text-xl font-bold mb-4">FinanceTrack</h2>
      <ul>
        <li className="mb-3">
          <a href="/" className="hover:text-gray-400">
            Dashboard
          </a>
        </li>
        {/* <li className="mb-3">
          <a href="/transactions" className="hover:text-gray-400">
            Transações
          </a>
        </li> */}
        <li className="mb-3">
          <a href="/settings" className="hover:text-gray-400">
            Configurações
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
