// "use client";

// import InsuranceInfoCard from "@/components/InsuranceInfoCard ";
// import MedicalHistoryList from "@/components/MedicalHistoryList";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";


// export default function PatientsMedicalHistory () {
//   const { user, isAuthenticated } = useAuth();
//   const [medicalData, setMedicalData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMedicalHistory = async () => {
//       try {
//         const response = await fetch("/api/patients/medical-history", {
//           method: "GET",
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch medical history");
//         };

//         const data = await response.json();
//         setMedicalData(data);
//       } catch (error) {
//         console.error("Error fetching medical history:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isAuthenticated) {
//       fetchMedicalHistory();
//     }
//   }, [isAuthenticated]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!medicalData) return <div>No medical data available.</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">Medical History</h1>
      
//       <div className="grid md:grid-cols-2 gap-8">
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <p><span className="font-medium">Name:</span> {medicalData.personalInfo.firstName} {medicalData.personalInfo.lastName}</p>
//             <p><span className="font-medium">Blood Group:</span> {medicalData.bloodGroup}</p>
//           </div>
          
//           <MedicalHistoryList medicalInfo={medicalData.medicalInfo} />
//         </div>
        
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Insurance Information</h2>
//           <InsuranceInfoCard insuranceInfo={medicalData.medicalInfo.insuranceInfo} />
//         </div>
//       </div>
//     </div>
//   )
// }
"use client";
import { useEffect, useState } from "react";
import {
  Search, Filter, Calendar, AlertTriangle,
  Pill, Stethoscope, Scissors, FileText,
  Download,Eye, ChevronDown, ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";


const PatientsMedicalHistory = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItem, setExpandedItem] = useState({});
  const [medicalData, setMedicalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetch("/api/patients/medical-history", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch medical history");
        };

        const data = await response.json();
        setMedicalData(data);
} catch (error) {
        console.error("Error fetching medical history:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMedicalHistory();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const toggleExpand = (type, id) => {
    const key = `${type}-${id}`;
    setExpandedItem(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';;
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active" : return "text-green-600 bg-green-50";
      case "completed" : return "text-blue-600 bg-blue-50";
      case "discontinued": return "text-gray-600 bg-gray-50";
      default: return 'text-gray-600 bg-gray-50';
    }
  }


  const renderAllergies = () => (
  <div className="space-y-4">
    {medicalData.medicalInfo.allergies.map((allergyStr, index) => {
      // const [allergen, reactionWithSeverity, datePart] = allergyStr.split(" - ");
      // Extract severity from reactionWithSeverity
      // const severityMatch = reactionWithSeverity.match(/\((.*?)\)/);
      // const severity = severityMatch ? severityMatch[1] : "Unknown";
      // const reaction = reactionWithSeverity.replace(/\(.*?\)/, "").trim();
      // Extract date
      // const dateDiscovered = datePart?.replace("Active since ", "").trim();
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-4" key={index}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">{allergyStr.allergen}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(allergyStr.severity)}`}>
                {allergyStr.severity}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor("Active")}`}>
              Active
            </span>
          </div>
          <p className="text-gray-600 mb-2">{allergyStr.reaction}</p>
          <p className="text-sm text-gray-500">
            Discovered: {allergyStr.dateDiscovered ? new Date(allergyStr.dateDiscovered).toLocaleDateString() : "Unknown"}
          </p>
        </div>
      );
    })}
  </div>
);


  const renderMedications = () => (
    <div className="space-y-4">
      {medicalData.medicalInfo.medications.map(medication => (
        <div key={medication} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Pill className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
              <span className="text-gray-600">({medication.dosage})</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(medication.status)}`}>
              {medication.status}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Frequency:</strong> {medication.frequency}</p>
              <p><strong>Purpose:</strong> {medication.purpose}</p>
            </div>
            <div>
              <p><strong>Prescribed by:</strong> {medication.prescribedBy}</p>
              <p><strong>Start Date:</strong> {new Date(medication.startDate).toLocaleDateString()}</p>
              {medication.endDate && <p><strong>End Date:</strong> {new Date(medication.endDate).toLocaleDateString()}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );


const renderDiagnoses = () => (
    <div className="space-y-4">
      {medicalData.medicalInfo.diagnoses.map(diagnosis => {
        const isExpanded = setExpandedItem[`diagnosis-${diagnosis.id}`];
        return (
          <div key={diagnosis} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Stethoscope className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">{diagnosis.condition}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(diagnosis.severity)}`}>
                  {diagnosis.severity}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(diagnosis.status)}`}>
                  {diagnosis.status}
                </span>
                <button
                  onClick={() => toggleExpanded('diagnosis', diagnosis.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <p><strong>Diagnosed by:</strong> {diagnosis.diagnosedBy}</p>
              <p><strong>Date:</strong> {new Date(diagnosis.dateOfDiagnosis).toLocaleDateString()}</p>
              <p><strong>ICD-10:</strong> {diagnosis.icd10}</p>
            </div>
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-gray-600">{diagnosis.notes}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );


const renderSurgeries = () => (
    <div className="space-y-4">
      {medicalData.medicalInfo.surgeries.map(surgery => {
        const isExpanded = setExpandedItem[`surgery-${surgery.id}`];
        return (
          <div key={surgery} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Scissors className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">{surgery.procedure}</h3>
              </div>
              <button
                onClick={() => toggleExpanded('surgery', surgery.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <p><strong>Surgeon:</strong> {surgery.surgeon}</p>
              <p><strong>Date:</strong> {new Date(surgery.dateOfSurgery).toLocaleDateString()}</p>
              <p><strong>Hospital:</strong> {surgery.hospital}</p>
            </div>
            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2"><strong>Complications:</strong> {surgery.complications}</p>
                <p className="text-sm text-gray-600"><strong>Notes:</strong> {surgery.notes}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );


  const renderContent = () => {
    switch (activeTab) {
      case 'allergies': return renderAllergies();
      case 'medications': return renderMedications();
      case 'diagnoses': return renderDiagnoses();
      case 'surgeries': return renderSurgeries();
      default:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Critical Allergies
              </h3>
              {renderAllergies()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Pill className="w-5 h-5 text-blue-500 mr-2" />
                Current Medications
              </h3>
              {renderMedications()}
            </div>
          </div>
        );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!medicalData) return <div>No medical data available.</div>;
  // console.log("medicalData", medicalData);
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical History</h1>
        <p className="text-gray-600">Comprehensive medical records and patient information</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search medical records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {[
            { id: 'all', label: 'Overview', icon: Eye },
            { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
            { id: 'medications', label: 'Medications', icon: Pill },
            { id: 'diagnoses', label: 'Diagnoses', icon: Stethoscope },
            { id: 'surgeries', label: 'Surgeries', icon: Scissors }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Cards (shown on overview) */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium">Critical Allergies</p>
                <p className="text-2xl font-bold text-red-700">{medicalData.medicalInfo.allergies.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Active Medications</p>
                <p className="text-2xl font-bold text-blue-700">{medicalData.medicalInfo.medications.length}</p>
              </div>
              <Pill className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Diagnoses</p>
                <p className="text-2xl font-bold text-green-700">{medicalData.medicalInfo.diagnoses.length}</p>
              </div>
              <Stethoscope className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 font-medium">Past Surgeries</p>
                <p className="text-2xl font-bold text-purple-700">{medicalData.medicalInfo.surgeries.length}</p>
              </div>
              <Scissors className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-gray-50">
        {renderContent()}
      </div>

      {/* Emergency Contact Info (always visible) */}
      <div className="mt-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Emergency Information</h3>
            <p className="text-red-700 text-sm mt-1">
              Patient has critical allergies to Penicillin and Peanuts. Emergency contact: Jane Doe (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsMedicalHistory;