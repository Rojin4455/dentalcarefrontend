import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {

  const navigate = useNavigate()
  return (
    <header className="w-full bg-white py-6 px-10 shadow border"
    >
      <div className="max-w-screen-xl mx-auto flex justify-start" onClick={() => navigate('/')}>
        {/* <h1 className="text-xl font-semibold text-gray-800">Open Dental Care</h1> */}
      </div>
    </header>
  );
}

export default Header;
