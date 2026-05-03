import express from 'express';
import Member from '../models/Member.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, membershipId, phone, active } = req.body;
    const member = new Member({ name, email, membershipId, phone, active });
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create member', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, membershipId, phone, active } = req.body;
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    member.name = name;
    member.email = email;
    member.membershipId = membershipId;
    member.phone = phone;
    member.active = active;
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update member', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete member', error: error.message });
  }
});

export default router;
