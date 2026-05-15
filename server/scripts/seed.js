import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });
import mongoose from 'mongoose';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

const sampleComplaints = [
  {
    title: 'Major water pipe burst on Main Street',
    description: 'Water flooding the road for 2 hours, traffic blocked.',
    category: 'Water',
    status: 'Pending',
    priority: 'Critical',
    location: { address: '123 Main St, City Center', lat: 28.6139, lng: 77.209 },
  },
  {
    title: 'Streetlight not working near park',
    description: 'Dark area at night, safety concern for pedestrians.',
    category: 'Electricity',
    status: 'In Progress',
    priority: 'High',
    location: { address: '45 Park Ave, North Zone', lat: 28.62, lng: 77.21 },
  },
  {
    title: 'Garbage pileup for a week',
    description: 'Municipal bin overflowing, foul smell spreading.',
    category: 'Garbage',
    status: 'Pending',
    priority: 'High',
    location: { address: '78 Market Rd, East Ward', lat: 28.61, lng: 77.22 },
  },
  {
    title: 'Pothole causing vehicle damage',
    description: 'Large pothole near school crossing, multiple accidents reported.',
    category: 'Road',
    status: 'In Progress',
    priority: 'Critical',
    location: { address: 'School Lane, Sector 5', lat: 28.615, lng: 77.205 },
  },
  {
    title: 'Low water pressure in apartments',
    description: 'Residents on 4th floor have no water since morning.',
    category: 'Water',
    status: 'Resolved',
    priority: 'Medium',
    location: { address: 'Tower B, Green Heights', lat: 28.618, lng: 77.215 },
    adminNote: 'Pressure regulator replaced.',
  },
  {
    title: 'Broken power line after storm',
    description: 'Sparking wires hanging low near sidewalk.',
    category: 'Electricity',
    status: 'Pending',
    priority: 'Critical',
    location: { address: 'Storm Ave, Block C', lat: 28.608, lng: 77.218 },
  },
  {
    title: 'Illegal dumping in vacant lot',
    description: 'Construction debris dumped overnight.',
    category: 'Garbage',
    status: 'Rejected',
    priority: 'Low',
    location: { address: 'Vacant Lot 12, Industrial Area', lat: 28.605, lng: 77.225 },
    adminNote: 'Private property — referred to owner.',
  },
  {
    title: 'Cracked sidewalk tiles',
    description: 'Uneven surface, elderly residents tripping hazard.',
    category: 'Road',
    status: 'Resolved',
    priority: 'Medium',
    location: { address: 'Senior Colony Walkway', lat: 28.612, lng: 77.208 },
  },
  {
    title: 'Sewage smell from drain',
    description: 'Blocked drain causing backup near shops.',
    category: 'Water',
    status: 'In Progress',
    priority: 'High',
    location: { address: 'Shop Row, Downtown', lat: 28.614, lng: 77.212 },
  },
  {
    title: 'Damaged bus stop shelter',
    description: 'Glass panels broken, needs replacement.',
    category: 'Other',
    status: 'Pending',
    priority: 'Low',
    location: { address: 'Bus Stop 7, Highway Road', lat: 28.62, lng: 77.2 },
  },
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI required in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);

  await Complaint.deleteMany({});
  await User.deleteMany({ email: { $in: ['admin@fixmycity.com', 'user@fixmycity.com'] } });

  const admin = await User.create({
    name: 'City Admin',
    email: 'admin@fixmycity.com',
    password: 'Admin@123',
    role: 'admin',
  });

  const user = await User.create({
    name: 'Demo User',
    email: 'user@fixmycity.com',
    password: 'User@123',
    role: 'user',
  });

  const complaints = sampleComplaints.map((c, i) => ({
    ...c,
    submittedBy: i % 2 === 0 ? user._id : admin._id,
    mediaUrls: [],
  }));

  await Complaint.insertMany(complaints);

  console.log('Seed complete:');
  console.log('  Admin: admin@fixmycity.com / Admin@123');
  console.log('  User:  user@fixmycity.com / User@123');
  console.log(`  ${complaints.length} sample complaints created`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
