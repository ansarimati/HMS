// migrateMedicalInfo.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import Patient from "../src/app/models/Patient.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });;

// MongoDB URI (use the same one from your .env.local)
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hospitalDB";

async function migrateMedicalInfo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const patients = await Patient.find({});

    for (const patient of patients) {
      let updated = false;

      if (patient.medicalInfo) {
        const newMedicalInfo = {
          allergies: [],
          medications: [],
          diagnoses: [],
          surgeries: [],
          vitals: [],
          insuranceInfo: {
            provider: patient.medicalInfo?.insuranceInfo?.provider || "",
            policyNumber: patient.medicalInfo?.insuranceInfo?.policyNumber || "",
            groupNumber: patient.medicalInfo?.insuranceInfo?.groupNumber || "",
            validUntil: patient.medicalInfo?.insuranceInfo?.validUntil || null,
          },
        };

        if (Array.isArray(patient.medicalInfo.allergies)) {
          newMedicalInfo.allergies = patient.medicalInfo.allergies.map((allergy) => ({
            allergen: allergy,
            reaction: "",
            severity: "Mild",
            status: "Active",
          }));
          updated = true;
        }

        if (Array.isArray(patient.medicalInfo.chronicConditions)) {
          newMedicalInfo.diagnoses = patient.medicalInfo.chronicConditions.map((condition) => ({
            condition,
            severity: "Mild",
            status: "Active",
          }));
          updated = true;
        }

        if (Array.isArray(patient.medicalInfo.currentMedications)) {
          newMedicalInfo.medications = patient.medicalInfo.currentMedications.map((med) => ({
            name: med,
            status: "Active",
          }));
          updated = true;
        }

        if (Array.isArray(patient.medicalInfo.surgeries)) {
          newMedicalInfo.surgeries = patient.medicalInfo.surgeries.map((surgery) => ({
            procedure: surgery,
          }));
          updated = true;
        }

        if (updated) {
          patient.medicalInfo = newMedicalInfo;
          await patient.save();
          console.log(`✅ Migrated patient: ${patient.patientId}`);
        }
      }
    }

    console.log("🎉 Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

migrateMedicalInfo();
