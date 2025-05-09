import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import Logo from '../../images/logo/Login_page_imaage.jpg';
import Preloader from '../../components/Preloader';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface AuthResponse {
  user_exists: boolean;
  invited_as_staff: boolean;
  owns_business: boolean;
  is_staff: boolean;
  message?: string;
}

interface LoginResponse {
  access: string;
  detail?: string;
}

const SignIn: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [message, setMessage] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [userExists, setUserExists] = useState(false);
  const [invitedAsStaff, setInvitedAsStaff] = useState(false);
  const [ownsBusiness, setOwnsBusiness] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      const { data } = await axios.post<AuthResponse>(`${API_URL}/users/auth/request-otp/`, {
        mobile
      });

      const { user_exists, invited_as_staff, owns_business, is_staff } = data;

      setOtpSent(true);
      setTimer(60);
      setIsTimerRunning(true);

      setUserExists(user_exists);
      setInvitedAsStaff(invited_as_staff);
      setOwnsBusiness(owns_business);
      setIsStaff(is_staff);

      if (!user_exists && invited_as_staff) {
        setMessage("You've been invited to join a business. Enter OTP to continue.");
      } else if (!user_exists) {
        setMessage("Welcome! You will create your business after login.");
      } else if (owns_business) {
        setMessage("Welcome back, Owner. Enter OTP to login.");
      } else if (is_staff && !owns_business) {
        setMessage("You're part of one or more businesses. Enter OTP to continue.");
      } else {
        setMessage("No business linked yet. You can create one.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Failed to send OTP');
      } else {
        console.error('Error sending OTP:', error);
        alert('Something went wrong while sending OTP');
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert('Please enter a 6-digit OTP');
      return;
    }

    const result = await login(mobile, otp);

    if (result.access) {
      if (!userExists || (!ownsBusiness && !isStaff)) {
        navigate('/Create-Business');
      } else if (ownsBusiness || isStaff) {
        navigate('/admin');
      }
    } else {
      alert(result.detail || 'OTP verification failed');
    }
  };

  const handleScroll = () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    setScrollProgress(progress);
  };

  useEffect(() => {
    // Track scroll progress
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    // Set up page load detection
    if (document.readyState === 'complete') {
      setPageLoaded(true);
    } else {
      window.addEventListener('load', () => setPageLoaded(true));
    }

    // Display welcome toast after page loads
    const timer = setTimeout(() => {
      toast.success("Welcome to BillBook!", {
        duration: 5000,
      });
    }, 2500);

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href') || '');
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('load', () => setPageLoaded(true));
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Section: Form */}
      <Preloader />
      <div className="w-1/2 flex items-center justify-center bg-white dark:bg-boxdark">
        <div className="w-full max-w-md p-6">
          <h3 className="text-lg font-medium text-black dark:text-white mb-4">Sign-in</h3>
          <div className="rounded-md border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
            <div className="p-6 sm:p-10">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                Login / Register
              </h2>
              {otpSent && (
                <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              )}
              <form onSubmit={otpSent ? handleVerifyOtp : handleGetOtp}>
                {/* Mobile Number */}
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Enter your mobile number
                  </label>
                  <div className="flex rounded-lg border border-stroke bg-transparent text-black dark:border-form-strokedark dark:bg-form-input dark:text-white">
                    <span className="px-4 py-4 bg-gray-100 dark:bg-strokedark border-r border-stroke dark:border-strokedark">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      className="w-full py-4 px-4 bg-transparent outline-none focus:border-primary focus-visible:shadow-none"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      disabled={otpSent}
                    />
                  </div>
                </div>

                {/* OTP Field */}
                {otpSent && (
                  <>
                    <div className="mb-4">
                      <label className="mb-2.5 block font-medium text-black dark:text-white">
                        Enter OTP
                      </label>
                      <input
                        type="text"
                        placeholder="OTP"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                      You can request another OTP in{' '}
                      <span className="font-semibold">{timer}</span> seconds
                    </p>
                  </>
                )}

                {/* Submit Button */}
                <div className="mb-5">
                  <input
                    type="submit"
                    value={otpSent ? (userExists ? 'Login' : 'Register') : 'Get OTP'}
                    className={`w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${
                      otpSent && otp.length !== 6 ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    disabled={otpSent && otp.length !== 6}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Image */}
      <div className="w-1/2 h-screen hidden md:block">
        <img
          src={Logo}
          alt="Sign In Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignIn;
