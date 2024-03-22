import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import Tooltip from '@mui/material/Tooltip';

const TwoFactorSetup = ({auth}) => {
  const [status, setStatus] = useState('disabled');
  const [qrCode, setQrCode] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch authenticated user data
        // const response = await axios.get('/user');
        const user = auth.faculty;
        // Check if two_factor_secret is null
        if (user.two_factor_secret !== null) {
          setStatus('enabled');
          const qrResponse = await axios.get('/user/two-factor-qr-code');
          setQrCode(qrResponse.data.svg);
          const recoveryCodesResponse = await axios.get('/user/two-factor-recovery-codes');
          setRecoveryCodes(recoveryCodesResponse.data);
        } else {
          setStatus('disabled');
        }
        setError(null);
      } catch (error) {
        setError('Error fetching two-factor authentication status');
      }
    };
    fetchData();
  }, []);

  const handleToggle = async () => {
    try {
      if (status === 'disabled') {
        await axios.post('/user/two-factor-authentication');
        setStatus('enabled');
        const qrResponse = await axios.get('/user/two-factor-qr-code');
        setQrCode(qrResponse.data.svg);
        const recoveryCodesResponse = await axios.get('/user/two-factor-recovery-codes');
        setRecoveryCodes(recoveryCodesResponse.data);
        setError(null);
      } else {
        await axios.delete('/user/two-factor-authentication');
        setStatus('disabled');
        setQrCode('');
        setRecoveryCodes([]);
        setError(null);
      }
    } catch (error) {
      setError('Error toggling two-factor authentication');
    }
  };

  const handleConfirmation = async () => {
    try {
      await axios.post('/user/confirmed-two-factor-authentication', {
        code: confirmationCode
      });
      setStatus('confirmed');
      setError(null);
     
      window.setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      setError('Error confirming two-factor authentication');
    }
  };

  const handleRegenerateRecoveryCodes = async () => {
    try {
      const response = await axios.get('/user/two-factor-recovery-codes');
      setRecoveryCodes(response.data);
      setError(null);
      setSuccess('Regenerated new recovery codes, refresh page to see new codes');
    } catch (error) {
      setError('Error regenerating recovery codes');
    }
  };

  return (
    <div>
      <h4 className="text-xl font-bold dark:text-white">
        {status === 'disabled' && 
        <Tooltip title="You are less secure when two-step verification is disabled" arrow>
        <PrivacyTipOutlinedIcon style={{color: 'red', marginRight: 10, fontSize: 30}}/>
        </Tooltip>
         }
         
         {status === 'enabled' && 
        <Tooltip title="You are now more secure with two-step verification" arrow>
        <GppGoodOutlinedIcon style={{color: 'green', marginRight: 10, fontSize: 30}}/>
        </Tooltip>
         }

         {}
        Two-Step Verification</h4>

              {error && <div className="text-red-500 dark:text-red-400 mt-4">{error}</div>}
      {success && <div className="text-emerald-500 dark:text-emerald-400 mt-4">{success}</div>}
      <p className="dark:text-white m-3 text-lg">Two-step verification adds an extra lock to your online accounts. You need to enter two secret codes to get in, making it harder for malicious adversaries to access your data. It keeps your accounts safe and your information private.</p>

      {status === 'disabled' && (
        <div className="mt-3">
          <p className="dark:text-orange-300 text-orange-400 mt-4 mb-4">
           Two-step authentication is disabled</p>
          <Button onClick={handleToggle} label="Enable" />
        </div>
      )}
     {status === 'enabled' && (
  <div className="mt-3">
    <p className="text-emerald-600 dark:text-emerald-400 text-lg mb-3 text-wrap">
      
     Two-step authentication is currently enabled. Whenever you login, you will be prompted to enter a 6 digit code from your authenticator app.</p>
    <Button onClick={handleToggle} label="Disable" />       
    {auth.faculty.two_factor_secret === null ? (
      <>
        <p className="dark:text-white mb-3 mt-3">Please scan the QR code below with your authenticator app:</p>
        <div dangerouslySetInnerHTML={{ __html: qrCode }} className="mb-4"/>
        <InputText type="text" id="confirmationCode" name="confirmationCode" placeholder="Enter Code" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} />
        <Button onClick={handleConfirmation} label="Confirm" />
      </> // <-- Closing tag for the fragment
    ) : null}   
    <div className="bg-slate-100 dark:bg-slate-700 w-50 m-3 p-3 rounded">
    <h5 className="dark:text-white mb-3 mt-3 text-xl font-medium">Recovery Codes:</h5>
    <p className="dark:text-white mt-3 mb-3 text-lg text-wrap">Store these recovery codes in a secure password manager. They can be used to 
    recover access to your account if your two-step verification device is lost
    </p>
    {recoveryCodes.map((code, index) => (
      <div className="dark:text-white p-1 bg-slate-100 dark:bg-slate-600" key={index}>{code}</div>
    ))}
    </div>
    <Button onClick={handleRegenerateRecoveryCodes} label="Regenerate Recovery Codes" />
  </div>
)}

      {status === 'confirmed' && (
        <div className="mt-3">
          <p className="text-emerald-500 dark:text-emerald-400 mt-3">Two-step authentication confirmed.</p>
          <Button onClick={handleToggle} label="Disable"/>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;
