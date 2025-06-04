import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Stepper from '../../components/Stepper';
import { Check, Download, Phone } from 'lucide-react';
import { addYears, format } from 'date-fns';
import emailjs from 'emailjs-com';
import jsPDF from 'jspdf';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Use state for policy because you want to update it on load from localStorage if needed
  const [policy, setPolicy] = useState(location.state?.policy || null);

  // Load policy from localStorage if not found in location.state
  useEffect(() => {
    if (!policy) {
      const storedPolicy = JSON.parse(localStorage.getItem('policy'));
      if (storedPolicy) {
        setPolicy(storedPolicy);
      } else {
        navigate('/');
      }
    }
  }, [policy, navigate]);

  // Save policy and confirmation data to backend API
  useEffect(() => {
    if (!policy) return;

    const saveData = async () => {
      try {
        const customerRes = await fetch(
          'https://interview-prepare-morz.onrender.com/api/customers/create',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(policy),
          }
        );

        const savedCustomer = await customerRes.json();
        const customerId = savedCustomer._id;

        await fetch('https://interview-prepare-morz.onrender.com/api/confirmations/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policyType: policy.policyType,
            amount: policy.amount,
            expiryDate: new Date(),
            customerId,
          }),
        });
      } catch (error) {
        console.error('❌ Error saving data:', error);
      }
    };

    saveData();
  }, [policy]);

  // Calculate expiry date (3 years from today)
  const today = new Date();
  const expiryDate = format(addYears(today, 3), 'dd/M/yyyy');

  // Send confirmation email with emailjs
  useEffect(() => {
    if (!policy) return;

    const emailParams = {
      customerName: policy.customerName,
      policyType: policy.policyType,
      policyId: policy.id,
      expiryDate,
      amount: policy.amount + Math.round(policy.amount * 0.18),
      email: policy.email,
    };

    emailjs
      .send('service_jxfnu9e', 'template_6nqqa86', emailParams, 'KjdPUWClLtvszArtz')
      .then((res) => {
        console.log('✅ Email sent successfully!', res.status, res.text);
      })
      .catch((err) => {
        console.error('❌ Failed to send email:', err);
      });
  }, [policy, expiryDate]);

  // Generate PDF for policy details
  const generatePDF = () => {
    if (!policy) return;

    const doc = new jsPDF();
    const amount = policy.amount + Math.round(policy.amount * 0.18);

    doc.setFontSize(16);
    doc.text('KALYAN CAR WORKSHOP', 20, 20);
    doc.setFontSize(12);
    doc.text('1-Year Nationwide Roadside Assistance (RSA) Service Plan', 20, 28);

    doc.setFont(undefined, 'bold');
    doc.text('Customer Details', 20, 38);
    doc.setFont(undefined, 'normal');
    doc.text(`Full Name: ${policy.customerName}`, 20, 46);
    doc.text(`Email ID: ${policy.email}`, 20, 62);
    doc.text(`Vehicle Registration Number: ${policy.vehicleNumber}`, 20, 70);
    doc.text(`Valid From: ${format(today, 'dd/MM/yyyy')}`, 20, 78);
    doc.text(`Valid Upto: ${expiryDate}`, 20, 86);

    doc.setFont(undefined, 'bold');
    doc.text('Plan Overview', 20, 96);
    doc.setFont(undefined, 'normal');
    doc.text('Our RSA plan ensures you’re never stranded due to vehicle issues.', 20, 104);
    doc.text('This 1-Year nationwide service covers emergency support, minor repairs,', 20, 110);
    doc.text('and towing assistance to get you moving again quickly and safely.', 20, 116);

    doc.setFont(undefined, 'bold');
    doc.text('Plan Pricing', 20, 126);
    doc.setFont(undefined, 'normal');
    doc.text(`Hatchback: ₹2,500/year ${policy.policyType === 'Hatchback' ? '☑' : '☐'}`, 20, 134);
    doc.text(`Sedan: ₹3,500/year ${policy.policyType === 'Sedan' ? '☑' : '☐'}`, 20, 142);
    doc.text(`SUV: ₹4,000/year ${policy.policyType === 'SUV' ? '☑' : '☐'}`, 20, 150);

    doc.setFont(undefined, 'bold');
    doc.text('Key Highlights', 20, 160);
    doc.setFont(undefined, 'normal');
    doc.text(
      [
        'Validity: 1 Year from activation date',
        'Activation Time: Service begins 72 hours after purchase',
        'Number of Services: Max 2 redemptions/year',
        'Coverage: All India',
      ],
      20,
      168
    );

    doc.setFont(undefined, 'bold');
    doc.text('Included Services', 20, 188);
    doc.setFont(undefined, 'normal');
    doc.text(
      [
        '• Towing up to 25 km (₹65/km beyond)',
        '• Flat Tyre Replacement (with your spare)',
        '• Battery Jump Start',
        '• On-Site Minor Repairs',
        '• Locked/Lost Key Support',
        '• Breakdown Support via Phone',
        '• Emergency Message Relay to Relatives',
      ],
      20,
      196
    );

    doc.setFont(undefined, 'bold');
    doc.text('💸 Conditional / Paid Services', 20, 226);
    doc.setFont(undefined, 'normal');
    doc.text(
      [
        '• Fuel Delivery up to 5L (fuel cost extra)',
        '• Vehicle Extraction (off-road recovery)',
        '• Hotel/Taxi/Medical Referral – cost borne by customer',
      ],
      20,
      234
    );

    doc.setFont(undefined, 'bold');
    doc.text('Terms & Conditions', 20, 254);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(
      [
        '• RSA starts 72 hours post-purchase.',
        '• Max 2 services during policy year.',
        '• Free towing up to 25 km. ₹65/km beyond.',
        '• Representative must be present during service.',
        '• RSA support 2+ km from registered address.',
        '• Delays possible in inaccessible areas.',
        '• Off-road damage is customer’s responsibility.',
        '• Private vehicles only eligible.',
      ],
      20,
      262
    );

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('📞 Support Process', 20, 300);
    doc.setFont(undefined, 'normal');
    doc.text(
      [
        '1. Call RSA Helpline',
        '2. Share registered mobile or policy number',
        '3. Share location via SMS',
        '4. Mechanic/towing dispatched',
        '5. Live updates via SMS',
        '6. Service completed & feedback taken',
      ],
      20,
      308
    );

    doc.setFont(undefined, 'bold');
    doc.text('For roadside emergency, help is just one call away.', 20, 338);
    doc.setFont(undefined, 'normal');
    doc.text('Stay safe. Drive worry-free. – Team Kalyan Car Workshop', 20, 346);

    doc.save(`Policy_${policy.customerName}.pdf`);
  };

  if (!policy) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Stepper />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-10 w-10 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-green-600 font-semibold mb-6">Your RSA policy has been activated</p>

          <div className="bg-blue-50 p-4 rounded-md mb-8">
            <h2 className="text-lg font-semibold mb-2">Email Sent Successfully!</h2>
            <p className="text-gray-700">
              A confirmation email with your policy details has been sent to{' '}
              <span className="font-semibold">{policy.email}</span>
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Policy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Policy Number:</p>
                <p className="font-semibold">{policy.id}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Policy Type:</p>
                <p className="font-semibold">{policy.policyType}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer Name:</p>
                <p className="font-semibold">{policy.customerName}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Vehicle Number:</p>
                <p className="font-semibold">{policy.vehicleNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Valid Until:</p>
                <p className="font-semibold">{expiryDate}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Amount Paid:</p>
                <p className="font-semibold">₹{policy.amount + Math.round(policy.amount * 0.18)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">How to use your RSA service</h2>
            <p className="mb-2">In case of emergency, call our 24/7 helpline:</p>
            <div className="bg-blue-600 text-white p-4 rounded-md flex items-center justify-center space-x-2">
              <Phone className="h-5 w-5" />
              <span className="text-xl font-bold">1800-123-4567</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={generatePDF}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Policy
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
