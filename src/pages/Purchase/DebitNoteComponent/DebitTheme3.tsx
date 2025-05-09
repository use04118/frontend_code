import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPalette, FaTimes, FaUndo } from 'react-icons/fa';
import html2pdf from 'html2pdf.js';

// Add ThemeColors interface
interface ThemeColors {
  headerBg: string;
  headerText: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  tableBorder: string;
  totalSectionBg: string;
  totalSectionText: string;
  bodyBg: string;
  bodyText: string;
  accentColor: string;
}

// Add invoiceThemes object with all themes
const invoiceThemes: Record<string, ThemeColors> = {
  'theme1': {
    headerBg: '#1a365d',
    headerText: '#ffffff',
    tableHeaderBg: '#2d3748',
    tableHeaderText: '#ffffff',
    tableBorder: '#4a5568',
    totalSectionBg: '#f7fafc',
    totalSectionText: '#1a365d',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#4299e1',
  },
  'theme2': {
    headerBg: '#2c5282',
    headerText: '#ffffff',
    tableHeaderBg: '#4299e1',
    tableHeaderText: '#ffffff',
    tableBorder: '#90cdf4',
    totalSectionBg: '#ebf8ff',
    totalSectionText: '#2c5282',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#3182ce',
  },
  'theme3': {
    headerBg: '#2f855a',
    headerText: '#ffffff',
    tableHeaderBg: '#48bb78',
    tableHeaderText: '#ffffff',
    tableBorder: '#9ae6b4',
    totalSectionBg: '#f0fff4',
    totalSectionText: '#2f855a',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#38a169',
  },
  'theme4': {
    headerBg: '#744210',
    headerText: '#ffffff',
    tableHeaderBg: '#b7791f',
    tableHeaderText: '#ffffff',
    tableBorder: '#f6ad55',
    totalSectionBg: '#fffbeb',
    totalSectionText: '#744210',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#d69e2e',
  },
  'theme5': {
    headerBg: '#702459',
    headerText: '#ffffff',
    tableHeaderBg: '#b83280',
    tableHeaderText: '#ffffff',
    tableBorder: '#f687b3',
    totalSectionBg: '#fff5f7',
    totalSectionText: '#702459',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#d53f8c',
  },
  'theme6': {
    headerBg: '#521b41',
    headerText: '#ffffff',
    tableHeaderBg: '#805ad5',
    tableHeaderText: '#ffffff',
    tableBorder: '#b794f4',
    totalSectionBg: '#faf5ff',
    totalSectionText: '#521b41',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#6b46c1',
  },
  'theme7': {
    headerBg: '#1a202c',
    headerText: '#ffffff',
    tableHeaderBg: '#2d3748',
    tableHeaderText: '#ffffff',
    tableBorder: '#4a5568',
    totalSectionBg: '#2d3748',
    totalSectionText: '#ffffff',
    bodyBg: '#1a202c',
    bodyText: '#e2e8f0',
    accentColor: '#4299e1',
  },
  'theme8': {
    headerBg: '#2d3748',
    headerText: '#ffffff',
    tableHeaderBg: '#4a5568',
    tableHeaderText: '#ffffff',
    tableBorder: '#718096',
    totalSectionBg: '#edf2f7',
    totalSectionText: '#2d3748',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#4a5568',
  },
  'theme9': {
    headerBg: '#2c7a7b',
    headerText: '#ffffff',
    tableHeaderBg: '#319795',
    tableHeaderText: '#ffffff',
    tableBorder: '#81e6d9',
    totalSectionBg: '#e6fffa',
    totalSectionText: '#2c7a7b',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#319795',
  },
  'theme10': {
    headerBg: '#9f7aea',
    headerText: '#ffffff',
    tableHeaderBg: '#b794f4',
    tableHeaderText: '#ffffff',
    tableBorder: '#e9d8fd',
    totalSectionBg: '#faf5ff',
    totalSectionText: '#553c9a',
    bodyBg: '#ffffff',
    bodyText: '#2d3748',
    accentColor: '#805ad5',
  },
  'theme11': {
    headerBg: '#2C3E50',
    headerText: '#ECF0F1',
    tableHeaderBg: '#34495E',
    tableHeaderText: '#ECF0F1',
    tableBorder: '#7F8C8D',
    totalSectionBg: '#ECF0F1',
    totalSectionText: '#2C3E50',
    bodyBg: '#FFFFFF',
    bodyText: '#2C3E50',
    accentColor: '#3498DB',
  },
  'theme12': {
    headerBg: '#8E44AD',
    headerText: '#FFFFFF',
    tableHeaderBg: '#9B59B6',
    tableHeaderText: '#FFFFFF',
    tableBorder: '#BB8FCE',
    totalSectionBg: '#F4ECF7',
    totalSectionText: '#8E44AD',
    bodyBg: '#FFFFFF',
    bodyText: '#2C3E50',
    accentColor: '#9B59B6',
  },
  'theme13': {
    headerBg: '#C0392B',
    headerText: '#FFFFFF',
    tableHeaderBg: '#E74C3C',
    tableHeaderText: '#FFFFFF',
    tableBorder: '#F5B7B1',
    totalSectionBg: '#FDEDEC',
    totalSectionText: '#C0392B',
    bodyBg: '#FFFFFF',
    bodyText: '#2C3E50',
    accentColor: '#E74C3C',
  },
  'theme14': {
    headerBg: '#1A5276',
    headerText: '#FFFFFF',
    tableHeaderBg: '#2874A6',
    tableHeaderText: '#FFFFFF',
    tableBorder: '#AED6F1',
    totalSectionBg: '#EBF5FB',
    totalSectionText: '#1A5276',
    bodyBg: '#FFFFFF',
    bodyText: '#2C3E50',
    accentColor: '#3498DB',
  },
  'theme15': {
    headerBg: '#196F3D',
    headerText: '#FFFFFF',
    tableHeaderBg: '#27AE60',
    tableHeaderText: '#FFFFFF',
    tableBorder: '#ABEBC6',
    totalSectionBg: '#E8F8F5',
    totalSectionText: '#196F3D',
    bodyBg: '#FFFFFF',
    bodyText: '#2C3E50',
    accentColor: '#2ECC71',
  },
  'theme16': {
    headerBg: '#7D6608',
    headerText: '#FFFFFF',
    tableHeaderBg: '#B7950B',
    tableHeaderText: '#FFFFFF',
    tableBorder: '#F9E79F',
    totalSectionBg: '#FEF9E7',
    totalSectionText: '#7D6608',
    bodyBg: '#FFFFFF',
    bodyText: '#2C3E50',
    accentColor: '#F1C40F',
  },
};

