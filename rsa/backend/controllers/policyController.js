import Policy from '../models/Policy.js';
import Customer from '../models/Customer.js';
import Confirmation from '../models/confirmation.js';

// Get all finalized policies
export const getAllPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch details by confirmation ID (to view on frontend)
export const getPolicyPreview = async (req, res) => {
  try {
    const confirmation = await Confirmation.findById(req.params.id).populate('customerId');
    if (!confirmation) return res.status(404).json({ message: 'Confirmation not found' });

    const { policyNumber, expiryDate, paymentDate, policyType } = confirmation;
    const { customerName, vehicleNumber } = confirmation.customerId;

    // Calculate duration
    const start = new Date(paymentDate);
    const end = new Date(expiryDate);
    const durationYears = end.getFullYear() - start.getFullYear();

    const data = {
      policyId: policyNumber,
      customerName,
      vehicleNumber,
      duration: `${durationYears} Years`,
      startDate: paymentDate,
      expiryDate: expiryDate,
      status: 'Active'
    };

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit and move to Policy collection (archive style)
export const finalizePolicy = async (req, res) => {
  try {
    const confirmation = await Confirmation.findById(req.params.id).populate('customerId');
    if (!confirmation) return res.status(404).json({ message: 'Confirmation not found' });

    const { policyNumber, expiryDate, paymentDate } = confirmation;
    const { customerName, vehicleNumber } = confirmation.customerId;
    const durationYears = new Date(expiryDate).getFullYear() - new Date(paymentDate).getFullYear();

    const updatedData = {
      policyId: policyNumber,
      customerName,
      vehicleNumber,
      duration: `${durationYears} Years`,
      startDate: paymentDate,
      expiryDate: expiryDate,
      status: req.body.status || "Active"
    };

    // Create in Policy collection
    const policy = new Policy(updatedData);
    await policy.save();

    // Delete confirmation (archive)
    await Confirmation.findByIdAndDelete(req.params.id);

    res.status(201).json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a finalized policy (Policy model)
export const updatePolicy = async (req, res) => {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!policy) return res.status(404).json({ message: 'Policy not found' });
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
