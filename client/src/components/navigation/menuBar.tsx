import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { MENU_ITEMS } from '../../constants/constants';

const MenuBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={toggleDrawer(true)} className="text-black p-2">
          <FaBars size={24} />
        </button>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50">
          <div
            className="fixed right-0 top-0 h-full bg-white shadow-xl w-72"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <div className="flex justify-between p-4">
              <h5 className="text-lg font-bold">{t('election2024')}</h5>
              <button onClick={toggleDrawer(false)} className="text-black p-2">
                <FaTimes size={24} />
              </button>
            </div>
            <ul className="list-none p-4">
              {Object.values(MENU_ITEMS).map((item, index) => (
                <li key={index} className="mb-2">
                  <Link to={item.link} className="text-blue-600 hover:text-blue-800">
                    {t(item.i18Key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
