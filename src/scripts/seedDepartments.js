import Department from "@/app/models/Department";
import dbConnect from "@/lib/dbConnect";

const departments = [
  {
    name: 'General Medicine',
    description: 'General medical care and internal medicine',
    location: 'Building A, Floor 1',
    contactNumber: '+91-9876543201',
    totalBeds: 50,
    availableBeds: 45,
    facilities: ['ECG', 'Basic Lab Tests', 'Consultation Rooms']
  },
  {
    name: 'Cardiology',
    description: 'Heart and cardiovascular system treatment',
    location: 'Building B, Floor 2',
    contactNumber: '+91-9876543202',
    totalBeds: 30,
    availableBeds: 25,
    facilities: ['ECG', 'Echo', 'Stress Test', 'Cardiac Catheterization']
  },
  {
    name: 'Neurology',
    description: 'Brain and nervous system disorders',
    location: 'Building C, Floor 3',
    contactNumber: '+91-9876543203',
    totalBeds: 25,
    availableBeds: 20,
    facilities: ['MRI', 'CT Scan', 'EEG', 'Neurosurgery OT']
  },
  {
    name: 'Orthopedics',
    description: 'Bone, joint, and musculoskeletal system',
    location: 'Building A, Floor 2',
    contactNumber: '+91-9876543204',
    totalBeds: 40,
    availableBeds: 35,
    facilities: ['X-Ray', 'Physiotherapy', 'Orthopedic OT']
  },
  {
    name: 'Pediatrics',
    description: 'Medical care for infants, children, and adolescents',
    location: 'Building D, Floor 1',
    contactNumber: '+91-9876543205',
    totalBeds: 35,
    availableBeds: 30,
    facilities: ['Pediatric ICU', 'Vaccination Center', 'Child Play Area']
  },
  {
    name: 'ICU',
    description: 'Intensive Care Unit for critical patients',
    location: 'Building B, Floor 4',
    contactNumber: '+91-9876543206',
    totalBeds: 20,
    availableBeds: 15,
    facilities: ['Ventilators', 'Cardiac Monitors', '24/7 Nursing']
  },
  {
    name: 'Emergency',
    description: '24/7 Emergency medical services',
    location: 'Building A, Ground Floor',
    contactNumber: '+91-9876543207',
    totalBeds: 15,
    availableBeds: 10,
    facilities: ['Ambulance', 'Emergency OT', 'Trauma Care']
  },
  {
    name: 'Surgery',
    description: 'General and specialized surgical procedures',
    location: 'Building B, Floor 3',
    contactNumber: '+91-9876543208',
    totalBeds: 30,
    availableBeds: 25,
    facilities: ['Multiple OTs', 'Post-op Recovery', 'Surgical ICU']
  }
];

export async function seedDepartment () {
  try {
    await dbConnect();
    
    // Clear existing departments
    await Department.deleteMany({});
    
    // Insert new departments
    const createdDepartments = await Department.insertMany(departments);
    
    console.log(`✅ Successfully seeded ${createdDepartments.length} departments`);
    console.log('Departments created:', createdDepartments.map(d => ({ id: d._id, name: d.name })));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
    process.exit(1);
  }
}

// seedDepartment();