const DebitTheme3 = () => {
  const { id } = useParams(); // Get debitNote number from URL
  console.log('DebitNote Number from URL:', id);
  const [debitNoteData, setDebitNoteData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [partyData, setPartyData] = useState({});
  const [businessState, setBusinessState] = useState('');
  const [isTcsEnabled, setIsTcsEnabled] = useState<boolean>(false);
  const [isTdsEnabled, setIsTdsEnabled] = useState<boolean>(false);

  // Add theme-related state
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('theme1');
  const [themeColors, setThemeColors] = useState<ThemeColors>(invoiceThemes.theme1);
  const themeSelectorRef = useRef<HTMLDivElement>(null);

  // Add click outside handler for theme selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeSelectorRef.current && !themeSelectorRef.current.contains(event.target as Node)) {
        setShowThemeSelector(false);
      }
    };

    if (showThemeSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeSelector]);

  // Add theme change handler
  const handleThemeChange = (themeKey: string) => {
    setSelectedTheme(themeKey);
    setThemeColors(invoiceThemes[themeKey]);
  };

  // Add theme selector styles
  const themeSelectorStyles: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    backgroundColor: themeColors.bodyBg,
    color: themeColors.bodyText,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    width: '300px',
    border: `1px solid ${themeColors.tableBorder}`,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const themeGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    overflowY: 'auto',
    padding: '8px',
    maxHeight: 'calc(80vh - 100px)',
    scrollbarWidth: 'thin',
    scrollbarColor: `${themeColors.accentColor} ${themeColors.bodyBg}`,
  };

  // Add scrollbar styles
  const scrollbarStyles = `
    .theme-grid::-webkit-scrollbar {
      width: 6px;
    }
    .theme-grid::-webkit-scrollbar-track {
      background: ${themeColors.bodyBg};
      border-radius: 3px;
    }
    .theme-grid::-webkit-scrollbar-thumb {
      background: ${themeColors.accentColor};
      border-radius: 3px;
    }
    .theme-grid::-webkit-scrollbar-thumb:hover {
      background: ${themeColors.tableHeaderBg};
    }
  `;

  useEffect(() => {
    console.log('Fetching data for debitNote_no:', id); // Debugging

    if (!id) return; // Prevent fetching if debitNote_no is undefined

    const fetchDebitNoteDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/purchase/debitnote/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data) {
          setDebitNoteData(data);
        } else {
          console.error('Unexpected API response format:', data);
          setDebitNoteData([]); // Default to empty array if data is not an array
        }
      } catch (error) {
        console.error('Error fetching debitNote details:', error);
      }
    };

    const fetchParties = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/parties/parties`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (Array.isArray(data.results)) {
          const partyMap = {};
          data.results.forEach((party) => {
            partyMap[party.id] = {
              name: party.party_name,
              mobile: party.mobile_number,
              address: party.shipping_address,
              state: party.state,
            };
          });
          setPartyData(partyMap);
        }
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };

    fetchDebitNoteDetails();
    fetchParties();
  }, [id]);

  useEffect(() => {
    const fetchTcsSetting = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');
        const response = await fetch(`${API_URL}/sales/settings/tcs-tds/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }); // 🛠️ Replace with your actual API
        const data = await response.json();
        // Assuming API response looks like: { isTcsEnabled: true }
        setIsTcsEnabled(data.tcs);
        setIsTdsEnabled(data.tds);
        setBusinessState(data?.state); // ✅ Save the state
      } catch (error) {
        console.error('Error fetching TCS setting:', error);
      }
    };

    fetchTcsSetting();
  }, []);

  const generatePDF = () => {
    // Delay PDF generation to allow theme and styles to be applied
    setTimeout(() => {
      const element = document.getElementById('debit-content'); // Get the content for PDF generation

      // Ensure the background color is applied according to the active theme
      const backgroundColor = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? '#333'
        : '#fff';

      const options = {
        margin: [10, 10, 10, 10], // Set margins around the content
        filename: `${debitNoteData.invoice_no}_Invoice.pdf`,
        html2canvas: {
          scale: 5, // Ensure better resolution for text and images
          backgroundColor: backgroundColor, // Set the background color based on theme
          logging: false,
          useCORS: true, // Handle external resources like images
          letterRendering: true, // Improve font rendering
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      // Generate and save the PDF
      html2pdf().from(element).set(options).save();
    }, 200); // Adjust timeout if necessary to ensure the content is fully rendered
  };

  if (!debitNoteData) return <p>Loading...</p>;

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  const partyInfo = partyData[debitNoteData.party] || {
    name: 'Loading...',
    mobile: 'Loading...',
    address: 'Loading...',
  };

  const partyState = partyInfo.state || '';
  console.log(partyState);

  const isSameState =
    partyState?.trim().toLowerCase() === businessState?.trim().toLowerCase();

  const numberToWords = (num) => {
    const a = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const b = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];

    const convert = (n) => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          ' Hundred' +
          (n % 100 ? ' ' + convert(n % 100) : '')
        );
      if (n < 100000)
        return (
          convert(Math.floor(n / 1000)) +
          ' Thousand' +
          (n % 1000 ? ' ' + convert(n % 1000) : '')
        );
      return 'Number too large';
    };

    return num === 0 ? 'Zero' : convert(num);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this debitNote?',
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/purchase/debitnote/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('DebitNote deleted successfully.');
        navigate('/Purchase/Debit-Note'); // Redirect to debitNote list page
      } else {
        const errorData = await response.json();
        alert(`Failed to delete debitNote: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting debitNote:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-debitnote/${id}`, { state: { debitNoteData } });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-8">
      <div className="flex justify-end space-x-4 mb-4">
        {/* Add theme selector button */}
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className="px-4 py-2 rounded flex items-center gap-2"
          style={{ backgroundColor: themeColors.accentColor, color: '#ffffff' }}
        >
          <FaPalette /> Choose Theme
        </button>
        <button
          onClick={() => {
            setSelectedTheme('theme1');
            setThemeColors(invoiceThemes.theme1);
          }}
          className="px-4 py-2 rounded flex items-center gap-2"
          style={{ 
            backgroundColor: themeColors.tableHeaderBg, 
            color: themeColors.tableHeaderText,
            border: `1px solid ${themeColors.tableBorder}`,
          }}
        >
          <FaUndo /> Reset Theme
        </button>
        {/* Update existing buttons with theme colors */}
        <button
          onClick={generatePDF}
          style={{
            padding: '10px 20px',
            backgroundColor: themeColors.accentColor,
            color: '#ffffff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Download as PDF
        </button>
        <button
          onClick={handleEdit}
          style={{
            backgroundColor: themeColors.accentColor,
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          <FaEdit />
        </button>
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: themeColors.accentColor,
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '4px',
          }}
        >
          <FaTrash />
        </button>
      </div>

      {/* Add theme selector UI */}
      {showThemeSelector && (
        <>
          <style>{scrollbarStyles}</style>
          <div style={themeSelectorStyles} ref={themeSelectorRef}>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-inherit pb-2">
              <h3 className="text-lg font-bold" style={{ color: themeColors.headerText }}>
                Select Debit Note Theme
              </h3>
              <button
                onClick={() => setShowThemeSelector(false)}
                style={{ 
                  color: themeColors.bodyText,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: `1px solid ${themeColors.tableBorder}`,
                }}
              >
                ×
              </button>
            </div>
            <div className="theme-grid" style={themeGridStyles}>
              {Object.entries(invoiceThemes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTheme === key ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: theme.headerBg,
                    color: theme.headerText,
                    borderColor: selectedTheme === key ? theme.accentColor : theme.tableBorder,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div className="h-4 w-full" style={{ backgroundColor: theme.tableHeaderBg }} />
                  <div className="h-2 w-3/4" style={{ backgroundColor: theme.accentColor }} />
                  <div className="h-2 w-1/2" style={{ backgroundColor: theme.totalSectionBg }} />
                  <span style={{ 
                    fontSize: '12px',
                    color: theme.headerText,
                    marginTop: '4px',
                  }}>
                    {key.replace('theme', 'Theme ')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Update main content with theme colors */}
      <div
        id="debit-content"
        className="max-w-4xl mx-auto border p-6 shadow-md"
        style={{
          backgroundColor: themeColors.bodyBg,
          color: themeColors.bodyText,
          borderColor: themeColors.tableBorder,
        }}
      >
        {/* Update header with theme colors */}
        <div 
          className="flex justify-between items-start mb-6"
          style={{ 
            backgroundColor: themeColors.headerBg,
            color: themeColors.headerText,
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <div>
            <h1 className="text-xl font-bold" style={{ color: themeColors.headerText }}>
              gupta
            </h1>
            <p style={{ color: themeColors.headerText }}>
              Mobile: 9455956183
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex space-x-2 items-center">
              <p className="p-2 font-bold" style={{ color: themeColors.headerText }}>
                TAX INVOICE
              </p>
              <div 
                className="p-2 text-sm rounded flex items-center justify-center min-h-[32px]"
                style={{ 
                  backgroundColor: themeColors.tableHeaderBg,
                  color: themeColors.tableHeaderText,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                ORIGINAL FOR RECIPIENT
              </div>
            </div>

            <div className="mt-2 text-right">
              <p style={{ color: themeColors.headerText }}>
                <strong>DebitNote No.:</strong> {debitNoteData.debit_note_no}
              </p>
              <p style={{ color: themeColors.headerText }}>
                <strong>DebitNote Date:</strong> {debitNoteData.date}
              </p>
              <p style={{ color: themeColors.headerText }}>
                <strong>Due Date:</strong> {debitNoteData.due_date}
              </p>
            </div>
          </div>
        </div>

        {/* Update Bill To & Ship To with theme colors */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div 
            className="p-4 rounded-lg flex flex-col"
            style={{ 
              backgroundColor: themeColors.totalSectionBg,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <div 
              className="mb-3 p-2 rounded flex items-center justify-center min-h-[40px]"
              style={{ 
                backgroundColor: themeColors.tableHeaderBg,
                color: themeColors.tableHeaderText,
              }}
            >
              <p className="text-sm font-bold">BILL TO</p>
            </div>
            <div style={{ color: themeColors.bodyText }}>
            <p className="text-sm text-black dark:text-white">
              {partyInfo.name}
            </p>
            <p className="text-sm">Mobile: {partyInfo.mobile}</p>
          </div>
          </div>
          <div 
            className="p-4 rounded-lg flex flex-col"
            style={{ 
              backgroundColor: themeColors.totalSectionBg,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <div 
              className="mb-3 p-2 rounded flex items-center justify-center min-h-[40px]"
              style={{ 
                backgroundColor: themeColors.tableHeaderBg,
                color: themeColors.tableHeaderText,
              }}
            >
              <p className="text-sm font-bold">SHIP TO</p>
            </div>
            <div style={{ color: themeColors.bodyText }}>
            <p className="text-sm text-black dark:text-white">
              {partyInfo.address}
            </p>
            <p className="text-sm">Kanpur Nagar, 208012</p>
            </div>
          </div>
        </div>

        {/* Update table with theme colors */}
        <table 
          className="w-full border-collapse mb-4 text-sm"
          style={{ borderColor: themeColors.tableBorder }}
        >
          <thead>
            <tr style={{ 
              backgroundColor: themeColors.tableHeaderBg,
              color: themeColors.tableHeaderText,
            }}>
              <th className="border border-gray-300 p-2 text-left">S.NO.</th>
              <th className="border border-gray-300 p-2 text-left">ITEMS</th>
              <th className="border border-gray-300 p-2 text-left">QTY.</th>
              <th className="border border-gray-300 p-2 text-left">RATE</th>
              <th className="border border-gray-300 p-2 text-left">Discount</th>
              <th className="border border-gray-300 p-2 text-left">TAX</th>
              <th className="border border-gray-300 p-2 text-left">CESS</th>
              <th className="border border-gray-300 p-2 text-left">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {debitNoteData.debitnote_items.map((item, index) => (
              <tr key={item.id} style={{ color: themeColors.bodyText }}>
                <td className="border border-gray-300 p-2">{index + 1}</td>
                <td className="border border-gray-300 p-2">
                  {item.item_name || item.service_name}
                </td>
                <td className="border border-gray-300 p-2">{item.quantity}</td>
                <td className="border border-gray-300 p-2">
                  ₹{item.price_item}
                </td>
                <td className="border border-gray-300 p-2">{item.discount}</td>
                <td className="border border-gray-300 p-2">{item.tax_rate}%</td>
                <td className="border border-gray-300 p-2">
                  {item.cess_rate}%
                </td>
                <td className="border border-gray-300 p-2">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Update subtotal section with theme colors */}
        <div 
          className="font-semibold text-sm px-4 py-2 flex justify-between mb-2"
          style={{ 
            backgroundColor: themeColors.totalSectionBg,
            color: themeColors.totalSectionText,
          }}
        >
          <p className="w-1/5">SUBTOTAL</p>
          <p className="w-1/5 text-center">
            {debitNoteData.debitnote_items.length}
          </p>
          <p className="w-1/5 text-right">
            ₹{' '}
            {(
              debitNoteData.total_amount - debitNoteData.taxable_amount
            ).toFixed(2)}
          </p>
          <p className="w-1/5 text-right">₹ {debitNoteData.total_amount}</p>
        </div>

        {/* Update terms and conditions section with theme colors */}
        <div className="flex justify-between text-sm mb-4">
          <div className="w-1/2 pr-4" style={{ color: themeColors.bodyText }}>
            <p className="font-bold">TERMS AND CONDITIONS</p>
            <p>1. Goods once sold will not be taken back or exchanged.</p>
            <p>
              2. All disputes are subject to [ENTER_YOUR_CITY_NAME] jurisdiction
              only.
            </p>
          </div>
          <div 
            className="w-1/2 pl-4 border-l"
            style={{ 
              borderColor: themeColors.tableBorder,
              color: themeColors.bodyText,
            }}
          >
            <div className="flex justify-between items-center mb-2 text-right">
              <p>Taxable Amount:</p>
              <p>{debitNoteData.taxable_amount}</p>
            </div>
            {/* Grouping CGST, SGST, and CESS Rates */}
            {(() => {
              const taxSummary = {};

              debitNoteData.debitnote_items.forEach((item) => {
                const key = isSameState ? item.sgst : item.igst;

                if (taxSummary[key]) {
                  // Add amounts
                  if (isSameState) {
                    taxSummary[key].cgst_amount += parseFloat(item.cgst_amount);
                    taxSummary[key].sgst_amount += parseFloat(item.sgst_amount);
                  } else {
                    taxSummary[key].igst_amount += parseFloat(item.igst_amount);
                  }
                } else {
                  taxSummary[key] = isSameState
                    ? {
                        cgst_rate: item.cgst,
                        cgst_amount: parseFloat(item.cgst_amount),
                        sgst_rate: item.sgst,
                        sgst_amount: parseFloat(item.sgst_amount),
                        cess_rate: item.cess_rate,
                        cess_amount: parseFloat(item.cess_rate_amount),
                      }
                    : {
                        igst_rate: item.igst,
                        igst_amount: parseFloat(item.igst_amount),
                        cess_rate: item.cess_rate,
                        cess_amount: parseFloat(item.cess_rate_amount),
                      };
                }
              });

              return Object.values(taxSummary).map((tax, index) => (
                <div key={index} className="text-right mb-2">
                  {isSameState ? (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <p>CGST @{tax.cgst_rate}%:</p>
                        <p>{tax.cgst_amount.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <p>SGST @{tax.sgst_rate}%:</p>
                        <p>{tax.sgst_amount.toFixed(2)}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <p>IGST @{tax.igst_rate}%:</p>
                      <p>{tax.igst_amount.toFixed(2)}</p>
                    </div>
                  )}

                  {tax.cess_rate > 0 && (
                    <div className="flex justify-between items-center mb-2">
                      <p>CESS @{tax.cess_rate}%:</p>
                      <p>{tax.cess_amount.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              ));
            })()}
            <div className="mb-4 border-t border-b border-black pt-2 pb-2 text-right space-y-2">
              {isTcsEnabled && (
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-bold">TCS AMOUNT</p>
                  <p className="text-sm font-bold">
                    ₹{debitNoteData.tcs_amount}
                  </p>
                </div>
              )}
              {isTdsEnabled && (
                <div className="flex justify-between">
                  <p className="text-sm font-bold">TDS AMOUNT</p>
                  <p className="text-sm font-bold">
                    ₹{debitNoteData.tds_amount}
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <p className="text-sm font-bold">TOTAL AMOUNT</p>
                <p className="text-sm font-bold">
                  ₹{debitNoteData.total_amount}
                </p>
              </div>
              {isTdsEnabled && (
                <div className="flex justify-between">
                  <p className="text-sm font-bold">TOTAL PAYABLE AMOUNT</p>
                  <p className="text-sm font-bold">
                    ₹{debitNoteData.total_payable_amount}
                  </p>
                </div>
              )}
            </div>
            {/* Amount Received & Balance */}
            <div className="flex justify-between items-center mb-2 text-right">
              <p>Received Amount:</p>
              <p>₹{debitNoteData.amount_received}</p>
            </div>
            <div className="flex justify-between items-center mb-2 text-right">
              <p className="text-sm font-bold">Balance</p>
              <p className="text-sm font-bold">
                ₹{debitNoteData.balance_amount}
              </p>
            </div>
          </div>
        </div>
        {/* Total Amount */}

        {/* Update amount in words with theme colors */}
        <div 
          className="text-right text-sm"
          style={{ color: themeColors.bodyText }}
        >
          <p className="font-bold">Total Amount (in words)</p>
          <p>{numberToWords(debitNoteData.total_amount)} Rupees</p>
        </div>
      </div>

      {/* Update back button with theme colors */}
      <div className="flex justify-end mt-4 gap-4">
        <button
          type="button"
          onClick={handleBack}
          style={{
            backgroundColor: themeColors.accentColor,
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '4px',
            border: `1px solid ${themeColors.tableBorder}`,
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default DebitTheme3;
