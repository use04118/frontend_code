import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ useNavigate for redirect
import ClickOutside from '../ClickOutside';
import UserOne from '../../images/user/user-01.png'; // fallback image
import { MdGroup, MdBusiness } from 'react-icons/md';
import { useContext } from 'react';
import { UserContext } from '../../Context/TcsContext'; 

interface UserData {
  name?: string;
  designation?: string;
  image?: string;
}

interface UserContextType {
  userData: UserData;
}

const DropdownUser: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userData } = useContext(UserContext) as UserContextType;

  const handleLogout = (): void => {
    localStorage.removeItem('accessToken'); // ✅ Remove token
    navigate('/auth/signin'); // ✅ Redirect to sign-in
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {userData.name || 'Guest User'}
          </span>
          <span className="block text-xs">
            {userData.designation || 'Mobile not available'}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full overflow-hidden">
          <img
            src={userData.image || UserOne}
            alt="User"
            className="object-cover w-full h-full"
          />
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/Accounts"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                    fill=""
                  />
                  <path
                    d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                    fill=""
                  />
                </svg>
                Account
              </Link>
            </li>
            <li>
              <Link
                to="/Manage-Business"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <MdBusiness size={25} />
                Manage Business
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <MdGroup size={25} />
                Manage Staff
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout} // ✅ Add onClick
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          >
            <svg
              className="fill-current"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <path
                d="M14.9688 1.82812C14.5746 1.43389 13.9333 1.43389 13.5391 1.82812L9.53906 5.82812C9.14483 6.22235 9.14483 6.86368 9.53906 7.25791C9.93329 7.65214 10.5746 7.65214 10.9688 7.25791L13 5.22656V15.5C13 16.0523 13.4477 16.5 14 16.5C14.5523 16.5 15 16.0523 15 15.5V5.22656L17.0312 7.25791C17.4255 7.65214 18.0668 7.65214 18.4611 7.25791C18.8553 6.86368 18.8553 6.22235 18.4611 5.82812L14.9688 1.82812Z"
                fill=""
              />
              <path
                d="M4 2.75C4 2.19772 4.44772 1.75 5 1.75H9C9.55228 1.75 10 1.30228 10 0.75C10 0.197715 9.55228 -0.25 9 -0.25H5C3.34315 -0.25 2 1.09315 2 2.75V19.25C2 20.9069 3.34315 22.25 5 22.25H9C9.55228 22.25 10 21.8023 10 21.25C10 20.6977 9.55228 20.25 9 20.25H5C4.44772 20.25 4 19.8023 4 19.25V2.75Z"
                fill=""
              />
            </svg>
            Log Out
          </button>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
